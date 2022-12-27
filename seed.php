<?php
include_once('modul/modul.php');


//error_reporting(0);


function validate_json($str = NULL)
{
    if (is_string($str)) {
        @json_decode($str);
        return (json_last_error() === JSON_ERROR_NONE);
    }
    return false;
}


function inbet(){
    $d['url']= "https://wolf.bet/api/v2/dice/auto/start";
    $d['data'] = '{"currency":"trx","game":"dice","amount":"0.00000001","multiplier":"2.475","rule":"under","bet_value":"40","config":[{"command":[{"name":"resetAmount"}],"when":[{"name":"win","value":1,"type":"every"}]},{"command":[{"name":"increaseAmountPercent","value":100}],"when":[{"name":"lose","value":1,"type":"every"}]}]}';
    $d['header']= 'accept-language: id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7,ru;q=0.6
authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI1IiwianRpIjoiMDE3NjFhZTRmNjNkMGZmMjc0NWEzMTAyMzNhZjczYzQ4ZmI1NTQxYWU0ZTgwMmZlODhlY2Q0MmI4NWRkYzFlOTQzYWZkOGU2NmQ2ODY3OTQiLCJpYXQiOjE2NDM4NzgyNTksIm5iZiI6MTY0Mzg3ODI1OSwiZXhwIjoxNjc1NDE0MjU5LCJzdWIiOiI0MDkwMTMiLCJzY29wZXMiOltdfQ.jzViogy7QKXsLrUE93IvM_KH0ADKKtF1T9wewYqFxhC-Gmc80rTqUYZc_meNVMPYE-m_41sy-2ByEN3zVG-OGdNfvl8TwK2WqVspBcnaUT6ZiqdZLDYKneHdHrAvGQkUKba9Kxg74PPd4S8nV7TkB7MLXYDIDtpRv-ZkLd9dbiSwKH7dJlX_ult4b01m8ph4q1r5kIdSn_KaeZ9Zt_hKwUWIQ0guSF3gS8lHaCyGjrVlczEUWaVllP_YOBS_038HXQwUZ75dG8MMtESYUp3KJmImmgPohYnbgODzj9CvxJfJFHFMW65QfbEUjzbUrFRgp0dp-qQ-IUBUjzITYssgehH5xrDyYBVoHepueOQrzgmw4_wIZ-CCJrAt-aWKGqIks1Z4a0MClnHXuXGPz-lLD3BbAeDRWBn4AMvIikOE3BadvoR_Vks2EQZ73nIkJC8bMVsaB4XRxCPIc2k9eLsnvPCiq5gZtERkGaQU1l66Lbc3zA6YRWDvla8V9vpDf26wW-Ua_fjc0Ba1LW7VGcF46gXOmvcw6uoRBKBomP5M-XiehzTyHRzxAWzlFfqZYJ0uCcZ9RIyBV2M866G90AD2hMknARLEt23uk4FsHQvSDgD3gAK1kKYdvMN8XMH1V7r3XbVmrzE_y8tURqJuG1r135eBZMsm1JwVXwcnfHXVfkg
content-type: application/json
origin: http://wolf.bet
referer: http://wolf.bet/
user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36
x-client-type: Web-Application
x-hash-api: ba6c4afbf4e7264f12097838641d1e9684d2de9840a88581c952afc9a6ee036b
x-requested-with: XMLHttpRequest';
$is = curl($d)['result'];
echo $is;
}

