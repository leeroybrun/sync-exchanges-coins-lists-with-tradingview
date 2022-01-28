(function() {
	if (window.hasRunFtxContentScript === true)
    return true;  // Will ultimately be passed back to executeScript
	window.hasRunFtxContentScript = true;

  async function filterAndGetFtxCoins(type) {
    // Perpetual
    function showFutures() {
      jQuery('.MuiTabs-root p:contains("Futures")').click();
      jQuery('.MuiFormGroup-root .MuiButtonBase-root.MuiButton-outlinedPrimary').click(); // Disable all
      jQuery('.MuiFormGroup-root .MuiButtonBase-root:contains("Perpetual")').click(); // Enable perpetual
    }

    // Spot
    function showSpot() {
      jQuery('.MuiTabs-root p:contains("Spot")').click();
      jQuery('.MuiFormGroup-root .MuiButtonBase-root.MuiButton-outlinedPrimary').click(); // Disable all
      jQuery('.MuiFormGroup-root .MuiButtonBase-root:contains("USD")').each(function() {
        var $usdBtn = jQuery(this);
        // Only enable USD and not USDT
        if ($usdBtn.text() == 'USD') {
          $usdBtn.click();
        }
      });
    }

    function getCoins() {
      var coins = [];
      jQuery('[class^="MuiTableBody-root"] tr').each(function() {
        var $row = jQuery(this);
        coins.push(jQuery('td:nth-child(4) a', $row).text().replace('-', '').replace('/', ''));
      });

      coins.sort();

      return coins;
    }

    return new Promise((resolve, reject) => {
      setTimeout(function() {
        if (type === 'futures') {
          showFutures();
        } else if (type === 'spot') {
          showSpot();
        }
    
        setTimeout(function() {
          return resolve(getCoins());
        }, 10000);
      }, 2000);
    });
  }

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (typeof message === 'object' && message.action === 'getCoins') {
      filterAndGetFtxCoins(message.coinsType).then(coins => {
        console.log('Got coins list:', coins);

        return sendResponse(coins);
      });

      return true;
    }
  });

  console.log('Injected script!');
})();