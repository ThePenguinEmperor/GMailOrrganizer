chrome.runtime.onInstalled.addListener(() => {
  console.log("Gmail Organizer Extension Installed");
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getAuthToken') {
    chrome.identity.getAuthToken({ interactive: true }, (token) => {
      if (chrome.runtime.lastError) {
        console.error('Error getting auth token:', chrome.runtime.lastError.message);
        sendResponse({ success: false, error: chrome.runtime.lastError.message });
      } else {
        console.log('Auth token acquired:', token);
        sendResponse({ success: true, token });
      }
    });
    return true; // Indicates that the response is asynchronous
  }
});