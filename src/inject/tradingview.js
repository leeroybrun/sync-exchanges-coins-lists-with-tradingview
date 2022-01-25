/*var coins = ['BTCPERP','ETHPERP','SOLPERP','FTMPERP','ATOMPERP','LUNAPERP','DOGEPERP','MATICPERP','NEARPERP','AVAXPERP','ADAPERP','LINKPERP','DOTPERP','FTTPERP','XRPPERP','BNBPERP','SANDPERP','ALTPERP','LOOKSPERP','CRVPERP','LTCPERP','LRCPERP','EOSPERP','ONEPERP','BCHPERP','SUSHIPERP','MANAPERP','ALGOPERP','AXSPERP','GALAPERP','DYDXPERP','XLMPERP','FILPERP','SRMPERP','FLOWPERP','CROPERP','KNCPERP','SPELLPERP','AAVEPERP','SHIBPERP','CREAMPERP','RUNEPERP','MAPSPERP','TRXPERP','XTZPERP','ENJPERP','XMRPERP','VETPERP','YFIPERP','OMGPERP','ENSPERP','USDTPERP','SNXPERP','UNIPERP','SXPPERP','RAYPERP','ROSEPERP','MKRPERP','ICPPERP','SLPPERP','STXPERP','ARPERP','ETCPERP','WAVESPERP','CHZPERP','RSRPERP','ZECPERP','THETAPERP','PERPPERP','EGLDPERP','GRTPERP','OXYPERP','OKBPERP','BSVPERP','1INCHPERP','CHRPERP','DEFIPERP','COMPPERP','KSHIBPERP','STORJPERP','FIDAPERP','RNDRPERP','HNTPERP','KSMPERP','RENPERP','BATPERP','CAKEPERP','ALICEPERP','BADGERPERP','PEOPLEPERP','BANDPERP','HBARPERP','REEFPERP','MIDPERP','CLVPERP','IOTAPERP','TONCOINPERP','SHITPERP','C98PERP','KAVAPERP','TLMPERP','ATLASPERP','AUDIOPERP','BALPERP','NEOPERP','ICXPERP','SCPERP','SCRTPERP','XEMPERP','DASHPERP','ZILPERP','BOBAPERP','STEPPERP','AGLDPERP','DODOPERP','KINPERP','HTPERP','ZRXPERP','EDENPERP','DENTPERP','EXCHPERP','BITPERP','QTUMPERP','STMXPERP','AMPLPERP','DRGNPERP','ALPHAPERP','LINAPERP','PRIVPERP','ALCXPERP','MCBPERP','TOMOPERP','SKLPERP','MTLPERP','TRUPERP','HOTPERP','YFIIPERP','CELOPERP','CVCPERP','POLISPERP','PROMPERP','ROOKPERP','BNTPERP','PUNDIXPERP','LEOPERP','ONTPERP','RONPERP','FLMPERP','CELPERP','HUMPERP','MTAPERP','PAXGPERP','MNGOPERP','BAOPERP','RAMPPERP','TULIPPERP','MVDA10PERP','KSOSPERP','DAWNPERP','ORBSPERP','UNISWAPPERP','SRNPERP','MVDA25PERP','CONVPERP','XAUTPERP','SOSPERP','MERPERP','HOLYPERP','TRYBPERP','SECOPERP','ASDPERP','MEDIAPERP','CUSDTPERP','BRZPERP'];
var exchange = 'FTX';

*/

chrome.runtime.sendMessage({type: 'showPageAction'});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.action === 'addCoinsToList') {
            addCoinsToList(request.coins, request.exchange, function() {
                sendResponse({result: true});
            });
        }
    }
);

function addCoinsToList(coins, exch, callback, i) {
    i = i || 0;

    addCoinToList(coins[i], exch, function() {
        i++;
        if (i < coins.length) {
            addCoinsToList(coins, exch, callback, i);
        } else {
            return callback();
        }
    });
}

function addCoinToList(coin, exch, callback) {
    var $dialog = jQuery('[data-name=watchlist-symbol-search-dialog]');
    var $search = jQuery('input[data-role=search]', $dialog);
    $search.val('').sendkeys(coin);

    setTimeout(function() {
        jQuery('[class^="listContainer"] [class^="itemRow"]', $dialog).each(function() {
            var $row = jQuery(this);
            var rowExch = jQuery('[class^="exchangeName"]', $row).text();
            if (rowExch == exch) {
                var $addAction = jQuery('[class^="actionsCell"] [class^="addAction"], [class*=" actionsCell"] [class*=" addAction"]', $row);
                if ($addAction.length > 0) {
                    $addAction.click();
                    console.log('Add '+ coin +' for '+ exch +' to watchlist');
                }

                setTimeout(callback, 2000);
            }
        });
    }, 2000);
}