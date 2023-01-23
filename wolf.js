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
    if (op_cmd == "stop") {
        for (let i = 0; i < jum_sesi; i++) {
            console.log("|" + i + " Menutup sesi " + data_sesi[i]);
            await stop_sesi(i);

        }
        jum_sesi = 0;
        process.exit();

    }

    if (op_cmd == "new") {
        fs.writeFileSync('./modul/wolf.json', JSON.stringify([]));
        console.log("Sesi Baru Dibuat");
        process.exit();

    }

    try {

        for (let cs = 0; cs <= jum_sesi; cs++) {
            if (data_sesi[cs] == undefined || data_sesi[cs] == "sesi") {
                data_sesi[cs] = "290724bb-4a4f-4e2f-b5ce-2f8727f4639b";
            }
        }


        for (let i = 0; i <= jum_sesi; i++) {
            bet(i);

        }

    } catch (e) {
        console.log("Error : " + e);
    }

    while (1) {
        await get_bet();
        await get_token();
        await get_largebet();

        if (bet_besar > lb) {
            await set_largebet(bet_besar);
        }

        await delay(60 * 1000);

    }


})();

async function bet(cnom) {
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

        await delay(jum_sesi * 2000);
    }

    await new Promise((resolve) => {

        if (sesi == 1) {
            request.post({
                    url: "https://wolf.bet/api/v2/range-dice/auto/play",
                    form: {
                        uuid: data_sesi[cnom]
                    },
                    headers: headers,
                    timeout: 5000
                },
                async function(e, r, body) {
                    all_exc++;
                    if (all_exc > 2500) {
                        await get_largebet();

                        if (bet_besar > lb) {
                            await set_largebet(bet_besar);
                        }

                        process.exit();
                    }
                    try {
                        body = JSON.parse(body);
                        if (body.hasOwnProperty("bet")) {
                            if (bet_besar < body.bet.amount) {
                                bet_besar = body.bet.amount;
                            }
                            console.log(r.headers['x-ratelimit-remaining'] + " | " + cnom + "# " + all_exc + " " + body.bet.state + " - " + body.bet.amount + " - " + body.bet.profit + " | " + body.userBalance.amount + "- |" + bet_besar + "-" + lb + "| #" + data_sesi[cnom]);
                            if (body.bet.amount > (base_bet * 20000)) {
                                if (body.bet.amount > (base_bet * 100000)) {
                                    await tele(" |Bet Besar Terjadi " + body.bet.amount + " https://wolf.bet/user/transactions?betType=dice&id=" + body.bet.hash + "&modal=bet | Session : https://wolf.bet/user/transactions?betType=session&id=" + data_sesi[cnom] + "&modal=session&table=sessions");
                                }
                                if (body.bet.state !== "loss") {
                                    await stop_sesi(cnom);
                                    await get_sesi(cnom);
                                }
                                await delay(1500);
                            }
                            if (body.bet.amount > (base_bet * 100000)) {
                                await tele("[" + body.bet.state + "] Bet Dihentikan " + body.bet.amount);
                                set_largebet(base_bet);
                                rotate_clint();
                                await stop_sesi(cnom);
                                await get_sesi(cnom);
                                await delay(7500);
                            }

                            if (body.bet.amount < base_bet) {
                                if (body.bet.state !== "loss") {
                                    await stop_sesi(cnom);
                                    await get_sesi(cnom);
                                }
                            }

                            bet(cnom);
                            resolve(1);
                        } else if (body.hasOwnProperty("error")) {
                            if (body.error.message == "Auto-bet has ended or not exists." || body.error.message == "The uuid must be a valid UUID." || body.error.message == "Session has ended or not exists.") {
                                console.log("Sesi Berakhir");
                                await get_sesi(cnom);
                                bet(cnom);
                                resolve(1);
                            } else {
                                console.log("Gagal " + cnom + " : " + JSON.stringify(body));
                                //tele("Gagal " + cnom + " : " + JSON.stringify(body));
                                bet(cnom);
                                resolve(1);
                            }

                        } else {
                            console.log("Gagal " + cnom + " : " + JSON.stringify(body));
                            bet(cnom);
                            resolve(1);
                        }
                    } catch (e) {
                        console.log("Gagal " + cnom + " : " + JSON.stringify(body));
                        await delay(5000);
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
        let roll_atas = randomNomer(50, 90);
        let roll_bawah = roll_atas - 49.5;

        request.post({
                url: "https://wolf.bet/api/v2/range-dice/auto/start",
                form: {
                    "currency": "trx",
                    "game": "dice",
                    "amount": base_bet.toString(),
                    "multiplier": "2.0004",
                    "rule": "between",
                    "bet_value_first": roll_bawah,
                    "bet_value_second": roll_atas,
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
                    }, {
                        "command": [{
                            "name": "stop"
                        }],
                        "when": [{
                            "name": "loss",
                            "value": base_bet * 80000 * 2,
                            "type": "gt"
                        }]
                    }]
                },
                headers: headers,
                timeout: 5000
            },
            async function(e, r, body) {
                console.log(body);
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

async function rotate_clint() {

    await new Promise((resolve) => {

        request.post({
                url: "https://wolf.bet/api/v1/user/seed/refresh",
                form: {
                    "client_seed": makeid(Math.floor(Math.random() * (64 - 10 + 1)) + 10)
                },
                agentOptions: {
                    rejectUnauthorized: false
                },
                headers: headers,
                timeout: 10000
            },
            function(e, r, body) {
                try {
                    console.log(body);
                    body = JSON.parse(body);
                    if (body.hasOwnProperty("seed")) {
                        console.log("Berhasil Rotate Clint ");
                        tele("Rotate Clint : " + body.seed);

                        resolve(1);

                    } else if (body.hasOwnProperty("error")) {
                        if (body.error == "Game in progress. Can not change server seed.") {
                            console.log("Game Proses Rotate Clint");
                            rotate_clint();
                            resolve(1);
                        }

                    } else {
                        console.log("Gagal Rotate Clint : " + JSON.stringify(body));
                        resolve(1);
                    }
                } catch (e) {
                    console.log("ERR Gagal Rotate Seed : " + e);
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


function randomNomer(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
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
