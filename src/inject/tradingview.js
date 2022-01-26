(function() {
	if (window.hasRunTvContentScript === true)
        return true;  // Will ultimately be passed back to executeScript
	window.hasRunTvContentScript = true;

    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            if (request.action === 'addCoinsToList' && request.coins) {
                addCoinsToList(request.coins, request.exchange, function() {
                    sendResponse();
                });

                return true;
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
                var rowSymbolTitle = jQuery('[class^="symbolTitle"]', $row).text();

                if (
                    rowSymbolTitle.toLowerCase() == coin.toLowerCase() 
                    && rowExch.toLowerCase() == exch.toLowerCase()
                ) {
                    var $addAction = jQuery('[class^="actionsCell"] [class^="addAction"], [class*=" actionsCell"] [class*=" addAction"]', $row);
                    if ($addAction.length > 0) {
                        $addAction.click();
                        console.log('Add '+ coin +' for '+ exch +' to watchlist');
                    }
                }
            });

            return setTimeout(callback, 2000);
        }, 2000);
    }
})();