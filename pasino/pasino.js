var request = require('request');
const readlineSync = require('readline-sync');
const delay = require('delay');

var headers = {

};


//
var base_bet = 0.1,
    jum_sesi = 100;


jum_sesi = 5;
x = 0;
(async() => {
    await get_token();

    for (let jum = 0; jum < jum_sesi; jum++) {
        bet(0, base_bet);
    }
    while (1) {
        await delay(60 * 1000);
        await get_token();
    }
})();



async function bet(nomer, bet_amt) {

    await new Promise((resolve, reject) => {


        request.post({
                url: 'https://api.pasino.io/dice/play',
                form: JSON.stringify({
                    "token": token,
                    "language": "en",
                    "bet_amt": bet_amt.toString(),
                    "coin": "GEM",
                    "type": 2,
                    "payout": "2.0000",
                    "winning_chance": "47.50",
                    "profit": bet_amt.toString(),
                    "client_seed": "dsadsad"
                }),
                headers: headers
            },
            async function(e, r, body) {

                body = JSON.parse(body);
                if (body.hasOwnProperty("message")) {
                    bet_amt = await perhiutngan(nomer, body);
                    nomer++;
                    bet(nomer, bet_amt);
                } else {
                    console.log("Gagal : " + JSON.stringify(body));
                    bet(nomer, bet_amt);
                }


            });


    });


}


async function perhiutngan(nomer, bet) {
    var nextbet;
    if (bet.hasOwnProperty("profit")) {
        if (bet.profit > 0) {
            console.log("|Win " + nomer + " " + bet.profit + " | " + bet.balance);
            nextbet = base_bet;

        } else {
            console.log("|Lose " + nomer + " " + bet.profit + " | " + bet.balance);
            nextbet = Math.abs(bet.profit) * 2;
        }
    } else if (bet.hasOwnProperty("message")) {
        if (bet.message.includes("Please select the game configuration correctly")) {
            cari = bet.message.split("Please select the game configuration correctly.--")[1];
            cari = cari.split(" -- ");

            nextbet = cari[0];
            console.log(nextbet);
        }

    }

    return nextbet;


}


async function get_token() {

    await new Promise((resolve) => {


        request.get({
                url: "https://akun.vip/pasino/token.txt",
                agentOptions: {
                    rejectUnauthorized: false
                }
            },
            function(e, r, body) {
                if (e) {
                    console.log("Gagal Mendapatkan Token : " + e);
                }
                resolve(token = body);

            });

    });

}
