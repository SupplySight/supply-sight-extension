(()=>{
    function runAnalysis() {
        let manufacturer = "no manufacturer found";
        let arr = Array.from(document.querySelectorAll(".a-list-item")).filter( el => el.textContent.includes("Manu"));
        if (arr.length === 0) {
            arr = Array.from(document.querySelectorAll("tr")).filter( el => el.textContent.includes("Manu"))
        }
        if (arr.length === 0) {
            throw new Error("No manufacturer found");
        }
        try {
            manufacturer = arr.filter(e => (e.children[0].textContent.trim().replaceAll(" ", "").replaceAll("\n", "").replaceAll(":", "").replaceAll("‎", "").replaceAll("‏","")  == "Manufacturer"))[0].children[1].textContent.trim()
        } catch (error) {
            console.error(error);
        }
        return getCompanyInfo(manufacturer).then(data => {
            const riskLevel = scoreToRiskLevel(data.companyScore);
            const result = { companyName: data.companyName, companyScore: data.companyScore, companyIssues: data.companyIssues || [], riskLevel };
            chrome.storage.local.set({ supplySightResult: result });
            chrome.runtime.sendMessage({ type: "SUPPLY_SIGHT_RESULT", payload: result });
            return result;
        });
    }

    runAnalysis();

    chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
        if (msg.type === "runAnalysis") {
            runAnalysis().then(sendResponse).catch(err => sendResponse({ error: err.message }));
            return true;
        }
    });
})();