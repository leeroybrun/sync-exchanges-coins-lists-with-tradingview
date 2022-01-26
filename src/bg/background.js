var syncFtxCoins = function(type) {
  ChromeHelper.focusOrCreateTab('https://ftx.com/markets', function(ftxTab) {
    setTimeout(() => {
      console.log('Inject script...');
      chrome.scripting.executeScript({
        target: {tabId: ftxTab.id},
        files: [
          'src/lib/jquery.min.js',
          'src/inject/ftx.js'
        ]
      }, function() {
        console.log('Send message to get coins list...');
        chrome.tabs.sendMessage(ftxTab.id, {action: 'getCoins', coinsType: type}, function(coins) {
          console.log('received response!', coins);
          console.log('Focus TV tab...');
          ChromeHelper.focusOrCreateTab('https://www.tradingview.com/', function(tvTab) {
            console.log('Inject script to TV tab...');
            chrome.scripting.executeScript({
              target: {tabId: tvTab.id},
              files: [
                'src/lib/jquery.min.js',
                'src/lib/bililiteRange.js',
                'src/lib/jquery.sendkeys.js',
                'src/inject/tradingview.js'
              ]
            }, function() {
              console.log('Send message to TV tab to add coins to list...');
              chrome.tabs.sendMessage(tvTab.id, {action: 'addCoinsToList', coins: coins, exchange: 'FTX'}, function(response) {
                console.log('DONE!');
              });
            });
          }, false);
        });
      });
    }, 5000);
  }, false);
}

var syncBinanceCoins = function(type) {
  var url = 'https://www.binance.com/en/markets/futures-perpetual';
  if (type === 'spot') {
    url = 'https://www.binance.com/en/markets/spot-USDT';
  }

  ChromeHelper.focusOrCreateTab(url, function(bnbTab) {
    setTimeout(() => {
      console.log('Inject script...');
      chrome.scripting.executeScript({
        target: {tabId: bnbTab.id},
        files: [
          'src/lib/jquery.min.js',
          'src/inject/binance.js'
        ]
      }, function() {
        console.log('Send message to get coins list...');
        chrome.tabs.sendMessage(bnbTab.id, {action: 'getCoins', coinsType: type}, function(coins) {
          console.log('received response!', coins);
          console.log('Focus TV tab...');
          ChromeHelper.focusOrCreateTab('https://www.tradingview.com/', function(tvTab) {
            console.log('Inject script to TV tab...');
            chrome.scripting.executeScript({
              target: {tabId: tvTab.id},
              files: [
                'src/lib/jquery.min.js',
                'src/lib/bililiteRange.js',
                'src/lib/jquery.sendkeys.js',
                'src/inject/tradingview.js'
              ]
            }, function() {
              console.log('Send message to TV tab to add coins to list...');
              chrome.tabs.sendMessage(tvTab.id, {action: 'addCoinsToList', coins: coins, exchange: 'BINANCE'}, function(response) {
                console.log('DONE!');
              });
            });
          }, false);
        });
      });
    }, 5000);
  }, false);
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (typeof message === 'object' && message.action === 'syncFtxCoins') {
    return syncFtxCoins(message.coinsType);
  }

  if (typeof message === 'object' && message.action === 'syncBinanceCoins') {
    return syncBinanceCoins(message.coinsType);
  }
});

// Wrap in an onInstalled callback in order to avoid unnecessary work
// every time the background script is run
chrome.runtime.onInstalled.addListener(() => {
  // Page actions are disabled by default and enabled on select tabs
  chrome.action.disable();

  // Clear all rules to ensure only our expected rules are set
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    // Declare a rule to enable the action on example.com pages
    let exampleRule = {
      conditions: [
        new chrome.declarativeContent.PageStateMatcher({
          pageUrl: {hostSuffix: 'www.tradingview.com'},
        })
      ],
      actions: [new chrome.declarativeContent.ShowAction()],
    };

    // Finally, apply our new array of rules
    let rules = [exampleRule];
    chrome.declarativeContent.onPageChanged.addRules(rules);
  });
});

var ChromeHelper = {
  findExistingTab: function(url, callback) {
    chrome.windows.getAll({'populate': true}, function(windows) {
      var existing_tab = null;
      for (var i in windows) {
        var tabs = windows[i].tabs;
        for (var j in tabs) {
          var tab = tabs[j];
          if (tab.url == url) {
            existing_tab = tab;
            break;
          }
        }
      }

      callback(existing_tab);
    });
  },
  
  // Remove existing tab, and recreate it
  removeAndCreateTab: function(url) {
    ChromeHelper.findExistingTab(url, function(existing_tab) {
      if (existing_tab) {
        chrome.tabs.remove(existing_tab.id);
      }
      
      chrome.tabs.create({'url': url, 'selected': true});
    });
  },

  // Focus existing tab or create it
  focusOrCreateTab: function(url, callback, reload) {
    callback = callback || function(){};
    reload = typeof reload === undefined ? true : reload;

    ChromeHelper.findExistingTab(url, function(existing_tab) {
      if (existing_tab) {
        chrome.tabs.update(existing_tab.id, {'selected': true});

        if (!reload) {
          console.log('Do not reload tab');
          return callback(existing_tab);
        }

        chrome.tabs.reload(existing_tab.id, {'bypassCache': true}, function() {
          return callback(existing_tab);
        });
      } else {
        chrome.tabs.create({'url': url, 'selected': true}, callback);
      }
    });
  },

  clearStorage: function() {
    chrome.storage.local.clear();
    chrome.storage.sync.clear();
  }
};