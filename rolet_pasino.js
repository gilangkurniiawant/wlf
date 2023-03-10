var request = require('request');
const readlineSync = require('readline-sync');
const delay = require('delay');

var headers = {

};


var base_bet,
    bet_besar = 0,
    lb,
    x = 0,
    jum_sesi = process.argv.slice(2);
if (jum_sesi == "") {
    console.log("Jumlah Sesi Tidak Ditemiukan");
    process.exit();
}
console.log(jum_sesi);



(async() => {
    await get_token();
    await get_bet();
    await get_largebet();

    for (let jum = 0; jum < jum_sesi; jum++) {
        bet(0, base_bet, jum);
        await delay(1000);
    }

    while (1) {
        await get_token();
        await get_bet();

        await get_largebet();

        if (bet_besar > lb) {
            await set_largebet(bet_besar);
        }

        await delay(60 * 1000);

    }
})();



async function bet(nomer, bet_amt, jumx) {
    await randomseed();
    if (bet_amt == undefined) {
        bet_amt = base_bet;
    }

    await new Promise((resolve, reject) => {


        request.post({
                url: 'https://api.pasino.io/roulette/play',
                agentOptions: {
                    rejectUnauthorized: false
                },
                form: JSON.stringify({
                    "token": token,
                    "language": "en",
                    "bet_table": [{
                        "type": "number",
                        "number": "0",
                        "bet_amt": "0.00010000"
                    }],
                    "coin": "TRX",
                    "client_seed": "ry4Tzuuy1y" //makeid(Math.floor(Math.random() * (10 - 10 + 1)) + 10)

                }),
                headers: headers
            },
            async function(e, r, body) {
                try {
                    if (e) {
                        console.log("Gagal : " + e);
                    }
                    body = JSON.parse(body);
                    if (body.hasOwnProperty("balance")) {
                        bet_amt_2 = await perhiutngan(nomer, body, jumx);
                        if (bet_amt == undefined) {
                            bet_amt = base_bet;
                        } else {
                            bet_amt = bet_amt_2;
                        }
                        nomer++;
                        if (bet_besar < bet_amt) {
                            bet_besar = bet_amt;
                        }
                        bet(nomer, bet_amt, jumx);
                    } else {
                        // console.log(body);
                        bet(nomer, bet_amt, jumx);
                    }
                } catch (e) {
                    console.log("Gagal : " + e);
                    await get_token();
                    bet(0, bet_amt, jum);

                }


            });


    });


}


async function perhiutngan(nomer, bet, jumx) {
    var nextbet;
    if (bet.hasOwnProperty("profit")) {
        if (bet.profit > 0) {
            console.log(jumx + "|Win " + nomer + " " + bet.profit + " | " + bet.balance + " # " + bet_besar + " & " + lb + " ->" + bet.bet_id);
            nextbet = base_bet;
        } else {
            console.log(jumx + "|Lose " + nomer + " " + bet.profit + " | " + bet.balance + " # " + bet_besar + " & " + lb + " ->" + bet.bet_id);
            nextbet = Math.abs(bet.profit) * 2;
        }
    } else if (bet.hasOwnProperty("message")) {
        if (bet.message.includes("Please select the game configuration correctly")) {
            cari = bet.message.split("Please select the game configuration correctly.--")[1];
            cari = cari.split(" -- ");

            nextbet = cari[0];
            console.log(nextbet);
        } else if (bet.message.includes("Your balance is not sufficient")) {
            nextbet = base_bet;
        } else {
            nextbet = Math.abs(bet.profit);
            console.log(bet)
        }
    } else {
        nextbet = Math.abs(bet.profit);
        console.log(bet)
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

async function get_bet() {

    await new Promise((resolve) => {


        request.get({
                url: "https://akun.vip/pasino/bet.txt",
                agentOptions: {
                    rejectUnauthorized: false
                }
            },
            function(e, r, body) {
                if (e) {
                    console.log("Gagal Mendapatkan Get Bet : " + e);
                    get_bet();
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
                url: "https://akun.vip/pasino/index.php/?lb=" + data,
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

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

async function randomseed() {
    await new Promise((resolve, reject) => {


        request.post({
                url: 'https://api.pasino.com/roulette/rotate-seed',
                agentOptions: {
                    rejectUnauthorized: false
                },
                form: JSON.stringify({
                    "language": "id",
                    "token": token
                }),
                headers: headers
            },
            async function(e, r, body) {

                try {
                    if (e) {
                        console.log("Gagal : " + e);
                    }
                    body = JSON.parse(body);
                    if (body.hasOwnProperty("seed")) {

                    } else {
                        console.log(body);
                    }
                    resolve(1);
                } catch (e) {
                    console.log("Gagal : " + e);
                    resolve(1);


                }
                resolve(1);


            });


    });


}
