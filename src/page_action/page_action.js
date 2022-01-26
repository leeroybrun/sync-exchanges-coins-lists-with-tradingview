document.getElementById('btn-ftx-futures').onclick = function() { 
  chrome.runtime.sendMessage({ action: "syncFtxCoins", coinsType: 'futures' });
};
document.getElementById('btn-ftx-spot').onclick = function() { 
  chrome.runtime.sendMessage({ action: "syncFtxCoins", coinsType: 'spot' });
};

document.getElementById('btn-binance-futures').onclick = function() { 
  chrome.runtime.sendMessage({ action: "syncBinanceCoins", coinsType: 'futures' });
};
document.getElementById('btn-binance-spot').onclick = function() { 
  chrome.runtime.sendMessage({ action: "syncBinanceCoins", coinsType: 'spot' });
};