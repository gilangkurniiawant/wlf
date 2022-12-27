var request = require('request');
const readlineSync = require('readline-sync');
const delay = require('delay');

var headers = {
    'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7,ru;q=0.6',
    'authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI1IiwianRpIjoiNGE0MDIzMjIzMzMzYjUxZTljNWRhNzgwZmIyNDk3MzM5ODI4YmI5MGM0NmZlYzI5ZGQ2N2VkZWZmZmExMDg5OTRhMWRjMjkyOGM5MmU0NDIiLCJpYXQiOjE2NDc4NjYwNDQsIm5iZiI6MTY0Nzg2NjA0NCwiZXhwIjoxNjc5NDAyMDQ0LCJzdWIiOiI0MDkwMTMiLCJzY29wZXMiOltdfQ.N0EjBJ0i2rSQemo_ug6J3-fKTIhMABv09Xw1J6ay8RaIpgdv1eRuSNeV6nPXTt2zcb8hBxeAZc8MwpgQj9OEnzmBGd22nj1rLWaERqkwR7RmSyD844S_EBlB2rivfa6gjxQl0alyb1OeaTIeqnAji5JI6gk79d2CCbK2AyKsCpeoID9aT6J0Nl3RKmg-tjRC-B_RNUMSibbu3kD1mnvuSTucdZTKvKRQ_k33gUG3A03wviYtQDwWLiIx1_K_gvOClFFT3GAOA7pTn9BPGrR5xZxk8_NtzTmC2UxT3vPjL704QjoTqH6tLYwQrpOKrPauHu-1k6ee2QsHX2OKuup_k0SawEOBSq6rxSHIDSnX0YR_rv-VqP4bljeMhosTI89tRQwHDHCVQtzTmQHTu-c0K3-gx1FakXLTzQBQMeTDcIxJUKEHCiV3vTd9ygn3t2XOgFaWHuJeYVeH0Qyxptjjiy21ZIhvPsGMM1vuTWIOaUqRk3g6ma8H72AitrkRH4AGy4a0YW7cjAv7VVC_fAuTK2gn7DSykQNSTEttOvEGOUhZaMaa1Wqo2sUmiFKoA55Lh-Jgg8UVvkx1RXVtJbqadlvELgOCBqw_HO359gjd55LAYZosXtv8nG2V3Opgxt1LZmJbB2HDuQv6uaPBT_pc2s_1uIoq58Sen3v0SZ9JJoQ',
    'content-type': 'application/json',
    'origin': 'http://wolf.bet',
    'referer': 'http://wolf.bet/',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36',
    'x-client-type': 'Web-Application',
    'x-hash-api': 'ba6c4afbf4e7264f12097838641d1e9684d2de9840a88581c952afc9a6ee036b',
    'x-requested-with': 'XMLHttpRequest'
};
var uuide = "18213a7b-8fef-4d1b-9932-285590216f13";
form = {
    uuid: uuide
};
var x = 0;
(async() => {
    await get_sesi();
    console.log("Sesi Berhasil");
    while (1) {
        bet();
        await delay(360);
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
