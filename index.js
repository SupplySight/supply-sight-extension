
async function buttonOnClick() {
    const [tab] = await chrome.tabs.query({ active: true});
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (tabUrl) => {
            alert(tabUrl);
        },
        args: [tab.url]
    });
}
document.getElementById('analyze-btn').addEventListener('click', buttonOnClick);