const riskLevel = {
    "High": {
        "icon": "images/circle-alert.svg",
        "color": "#ef4444"
    },
    "Medium": {
        "icon": "images/triangle-alert.svg",
        "color": "#f59e0b"
    },
    "Low": {
        "icon": "images/circle-check-big.svg",
        "color": "#22c55e"
    },
    "Neutral": {
        "icon": "images/circle-check-big.svg",
        "color": "#9ca3af"
    }
};

// Order to rotate through when clicking Analyze
const riskOrder = ["Medium", "High", "Low", "Neutral"];
let currentRiskIndex = 0;

function changeRiskLevel(risk) {
    document.getElementById('risk-icon').src = riskLevel[risk].icon;
    document.getElementById('risk-label').textContent = risk;
    document.getElementById('risk-card').className = `risk-card risk-${risk.toLowerCase()}`;
}

async function buttonOnClick() {
    const [tab] = await chrome.tabs.query({ active: true});
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (tabUrl) => {
            // alert(tabUrl);
        },
        args: [tab.url]
    });

    // Rotate through risk levels each time the button is clicked
    currentRiskIndex = (currentRiskIndex + 1) % riskOrder.length;
    const nextRisk = riskOrder[currentRiskIndex];
    changeRiskLevel(nextRisk);
}
document.getElementById('analyze-btn').addEventListener('click', buttonOnClick);