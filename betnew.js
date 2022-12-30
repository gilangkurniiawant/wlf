var request = require('request');
const readlineSync = require('readline-sync');
const delay = require('delay');
var uuide, sesi = 1,
    data_sesi = [];

var headers = {
    'authorization': 'Bearer ',
    'x-requested-with': 'XMLHttpRequest'
};



jum_sesi = 15;
x = 0;
(async() => {
    await get_token();
    for (let cs = 0; cs < jum_sesi; cs++) {
        await get_sesi(cs);
    }
    console.log("Sesi Berhasil");
    var cst = 0;
    while (1) {
        let d = new Date();
        let minutes = d.getMinutes();
        if (minutes == 33 || minutes == 30 || minutes == 59) {
            console.log("Delay 1 menit");
            await delay(63000);
        }
        if (data_sesi[cst]) {
            bet(data_sesi[cst], cst);
            await delay(60);
            if (cst >= (jum_sesi - 1)) {
                cst = 0;
                continue;
            }
        }
        cst++;
        x++;
    }
})();

async function bet(das_token, cnom) {

    await new Promise((resolve) => {


        if (sesi == 1) {
            request.post({
                    url: 'https://wolf.bet/api/v2/dice/auto/play/',
                    form: {
                        uuid: das_token
                    },
                    headers: headers
                },
                async function(e, r, body) {
                    try {
                        body = JSON.parse(body);
                        if (body.hasOwnProperty("bet")) {
                            console.log("| " + x + " " + body.bet.state + " - " + body.bet.amount + " - " + body.bet.profit + " | " + body.userBalance.amount + " #" + cnom + " " + das_token);
                            resolve(1);
                        } else if (body.hasOwnProperty("error")) {
                            if (body.error.message == "Auto-bet has ended or not exists." || body.error.message == "The uuid must be a valid UUID.") {
                                console.log("Sesi Berakhir");

                                sesi = 0;
                                data_sesi[cnom] = 0;
                                await get_sesi(cnom);

                                resolve(0);
                            } else {
                                console.log("Gagal : " + body);
                                resolve(0);
                            }

                        } else {
                            console.log("Gagal : " + body);
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
            function(e, r, body) {

                console.log(body);
                body = JSON.parse(body);
                if (body.hasOwnProperty("autoBet")) {
                    data_sesi[ds] = body.autoBet.uuid;
                    sesi = 1;
                    resolve(1);
                } else {
                    resolve(1);
                    //  get_sesi();
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
