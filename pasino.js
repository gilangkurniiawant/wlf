var request = require('request');
const readlineSync = require('readline-sync');
const delay = require('delay');

var headers = {

};


var base_bet = "0.000001",
    jum_sesi = process.argv.slice(2);

if (jum_sesi == "") {
    console.log("Sesi Tidak Ditemiukan");
    process.exit();
}
console.log(jum_sesi);


x = 0;
(async() => {
    await get_token();

    for (let jum = 0; jum < jum_sesi; jum++) {
        bet(0, base_bet, jum);
    }
    while (1) {
        await delay(60 * 1000);
        await get_token();
    }
})();



async function bet(nomer, bet_amt, jumx) {

    await new Promise((resolve, reject) => {


        request.post({
                url: 'https://api.pasino.io/dice/play',
                agentOptions: {
                    rejectUnauthorized: false
                },
                form: JSON.stringify({
                    "token": token,
                    "language": "en",
                    "bet_amt": bet_amt.toString(),
                    "coin": "TRX",
                    "type": 2,
                    "payout": "2",
                    "winning_chance": "47.50",
                    "profit": bet_amt.toString(),
                    "client_seed": "dsadsad"
                }),
                headers: headers
            },
            async function(e, r, body) {
                if (e) {
                    console.log("Gagal : " + e);
                }
                body = JSON.parse(body);
                if (body.hasOwnProperty("message")) {
                    bet_amt = await perhiutngan(nomer, body, jumx);
                    nomer++;
                    bet(nomer, bet_amt, jumx);
                } else {
                    console.log("Gagal : " + JSON.stringify(body));
                    bet(nomer, bet_amt, jumx);
                }


            });


    });


}


async function perhiutngan(nomer, bet, jumx) {
    var nextbet;
    if (bet.hasOwnProperty("profit")) {
        if (bet.profit > 0) {
            console.log(jumx + "|Win " + nomer + " " + bet.profit + " | " + bet.balance);
            nextbet = base_bet;

        } else {
            console.log(jumx + "|Lose " + nomer + " " + bet.profit + " | " + bet.balance);
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
