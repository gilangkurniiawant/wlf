var WebSocket = require('ws');
var ws = new WebSocket('wss://socket.pasino.com/dice/');

var jum_sesi = process.argv.slice(2);
if (jum_sesi == "") {
    console.log("Jumlah Sesi Tidak Ditemiukan");
    process.exit();
}

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
                "bet_amt": "0.000001",
                "coin": "TRX",
                "type": Math.floor(Math.random() * (2 - 1 + 1)) + 1,
                "payout": "2",
                "winning_chance": "47.50",
                "profit": "0.000001",
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
        } else {
            console.log("|Win " + res.profit + " | " + res.balance);

            nextbet = 0.000001;
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