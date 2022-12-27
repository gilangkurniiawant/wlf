var request = require('request');
const readlineSync = require('readline-sync');
const delay = require('delay');
var uuide, token;

var headers = {
    'authorization': 'Bearer ' + token,
    'x-requested-with': 'XMLHttpRequest'
};

form = {
    uuid: uuide
};
var x = 0;
(async() => {
    await get_token();
    await delay(500);
    await get_sesi();
    console.log("Sesi Berhasil");
    while (1) {
        bet();
        await delay(500);
        x++;


    }
})();

async function bet() {

    await new Promise((resolve) => {



        request.post({
                url: 'https://wolf.bet/api/v2/dice/auto/play',
                form: form,
                headers: headers
            },
            async function(e, r, body) {
                body = JSON.parse(body);
                if (body.hasOwnProperty("bet")) {
                    console.log("| " + x + " " + body.bet.state + " - " + body.bet.amount + " - " + body.bet.profit + " | " + body.userBalance.amount);
                    resolve(1);
                } else if (body.hasOwnProperty("error")) {
                    if (body.error.message == "Auto-bet has ended or not exists." || body.error.message == "The uuid must be a valid UUID.") {
                        console.log("Sesi Berakhir");

                        await get_sesi();

                        resolve(0);
                    } else {
                        console.log("Gagal : " + body);
                        resolve(0);
                    }

                } else {
                    console.log("Gagal : " + body);
                    resolve(0);
                }

            });

    });

}

async function get_sesi() {

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
                body = JSON.parse(body);
                if (body.hasOwnProperty("autoBet")) {
                    form = {
                        uuid: body.autoBet.uuid
                    };
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


        request.post({
                url: "https://akun.vip/wolf/token.txt"
            },
            function(e, r, body) {
                headers = {
                    'authorization': 'Bearer ' + token,
                    'x-requested-with': 'XMLHttpRequest'
                };

            });

    });

}