function starbet($id)
{
    $d['url'] = "https://wolf.bet/api/v2/dice/auto/play";
    $d['data'] = '{"uuid":"'.$id.'"}';
    $d['header'] = 'accept-language: id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7,ru;q=0.6
authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI1IiwianRpIjoiMDE3NjFhZTRmNjNkMGZmMjc0NWEzMTAyMzNhZjczYzQ4ZmI1NTQxYWU0ZTgwMmZlODhlY2Q0MmI4NWRkYzFlOTQzYWZkOGU2NmQ2ODY3OTQiLCJpYXQiOjE2NDM4NzgyNTksIm5iZiI6MTY0Mzg3ODI1OSwiZXhwIjoxNjc1NDE0MjU5LCJzdWIiOiI0MDkwMTMiLCJzY29wZXMiOltdfQ.jzViogy7QKXsLrUE93IvM_KH0ADKKtF1T9wewYqFxhC-Gmc80rTqUYZc_meNVMPYE-m_41sy-2ByEN3zVG-OGdNfvl8TwK2WqVspBcnaUT6ZiqdZLDYKneHdHrAvGQkUKba9Kxg74PPd4S8nV7TkB7MLXYDIDtpRv-ZkLd9dbiSwKH7dJlX_ult4b01m8ph4q1r5kIdSn_KaeZ9Zt_hKwUWIQ0guSF3gS8lHaCyGjrVlczEUWaVllP_YOBS_038HXQwUZ75dG8MMtESYUp3KJmImmgPohYnbgODzj9CvxJfJFHFMW65QfbEUjzbUrFRgp0dp-qQ-IUBUjzITYssgehH5xrDyYBVoHepueOQrzgmw4_wIZ-CCJrAt-aWKGqIks1Z4a0MClnHXuXGPz-lLD3BbAeDRWBn4AMvIikOE3BadvoR_Vks2EQZ73nIkJC8bMVsaB4XRxCPIc2k9eLsnvPCiq5gZtERkGaQU1l66Lbc3zA6YRWDvla8V9vpDf26wW-Ua_fjc0Ba1LW7VGcF46gXOmvcw6uoRBKBomP5M-XiehzTyHRzxAWzlFfqZYJ0uCcZ9RIyBV2M866G90AD2hMknARLEt23uk4FsHQvSDgD3gAK1kKYdvMN8XMH1V7r3XbVmrzE_y8tURqJuG1r135eBZMsm1JwVXwcnfHXVfkg
content-type: application/json
origin: http://wolf.bet
referer: http://wolf.bet/
user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36
x-client-type: Web-Application
x-hash-api: ba6c4afbf4e7264f12097838641d1e9684d2de9840a88581c952afc9a6ee036b
x-requested-with: XMLHttpRequest';
    batgen:
    $is = curl($d);
    if (validate_json($is['result'])) {
        $res = json_decode($is['result'],true);
        if(@$res['bet']['state']){
            echo $res['bet']['state'] ." - ".$res['bet']['amount'] ." - ".$res['bet']['profit'] ." | ".$res['userBalance']['amount']."\n"; 
        }
    } else {
        goto batgen;
    }
}


