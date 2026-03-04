async function fakeResponse() {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
        companyName: "No Company Found",
        companyScore: Math.floor(Math.random() * (98 - 5 + 1)) + 5,
        companyIssues: ["Sweatshop","Environmentally Unfriendly"],
    }
}

/** Maps company score (0-100) to risk level for the popup. */
function scoreToRiskLevel(companyScore) {
    if (companyScore <= 30) return "Low";
    if (companyScore <= 60) return "Medium";
    if (companyScore <= 100) return "High";
    return "Neutral";
}

async function getCompanyInfo(companyName) {
    // TODO: Replace with your deployed API URL output from Terraform.
    // Example: const API_BASE_URL = "https://abc123.execute-api.us-east-1.amazonaws.com/prod";
    const API_BASE_URL = "https://REPLACE_WITH_YOUR_API_ID.execute-api.YOUR_REGION.amazonaws.com/prod";

    try {
        const resp = await fetch(`${API_BASE_URL}/brand-risk`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ brand_name: companyName }),
        });

        if (!resp.ok) {
            console.error("SupplySight API error:", resp.status, await resp.text());
            throw new Error(`API error: ${resp.status}`);
        }

        const payload = await resp.json();

        const companyScore = typeof payload.risk_score === "number"
            ? Math.round(payload.risk_score)
            : 0;

        const companyIssues = payload.status
            ? [`Model status: ${payload.status}`]
            : [];

        const data = {
            companyName: payload.brand_name || companyName,
            companyScore,
            companyIssues,
        };

        console.log("SupplySight API result:", data);
        return data;
    } catch (err) {
        console.error("Failed to fetch company info from SupplySight API:", err);
        // Fallback to a neutral placeholder so the UI still works.
        return {
            companyName,
            companyScore: 0,
            companyIssues: ["Unable to fetch data"],
        };
    }
}
