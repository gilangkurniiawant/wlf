var WebSocket = require('ws');
var ws = new WebSocket('wss://socket.pasino.com/dice/');
var request = require('request');
const readlineSync = require('readline-sync');
const delay = require('delay');

var base_bet,
    bet_besar = 0,
    lb,
    x = 0,
    jum_sesi = process.argv.slice(2);

if (jum_sesi == "") {
    console.log("Jumlah Sesi Tidak Ditemiukan");
    process.exit();
}


(async () => {
    await get_token();
    await get_bet();
    await get_largebet();


    while (1) {
        await get_token();
        await get_bet();

        await get_largebet();

        if (bet_besar > lb) {
            await set_largebet(bet_besar);
            bet_besar = 0;
        }

        await delay(60 * 1000);

    }
})();

ws.on('open', function () {
    ws.send(JSON.stringify({
        'method': 'initialization',
        'socket_token': 'a4691e4389466d6728a5eda51a282d5919c3df0b8815bf96f243101f321aec09'
    }));


});
ws.on('message', function (data, flags) {

    if (data.toString().includes("authenticated")) {
        console.log("Sukses");
        for (let index = 0; index < jum_sesi; index++) {
            ws.send(JSON.stringify({
                "method": "place_bet",
                "bet_amt": base_bet,
                "coin": "TRX",
                "type": Math.floor(Math.random() * (2 - 1 + 1)) + 1,
                "payout": "2",
                "winning_chance": "47.50",
                "profit": base_bet,
                "client_seed": makeid(Math.floor(Math.random() * (32 - 10 + 1)) + 10)

            }));

        }
    } else if (data.toString().includes("bet_update")) {
        //        console.log(data.toString());
        let res = JSON.parse(data.toString());
        let nextbet;
        if (res.win == 0) {
            console.log("|Lose " + res.profit + " | " + res.balance);
            nextbet = Math.abs(res.profit) * 2;
            if (bet_besar < nextbet) {
                bet_besar = nextbet;
            }
        } else {
            console.log("|Win " + res.profit + " | " + res.balance);

            nextbet = base_bet;
        }
        ws.send(JSON.stringify({
            "method": "place_bet",
            "bet_amt": nextbet.toString(),
            "coin": "TRX",
            "type": Math.floor(Math.random() * (2 - 1 + 1)) + 1,
            "payout": "2",
            "winning_chance": "47.50",
            "profit": nextbet.toString(),
            "client_seed": makeid(Math.floor(Math.random() * (32 - 10 + 1)) + 10)

        }));
    } else {
        console.log(data.toString());
    }

});


function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}



async function get_token() {

    await new Promise((resolve) => {


        request.get({
            url: "https://akun.vip/pasino/token.txt",
            agentOptions: {
                rejectUnauthorized: false
            }
        },
            async function (e, r, body) {
                if (e) {
                    console.log("Gagal Mendapatkan Token : " + e);
                    await get_token();
                } else {
                    resolve(token = body);
                }

            });

    });

}

async function get_bet() {

    await new Promise((resolve) => {


        request.get({
            url: "https://akun.vip/pasino/bet.txt",
            agentOptions: {
                rejectUnauthorized: false
            }
        },
            async function (e, r, body) {
                if (e) {
                    console.log("Gagal Mendapatkan Get Bet : " + e);
                    await get_bet();
                } else {
                    resolve(base_bet = body);
                }

            });

    });

}


async function get_largebet() {

    await new Promise((resolve) => {


        request.get({
            url: "https://akun.vip/pasino/lb.txt",
            agentOptions: {
                rejectUnauthorized: false
            }
        },
            async function (e, r, body) {
                if (e) {
                    console.log("Gagal Mendapatkan Largebet : " + e);
                    await get_largebet();
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
            url: "https://akun.vip/pasino/index.php/?lb=" + data,
            agentOptions: {
                rejectUnauthorized: false
            }
        },
            async function (e, r, body) {
                if (e) {
                    console.log("Gagal Set Bet");
                    await set_largebet(data);
                } else {
                    resolve(1);
                }

            });

    });

}

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