function kseed()
{
    $rseed = hash('sha256', rand(11111111, 99999999) . '' . rand(11111111, 99999999) . '' . rand(11111111, 99999999) . '' . rand(11111111, 99999999) . '' . rand(11111111, 99999999) . '' . rand(11111111, 99999999) . '' . rand(11111111, 99999999) . '' . rand(11111111, 99999999));
    //$rseed = substr($rseed, 0, 64);
    $d['url'] = "https://wolf.bet/api/v1/user/seed/refresh";
    $d['header'] = 'accept-language: id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7,ru;q=0.6
authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI1IiwianRpIjoiMDE3NjFhZTRmNjNkMGZmMjc0NWEzMTAyMzNhZjczYzQ4ZmI1NTQxYWU0ZTgwMmZlODhlY2Q0MmI4NWRkYzFlOTQzYWZkOGU2NmQ2ODY3OTQiLCJpYXQiOjE2NDM4NzgyNTksIm5iZiI6MTY0Mzg3ODI1OSwiZXhwIjoxNjc1NDE0MjU5LCJzdWIiOiI0MDkwMTMiLCJzY29wZXMiOltdfQ.jzViogy7QKXsLrUE93IvM_KH0ADKKtF1T9wewYqFxhC-Gmc80rTqUYZc_meNVMPYE-m_41sy-2ByEN3zVG-OGdNfvl8TwK2WqVspBcnaUT6ZiqdZLDYKneHdHrAvGQkUKba9Kxg74PPd4S8nV7TkB7MLXYDIDtpRv-ZkLd9dbiSwKH7dJlX_ult4b01m8ph4q1r5kIdSn_KaeZ9Zt_hKwUWIQ0guSF3gS8lHaCyGjrVlczEUWaVllP_YOBS_038HXQwUZ75dG8MMtESYUp3KJmImmgPohYnbgODzj9CvxJfJFHFMW65QfbEUjzbUrFRgp0dp-qQ-IUBUjzITYssgehH5xrDyYBVoHepueOQrzgmw4_wIZ-CCJrAt-aWKGqIks1Z4a0MClnHXuXGPz-lLD3BbAeDRWBn4AMvIikOE3BadvoR_Vks2EQZ73nIkJC8bMVsaB4XRxCPIc2k9eLsnvPCiq5gZtERkGaQU1l66Lbc3zA6YRWDvla8V9vpDf26wW-Ua_fjc0Ba1LW7VGcF46gXOmvcw6uoRBKBomP5M-XiehzTyHRzxAWzlFfqZYJ0uCcZ9RIyBV2M866G90AD2hMknARLEt23uk4FsHQvSDgD3gAK1kKYdvMN8XMH1V7r3XbVmrzE_y8tURqJuG1r135eBZMsm1JwVXwcnfHXVfkg
content-type: application/json
origin: http://wolf.bet
referer: http://wolf.bet/
user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36
x-client-type: Web-Application
x-hash-api: ba6c4afbf4e7264f12097838641d1e9684d2de9840a88581c952afc9a6ee036b
x-requested-with: XMLHttpRequest';
    $d['data'] = '{"client_seed":"' . $rseed . '"}';
    batgen:
    $is = curl($d);
    if (validate_json($is['result'])) {
        $res = json_decode($is['result'], true);
        if (@$res['seed']) {
            echo $res['seed'] . "\n";
        } else {
            print_r($res);
        }
    } else {
        goto batgen;
    }
}




function seed()
{
    $d['url'] = "https://wolf.bet/api/v1/game/seed/refresh";
        $d['header'] = 'accept-language: id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7,ru;q=0.6
authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI1IiwianRpIjoiMDE3NjFhZTRmNjNkMGZmMjc0NWEzMTAyMzNhZjczYzQ4ZmI1NTQxYWU0ZTgwMmZlODhlY2Q0MmI4NWRkYzFlOTQzYWZkOGU2NmQ2ODY3OTQiLCJpYXQiOjE2NDM4NzgyNTksIm5iZiI6MTY0Mzg3ODI1OSwiZXhwIjoxNjc1NDE0MjU5LCJzdWIiOiI0MDkwMTMiLCJzY29wZXMiOltdfQ.jzViogy7QKXsLrUE93IvM_KH0ADKKtF1T9wewYqFxhC-Gmc80rTqUYZc_meNVMPYE-m_41sy-2ByEN3zVG-OGdNfvl8TwK2WqVspBcnaUT6ZiqdZLDYKneHdHrAvGQkUKba9Kxg74PPd4S8nV7TkB7MLXYDIDtpRv-ZkLd9dbiSwKH7dJlX_ult4b01m8ph4q1r5kIdSn_KaeZ9Zt_hKwUWIQ0guSF3gS8lHaCyGjrVlczEUWaVllP_YOBS_038HXQwUZ75dG8MMtESYUp3KJmImmgPohYnbgODzj9CvxJfJFHFMW65QfbEUjzbUrFRgp0dp-qQ-IUBUjzITYssgehH5xrDyYBVoHepueOQrzgmw4_wIZ-CCJrAt-aWKGqIks1Z4a0MClnHXuXGPz-lLD3BbAeDRWBn4AMvIikOE3BadvoR_Vks2EQZ73nIkJC8bMVsaB4XRxCPIc2k9eLsnvPCiq5gZtERkGaQU1l66Lbc3zA6YRWDvla8V9vpDf26wW-Ua_fjc0Ba1LW7VGcF46gXOmvcw6uoRBKBomP5M-XiehzTyHRzxAWzlFfqZYJ0uCcZ9RIyBV2M866G90AD2hMknARLEt23uk4FsHQvSDgD3gAK1kKYdvMN8XMH1V7r3XbVmrzE_y8tURqJuG1r135eBZMsm1JwVXwcnfHXVfkg
content-type: application/json
origin: http://wolf.bet
referer: http://wolf.bet/
user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36
x-client-type: Web-Application
x-hash-api: ba6c4afbf4e7264f12097838641d1e9684d2de9840a88581c952afc9a6ee036b
x-requested-with: XMLHttpRequest';
    batgen:
    $is = curl($d);
    if (validate_json($is['result'])) {
        $res = json_decode($is['result'], true);
        if (@$res['server_seed_hashed']) {
            echo $res['server_seed_hashed']. "\n";
        } else {
            print_r($res);
        }
    } else {
        goto batgen;
    }
}


