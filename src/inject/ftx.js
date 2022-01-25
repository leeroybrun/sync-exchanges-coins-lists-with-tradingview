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
  jQuery('.MuiTableBody-root-319 tr').each(function() {
    var $row = jQuery(this);
    coins.push(jQuery('td:nth-child(4) a', $row).text().replace('-', '').replace('/', ''));
  });

  return coins;
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
      if (request.action === 'getCoins') {
        setTimeout(function() {
          if (request.coinsType === 'futures') {
            showFutures();
          } else if (request.coinsType === 'spot') {
            showSpot();
          }

          setTimeout(function() {
            sendResponse({coins: getCoins()});
          }, 5000);
        }, 2000);
      }
  }
);

console.log('Loaded script.');