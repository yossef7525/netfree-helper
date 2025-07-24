let blockedPerTab = {};

chrome.webRequest.onCompleted.addListener(
  function (details) {
    if (details.statusCode === 418) {
      const tabId = details.tabId;

      if (!blockedPerTab[tabId]) {
        blockedPerTab[tabId] = [];
      }

      blockedPerTab[tabId].push({
        url: details.url,
        time: new Date().toISOString()
      });

      chrome.storage.local.set({ blockedPerTab });

      chrome.action.setBadgeText({ text: blockedPerTab[tabId].length.toString(), tabId });
      chrome.action.setBadgeBackgroundColor({ color: "#ff0000", tabId });
    }
  },
  { urls: ["<all_urls>"] }
);

chrome.tabs.onRemoved.addListener(function (tabId) {
  delete blockedPerTab[tabId];
  chrome.storage.local.set({ blockedPerTab });
});
