var request = require('request');
const readlineSync = require('readline-sync');
const delay = require('delay');
var uuide, sesi = 1,
    data_sesi = [];

var headers = {
    'authorization': 'Bearer ',
    'x-requested-with': 'XMLHttpRequest'
};
var fs = require('fs');


var jum_sesi = process.argv.slice(2)[0],
    op_cmd = process.argv.slice(2)[1],
    end_sesi = false,
    bet_besar = 0,
    lb;
x = 0;
if (jum_sesi == "") {
    console.log("Jumlah Sesi Tidak Ditemiukan");
    process.exit();
}


var all_exc = 0;
var all_sesi = fs.readFileSync('./modul/wolf.json');
try {
    var data_sesi = JSON.parse(all_sesi);
} catch (error) {
    var data_sesi = [];
}

(async() => {
    await get_token();
    await get_largebet();
    console.log(op_cmd);
    if (op_cmd == "stop") {
        for (let i = 0; i < jum_sesi; i++) {
            console.log("|" + i + " Menutup sesi " + data_sesi[i]);
            await stop_sesi(data_sesi[i]);
        }

    }

    try {

        for (let cs = 0; cs <= jum_sesi; cs++) {
            if (data_sesi[cs] == undefined) {
                data_sesi[cs] = "sesi";
            }
        }

        for (let i = 0; i <= jum_sesi; i++) {
            bet(i);

        }

    } catch (e) {
        console.log("Error : " + e);
    }

    while (1) {
        await get_token();
        await get_largebet();

        if (bet_besar > lb) {
            await set_largebet(bet_besar);
        }

        await delay(60 * 1000);

    }


})();

async function bet(cnom) {
    if (end_sesi) {

        await delay(jum_sesi * 2000);
    }
    let d = new Date();
    let minutes = d.getMinutes();

    await new Promise((resolve) => {

        if (sesi == 1) {
            request.post({
                    url: 'https://wolf.bet/api/v2/dice/auto/play/',
                    form: {
                        uuid: data_sesi[cnom]
                    },
                    headers: headers,
                    timeout: 5000
                },
                async function(e, r, body) {
                    all_exc++;
                    if (all_exc > 10000) {
                        process.exit();
                    }
                    try {
                        body = JSON.parse(body);
                        if (body.hasOwnProperty("bet")) {
                            if (bet_besar < body.bet.amount) {
                                bet_besar = body.bet.amount;
                            }
                            console.log("| " + cnom + "# " + all_exc + " " + body.bet.state + " - " + body.bet.amount + " - " + body.bet.profit + " | " + body.userBalance.amount + "- |" + bet_besar + "-" + lb + "| #" + data_sesi[cnom]);
                            bet(cnom);
                        } else if (body.hasOwnProperty("error")) {
                            if (body.error.message == "Auto-bet has ended or not exists." || body.error.message == "The uuid must be a valid UUID.") {
                                console.log("Sesi Berakhir");
                                await get_sesi(cnom);
                                bet(cnom);
                                resolve(1);
                            } else {
                                console.log("Gagal " + cnom + " : " + JSON.stringify(body));
                                bet(cnom);
                                resolve(1);
                            }

                        } else {
                            console.log("Gagal " + cnom + " : " + JSON.stringify(body));
                            bet(cnom);
                            resolve(1);
                        }
                    } catch (e) {
                        console.log("Gagal " + cnom + " : " + e);
                        bet(cnom);
                        resolve(1);
                    }

                });
        }

    });

}

process.on("SIGINT", async() => {
    end_sesi = true;
    console.log(" [+] Menutup program");
    /*
    for (let i = 0; i < data_sesi.length; i++) {
        console.log("|" + i + " Menutup sesi " + data_sesi[i]);
        await stop_sesi(data_sesi[i]);

    }
    */
    process.exit(0);
})

async function get_sesi(ds) {

    await new Promise((resolve) => {


        request.post({
                url: "https://wolf.bet/api/v2/dice/auto/start",
                form: {
                    "currency": "trx",
                    "game": "dice",
                    "amount": "0.000001",
                    "multiplier": "1.98",
                    "rule": "under",
                    "bet_value": "50",
                    "config": [{
                        "command": [{
                            "name": "resetAmount"
                        }],
                        "when": [{
                            "name": "win",
                            "value": 1,
                            "type": "every"
                        }]
                    }, {
                        "command": [{
                            "name": "increaseAmountPercent",
                            "value": 100
                        }],
                        "when": [{
                            "name": "lose",
                            "value": 1,
                            "type": "every"
                        }]
                    }]
                },
                headers: headers,
                timeout: 5000
            },
            async function(e, r, body) {
                try {
                    body = JSON.parse(body);
                    if (body.hasOwnProperty("autoBet")) {
                        data_sesi[ds] = body.autoBet.uuid;
                        fs.writeFileSync('./modul/wolf.json', JSON.stringify(data_sesi));
                        resolve(1);
                    } else if (body.hasOwnProperty("error")) {
                        if (body.error == "Too Many Attempts.") {
                            console.log("Terlalu Banyak Sesi " + ds);
                            await delay(60000);
                            resolve(1);

                        }
                        resolve(1);
                    } else {
                        console.log("Gagal Mendapatkan Sesi Pharse : " + JSON.stringify(body));
                        resolve(1);
                    }
                } catch (e) {
                    console.log("Gagal Mendapatkan Sesi Body : " + e);
                    resolve(1);
                }

            });

    });

}

async function stop_sesi(ds) {

    await new Promise((resolve) => {


        request.post({
                url: "https://wolf.bet/api/v2/dice/auto/stop",
                form: {
                    "uuid": ds
                },
                headers: headers,
                timeout: 5000
            },
            function(e, r, body) {
                if (body == "") {
                    console.log("Berhasil Stop Sesi " + ds);
                    resolve(1);
                }
                try {
                    resolve(1);

                } catch (e) {
                    console.log("Gagal Stop Sesi : " + e);
                    resolve(1);
                }

            });

    });

}

async function get_token() {

    await new Promise((resolve) => {


        request.get({
                url: "https://akun.vip/wolf/token.txt",
                agentOptions: {
                    rejectUnauthorized: false
                }
            },
            function(e, r, body) {
                if (e) {
                    console.log("Gagal Mendapatkan Token : " + e);
                }
                resolve(headers = {
                    'authorization': 'Bearer ' + body,
                    'x-requested-with': 'XMLHttpRequest'
                });

            });

    });

}


async function get_largebet() {

    await new Promise((resolve) => {


        request.get({
                url: "https://akun.vip/wolf/lb.txt",
                agentOptions: {
                    rejectUnauthorized: false
                }
            },
            function(e, r, body) {
                if (e) {
                    console.log("Gagal Mendapatkan Largebet : " + e);
                    get_largebet();
                } else {
                    console.log("Largebet : " + body);
                    resolve(lb = body);
                }

            });

    });

}

async function set_largebet(data) {

    await new Promise((resolve) => {


        request.get({
                url: "https://akun.vip/wolf/index.php/?lb=" + data,
                agentOptions: {
                    rejectUnauthorized: false
                }
            },
            function(e, r, body) {
                if (e) {
                    console.log("Gagal Set Bet");
                    set_largebet(data);
                } else {
                    resolve(1);
                }

            });

    });

}
