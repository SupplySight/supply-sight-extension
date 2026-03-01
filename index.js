const riskLevel = {
    "High": {
        "icon": "images/circle-alert.svg",
        "color": "#ef4444",
        "description": "This item may have serious ethical or environmental concerns."
    },
    "Medium": {
        "icon": "images/triangle-alert.svg",
        "color": "#f59e0b",
        "description": "This item might not be ethically sourced."
    },
    "Low": {
        "icon": "images/circle-check-big.svg",
        "color": "#22c55e",
        "description": "This item appears to have fewer known issues."
    },
    "Neutral": {
        "icon": "images/circle-check-big.svg",
        "color": "#9ca3af",
        "description": "Insufficient data to assess risk."
    }
};

function changeRiskLevel(risk) {
    const config = riskLevel[risk] || riskLevel.Neutral;
    document.getElementById('risk-icon').src = config.icon;
    document.getElementById('risk-label').textContent = risk + " Risk";
    document.getElementById('risk-card').className = `risk-card risk-${risk.toLowerCase()}`;
    const descEl = document.getElementById('risk-score-description');
    if (descEl) descEl.textContent = config.description;
}

function applyCompanyResult(payload) {
    if (!payload || payload.error) return;
    const risk = payload.riskLevel || "Neutral";
    changeRiskLevel(risk);
    const scoreEl = document.getElementById('risk-score');
    if (scoreEl) scoreEl.textContent = String(payload.companyScore ?? "—");
    const brandEl = document.getElementById('brand-name');
    if (brandEl) brandEl.textContent = payload.companyName || "—";
    const issuesEl = document.getElementById('issues-found');
    if (issuesEl) {
        const list = payload.companyIssues && payload.companyIssues.length
            ? payload.companyIssues.join(", ")
            : "None reported";
        issuesEl.textContent = "Issues: " + list;
    }
}

async function buttonOnClick() {
    const [tab] = await chrome.tabs.query({ active: true });
    try {
        const result = await chrome.tabs.sendMessage(tab.id, { type: "runAnalysis" });
        if (result && !result.error) applyCompanyResult(result);
    } catch (e) {
        console.warn("Analyze failed (reload the product page and try again):", e);
    }
}

chrome.storage.local.get("supplySightResult", (data) => {
    if (data.supplySightResult) applyCompanyResult(data.supplySightResult);
});
document.getElementById('analyze-btn').addEventListener('click', buttonOnClick);