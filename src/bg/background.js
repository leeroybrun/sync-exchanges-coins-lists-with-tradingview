window.syncFtxCoins = function(type) {
  ChromeHelper.focusOrCreateTab('https://ftx.com/markets', function(ftxTab) {
    console.log('Inject script...');
    chrome.tabs.executeScript(ftxTab.id, { 
      file: 'src/inject/ftx.js',
      runAt: 'document_end'
    }, function(res) {
      console.log('res', res);
      console.log('injected!');
      console.log('Send message to get coins list...');
      chrome.tabs.sendMessage(ftxTab.id, {action: 'getCoins', type: type}, function(response) {
        console.log('received response!', response);
        /*console.log('Focus TV tab...');
        ChromeHelper.focusOrCreateTab('https://www.tradingview.com/', function(tvTab) {
          console.log('Send message to TV tab to add coins to list...');
          chrome.tabs.sendMessage(tvTab.id, {action: 'addCoinsToList', coins: response.coins, exchange: 'FTX'}, function(response) {
            console.log('DONE!');
          });
        }, false);*/
      });
    });
  });
}

chrome.extension.onMessage.addListener(
  function(message, sender, sendResponse) {
    console.log('received meddage', message);
  	if(typeof message === 'object') {
      if (message.type === 'showPageAction') {
        chrome.pageAction.show(sender.tab.id);
      }
    }
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
      reload = reload || true;
  
      ChromeHelper.findExistingTab(url, function(existing_tab) {
        if (existing_tab) {
          chrome.tabs.update(existing_tab.id, {'selected': true});

          if (!reload) {
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