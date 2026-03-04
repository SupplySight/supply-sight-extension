(() => {
	function runAnalysis() {
		let manufacturer = "no manufacturer found";
		let arr = Array.from(document.querySelectorAll(".a-list-item")).filter(
			(el) => el.textContent.includes("Manu"),
		);
		if (arr.length === 0) {
			arr = Array.from(document.querySelectorAll("tr")).filter((el) =>
				el.textContent.includes("Manu"),
			);
		}
		if (arr.length === 0) {
			const result = {
				companyName: "No manufacturer found",
				companyScore: 0,
				companyIssues: [
					"No manufacturer information found on this product page.",
				],
				riskLevel: "Neutral",
			};
			chrome.storage.local.set({ supplySightResult: result });
			chrome.runtime.sendMessage({
				type: "SUPPLY_SIGHT_RESULT",
				payload: result,
			});
			return Promise.resolve(result);
		}
		try {
			const match = arr.filter(
				(e) =>
					e.children[0].textContent
						.trim()
						.replaceAll(" ", "")
						.replaceAll("\n", "")
						.replaceAll(":", "")
						.replaceAll("‎", "")
						.replaceAll("‏", "") === "Manufacturer",
			)[0];
			const rawManufacturer =
				match?.children[1]?.textContent?.trim() || "";
			// Use only the first word and strip a trailing ".com" if present
			manufacturer = rawManufacturer.replace(/\.com$/i, "");
			manufacturer = manufacturer || "No manufacturer found";
		} catch (error) {
			console.error(error);
		}
		return getCompanyInfo(manufacturer).then((data) => {
			const riskLevel = scoreToRiskLevel(data.companyScore);
			const result = {
				companyName: data.companyName,
				companyScore: data.companyScore,
				companyIssues: data.companyIssues || [],
				riskLevel,
			};
			chrome.storage.local.set({ supplySightResult: result });
			chrome.runtime.sendMessage({
				type: "SUPPLY_SIGHT_RESULT",
				payload: result,
			});
			return result;
		});
	}

	runAnalysis();

	chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
		if (msg.type === "runAnalysis") {
			runAnalysis()
				.then(sendResponse)
				.catch((err) => sendResponse({ error: err.message }));
			return true;
		}
	});
})();
