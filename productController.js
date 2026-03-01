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
    const response = await fakeResponse();
    const data = response;
    data.companyName = companyName;

    console.log(data);
    return data;
}
