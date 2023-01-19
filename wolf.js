var request = require('request');
const readlineSync = require('readline-sync');
const delay = require('delay');
var uuide, sesi = 1,
    data_sesi = [];

var headers = {
    'authorization': 'Bearer ',
    'x-requested-with': 'XMLHttpRequest'
};


jum_sesi = process.argv.slice(2),
    end_sesi = false;
x = 0;
if (jum_sesi == "") {
    console.log("Jumlah Sesi Tidak Ditemiukan");
    process.exit();
}

(async() => {
    await get_token();

    try {
        for (let cs = 0; cs < jum_sesi; cs++) {
            await get_sesi(cs);
            console.log(data_sesi[cs]);

        }

        for (let i = 0; i < data_sesi.length; i++) {
            bet(i);

        }

    } catch (e) {
        console.log("Error : " + e);
    }
})();

async function bet(cnom) {
    if (end_sesi) {

        await delay(jum_sesi * 2000);
    }
    let d = new Date();
    let minutes = d.getMinutes();
    if (minutes == 30 || minutes == 30 || minutes == 59) {
        console.log("Delay 1 menit");
        await delay(90000);
    }

    await new Promise((resolve) => {


        if (sesi == 1) {
            request.post({
                    url: 'https://wolf.bet/api/v2/dice/auto/play/',
                    form: {
                        uuid: data_sesi[cnom]
                    },
                    headers: headers
                },
                async function(e, r, body) {
                    try {
                        body = JSON.parse(body);
                        if (body.hasOwnProperty("bet")) {
                            console.log("| " + cnom + " " + body.bet.state + " - " + body.bet.amount + " - " + body.bet.profit + " | " + body.userBalance.amount + " #" + data_sesi[cnom]);
                            await bet(cnom);
                        } else if (body.hasOwnProperty("error")) {
                            if (body.error.message == "Auto-bet has ended or not exists." || body.error.message == "The uuid must be a valid UUID.") {
                                console.log("Sesi Berakhir");
                                await get_sesi(cnom);
                                await bet(cnom);
                                resolve(0);
                            } else {
                                console.log("Gagal : " + JSON.stringify(body));
                                resolve(0);
                            }

                        } else {
                            console.log("Gagal : " + JSON.stringify(body));
                            resolve(0);
                        }
                    } catch (e) {
                        console.log("Gagal : " + e);
                        resolve(0);
                    }

                });
        }

    });

}

process.on("SIGINT", async() => {
    end_sesi = true;
    console.log(" [+] Menutup program");
    for (let i = 0; i < data_sesi.length; i++) {
        console.log("Menutup sesi " + data_sesi[i]);
        await stop_sesi(data_sesi[i]);

    }
    process.exit(0);
})

async function get_sesi(ds) {

    await new Promise((resolve) => {


        request.post({
                url: "https://wolf.bet/api/v2/dice/auto/start",
                form: {
                    "currency": "trx",
                    "game": "dice",
                    "amount": "0.00000001",
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
                headers: headers
            },
            async function(e, r, body) {
                try {
                    body = JSON.parse(body);
                    if (body.hasOwnProperty("autoBet")) {
                        data_sesi[ds] = body.autoBet.uuid;
                        resolve(1);
                    } else if (body.hasOwnProperty("error")) {
                        if (body.error == "Too Many Attempts.") {
                            console.log("Terlalu Banyak Sesi");
                            await delay(60000);
                            get_sesi();
                        }
                        get_sesi();
                    } else {
                        console.log("Gagal Mendapatkan Sesi Pharse : " + JSON.stringify(body));
                        get_sesi();
                    }
                } catch (e) {
                    console.log("Gagal Mendapatkan Sesi Body : " + e);
                    get_sesi(ds);
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
                headers: headers
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
