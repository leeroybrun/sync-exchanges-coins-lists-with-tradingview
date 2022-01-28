(function() {
	if (window.hasRunBinanceContentScript === true)
    return true;  // Will ultimately be passed back to executeScript
	window.hasRunBinanceContentScript = true;
  
  function getAllCoins(callback, coins) {
    coins = coins || [];

    coins = coins.concat(getCoinsOnPage());

    if (hasNextPage()) {
      goToNextPage();

      setTimeout(() => {
        return getAllCoins(callback, coins);
      }, 5000);
    } else {
      coins.sort();
      return callback(coins);
    }
  }

  function hasNextPage() {
    return !jQuery('#tabContainer [aria-label="Next page"]').is(':disabled');
  }

  function goToNextPage() {
    return jQuery('#tabContainer [aria-label="Next page"]').click();
  }

  function getCoinsOnPage() {
    var coins = [];
    jQuery('#tabContainer #market_trade_list_item > div:first-child > div').each(function() {
      var $row = jQuery(this);
      coins.push($row.text().replace('-', '').replace('/', '').replace('USDTperpetual', 'USDTPERP').replace('BUSDperpetual', 'BUSDERP'));
    });

    return coins;
  }

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (typeof message === 'object' && message.action === 'getCoins') {
      getAllCoins(coins => {
        console.log('Got coins list:', coins);

        return sendResponse(coins);
      });

      return true;
    }
  });

  console.log('Injected script!');
})();