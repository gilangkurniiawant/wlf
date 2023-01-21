var request = require('request');
const readlineSync = require('readline-sync');
const delay = require('delay');
var uuide, sesi = 1,
    data_sesi = [];
var ip = require("ip");

var headers = {
    'authorization': 'Bearer ',
    'x-requested-with': 'XMLHttpRequest'
};
var fs = require('fs');


var jum_sesi = process.argv.slice(2)[0],
    op_cmd = process.argv.slice(2)[1],
    end_sesi = false,
    bet_besar = 0,
    myip = ip.address(),
    base_bet,
    r_seed = false,
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

    await get_bet();
    await get_token();
    await get_largebet();
    try {
        for (let i = 0; i <= jum_sesi; i++) {
            if (data_sesi[i] > 0) {
                bet(data_sesi[i], i);
            } else {
                bet(base_bet, i);
            }

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

async function bet(jum_bet, cnom) {
    d = new Date();
    minutes = d.getMinutes();
    if (minutes == 15) {
        if (!r_seed) {
            await delay(10 * 1000);
            await rotate_seed();
            console.log("Delay 1 menit");
            await delay(5 * 1000);
        }
    } else if (minutes == 45) {
        r_seed = false;

    }
    if (end_sesi) {
        await delay(jum_sesi * 5000);
    }

    await new Promise((resolve) => {

        if (sesi == 1) {
            request.post({
                    url: 'https://wolf.bet/api/v1/dice/manual/play',
                    form: {
                        "currency": "trx",
                        "game": "dice",
                        "amount": jum_bet.toString(),
                        "multiplier": "2",
                        "rule": "under",
                        "bet_value": "49.5",
                        "auto": 1
                    },
                    headers: headers,
                    timeout: 5000
                },
                async function(e, r, body) {
                    all_exc++;
                    if (all_exc > 1000) {
                        fs.writeFileSync('./modul/wolf.json', JSON.stringify(data_sesi));
                        await get_largebet();

                        if (bet_besar > lb) {
                            await set_largebet(bet_besar);
                        }
                        await delay(1000);
                        process.exit();
                    }
                    try {
                        body = JSON.parse(body);
                        if (body.hasOwnProperty("bet")) {
                            if (bet_besar < body.bet.amount) {
                                bet_besar = body.bet.amount;
                            }
                            console.log("| " + cnom + "# " + all_exc + " " + body.bet.state + " - " + body.bet.amount + " - " + body.bet.profit + " | " + body.userBalance.amount + "- |" + bet_besar + "-" + lb);
                            if (body.bet.state == "win") {
                                jum_bet = base_bet;
                            } else {
                                jum_bet = jum_bet * 2;
                            }
                            data_sesi[cnom] = jum_bet;
                            if (body.bet.amount > (base_bet * 20000)) {
                                if (body.bet.amount > (base_bet * 100000)) {
                                    await tele(myip + " |Bet Besar Terjadi " + body.bet.amount + " https://wolf.bet/user/transactions?betType=dice&id=" + body.bet.hash + "&modal=bet | Session : https://wolf.bet/user/transactions?betType=session&id=" + data_sesi[cnom] + "&modal=session&table=sessions");
                                }
                                await delay(1500);
                            }
                            bet(jum_bet, cnom);
                            resolve(1);
                        } else {
                            console.log("Gagal " + cnom + " : " + JSON.stringify(body));
                            bet(jum_bet, cnom);
                            resolve(1);
                        }
                    } catch (e) {
                        console.log("Gagal " + cnom + " : " + JSON.stringify(body));
                        await delay(5000);
                        bet(jum_bet, cnom);
                        resolve(1);
                    }

                });
        }

    });

}

process.on("SIGINT", async() => {
    end_sesi = true;
    await delay(jum_sesi * 500);
    console.log(" [+] Menutup program");
    fs.writeFileSync('./modul/wolf.json', JSON.stringify(data_sesi));
    await delay(2000);
    process.exit(0);
})

async function get_sesi(ds) {

    await new Promise((resolve) => {


        request.post({
                url: "https://wolf.bet/api/v2/dice/auto/start",
                form: {
                    "currency": "trx",
                    "game": "dice",
                    "amount": base_bet.toString(),
                    "multiplier": "2",
                    "rule": "under",
                    "bet_value": "49.5",
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
                    "uuid": data_sesi[ds]
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
                data_sesi[ds] = "290724bb-4a4f-4e2f-b5ce-2f8727f4639b";
                fs.writeFileSync('./modul/wolf.json', JSON.stringify(data_sesi));
                resolve(1);

            });

    });

}

async function rotate_seed() {

    await new Promise((resolve) => {

        request.get({
                url: "https://wolf.bet/api/v1/game/seed/refresh",
                agentOptions: {
                    rejectUnauthorized: false
                },
                headers: headers,
                timeout: 10000
            },
            function(e, r, body) {
                try {
                    body = JSON.parse(body);
                    if (body.hasOwnProperty("server_seed_hashed")) {
                        console.log("Berhasil Rotate Seed " + ds);
                        r_seed = true;
                        resolve(1);

                    } else {
                        console.log("Gagal Rotate Seed : " + JSON.stringify(body));
                        resolve(1);
                    }
                } catch (e) {
                    console.log("Gagal Rotate Seed : " + body);
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

async function tele(data) {

    await new Promise((resolve) => {


        request.get({
                url: "https://api.telegram.org/bot1356149887:AAFOD2v7emP9b1AcfhdEQXuRz3hjddvW624/sendMessage?chat_id=@caridolarcair&text=" + encodeURIComponent(data) + "&parse_mode=HTML&disable_web_page_preview=1",
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

async function get_bet() {

    await new Promise((resolve) => {


        request.get({
                url: "https://akun.vip/wolf/bet.txt",
                agentOptions: {
                    rejectUnauthorized: false
                }
            },
            function(e, r, body) {
                if (e) {
                    console.log("Gagal Mendapatkan Get Bet : " + e);
                    get_bet();

                } else {
                    resolve(base_bet = Number(body));
                }

            });

    });

}