function saldo()
{
    $d['url'] = "https://wolf.bet/api/v1/user/balances";
    $d['header'] = 'accept-language: id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7,ru;q=0.6
authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI1IiwianRpIjoiMDE3NjFhZTRmNjNkMGZmMjc0NWEzMTAyMzNhZjczYzQ4ZmI1NTQxYWU0ZTgwMmZlODhlY2Q0MmI4NWRkYzFlOTQzYWZkOGU2NmQ2ODY3OTQiLCJpYXQiOjE2NDM4NzgyNTksIm5iZiI6MTY0Mzg3ODI1OSwiZXhwIjoxNjc1NDE0MjU5LCJzdWIiOiI0MDkwMTMiLCJzY29wZXMiOltdfQ.jzViogy7QKXsLrUE93IvM_KH0ADKKtF1T9wewYqFxhC-Gmc80rTqUYZc_meNVMPYE-m_41sy-2ByEN3zVG-OGdNfvl8TwK2WqVspBcnaUT6ZiqdZLDYKneHdHrAvGQkUKba9Kxg74PPd4S8nV7TkB7MLXYDIDtpRv-ZkLd9dbiSwKH7dJlX_ult4b01m8ph4q1r5kIdSn_KaeZ9Zt_hKwUWIQ0guSF3gS8lHaCyGjrVlczEUWaVllP_YOBS_038HXQwUZ75dG8MMtESYUp3KJmImmgPohYnbgODzj9CvxJfJFHFMW65QfbEUjzbUrFRgp0dp-qQ-IUBUjzITYssgehH5xrDyYBVoHepueOQrzgmw4_wIZ-CCJrAt-aWKGqIks1Z4a0MClnHXuXGPz-lLD3BbAeDRWBn4AMvIikOE3BadvoR_Vks2EQZ73nIkJC8bMVsaB4XRxCPIc2k9eLsnvPCiq5gZtERkGaQU1l66Lbc3zA6YRWDvla8V9vpDf26wW-Ua_fjc0Ba1LW7VGcF46gXOmvcw6uoRBKBomP5M-XiehzTyHRzxAWzlFfqZYJ0uCcZ9RIyBV2M866G90AD2hMknARLEt23uk4FsHQvSDgD3gAK1kKYdvMN8XMH1V7r3XbVmrzE_y8tURqJuG1r135eBZMsm1JwVXwcnfHXVfkg
content-type: application/json
origin: http://wolf.bet
referer: http://wolf.bet/
user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36
x-client-type: Web-Application
x-hash-api: ba6c4afbf4e7264f12097838641d1e9684d2de9840a88581c952afc9a6ee036b
x-requested-with: XMLHttpRequest';
    batgen:
    
    $is = curl($d);

    if (validate_json($is['result'])) {
        $res = json_decode($is['result'], true);
        if (@$res['balances']) {
            foreach ($res['balances'] as $sal) {
                if ($sal['currency'] == "trx") {
                    return $sal['amount'];
                }
            }
        } else {
            print_r($res);
        }
    } else {
        goto batgen;
    }
}

function tele($data)
{
    $data  = urlencode($data);

    $d['url'] = "https://api.telegram.org/bot1356149887:AAFOD2v7emP9b1AcfhdEQXuRz3hjddvW624/sendMessage?chat_id=@caridolarcair&text=$data";
    $is = curl($d);
}



//inbet();
$x = 0;
lagi:
seed();
kseed();
tele(saldo());

sleep(3);
$x++;
if ($x > 5) {
    $x = 0;
}


//starbet("");
goto lagi;