chrome.action.onClicked.addListener( async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
            console.log(tab.url);
        }
    });
});

