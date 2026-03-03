# Supply Sight: Frontend Extension

This repository contains the user-facing components for **Supply Sight**, a Chrome Extension that identifies ethical risks in supply chains. The extension scrapes manufacturer data directly from product pages and interfaces with an AWS-based NLP pipeline to provide real-time risk scores.

## Overview

**Supply Sight** makes negative externalities visible to consumers. The frontend detects brand names on e-commerce sites and fetches a "Social Cost Score" derived from AI analysis of recent news and labor reports.

- **Platform:** Chrome Extension (Manifest V3)
- **Primary Tech:** JavaScript, CSS3, HTML5
- **Backend Connection:** Amazon API Gateway

## Core Features

* **Manufacturer Scraper:** Content script that identifies brands on Amazon and Shopify product pages.
* **Dynamic Risk UI:** A traffic-light indicator (Red/Yellow/Green) that updates based on model confidence.
* **Article Evidence:** Displays headlines and URLs of the specific articles analyzed by the AI for full transparency.

## Repository Structure

* `manifest.json`: Defines extension permissions, background workers, and content script injection rules.
* `popup.html`: The main user interface layout, including the risk card and evidence list.
* `styles.css`: Custom styling for the extension, managing dynamic colors and responsive layouts.
* `index.js`: The primary UI controller. Orchestrates communication between the popup and the AWS API.
* `content-script.js`: The scraper logic that extracts manufacturer strings from the active browser tab.
* `productController.js`: Manages data mapping and converts raw scores into UI-friendly risk levels.
* `service-worker.js`: Handles extension-level events and background script execution.

## Integration Flow

The frontend coordinates with the AWS backend to deliver real-time results:

1.  **Extraction:** The extension scrapes the manufacturer name from the web page.
2.  **Request:** A JSON payload is sent to the **Amazon API Gateway** via a POST request.
3.  **Processing:** The backend fetches news and queries the **DistilBERT** model hosted on **SageMaker**.
4.  **Display:** The extension receives the score and sources, updating the UI dynamically.



## Installation

1.  Clone this repository to your local machine.
2.  Open Chrome and navigate to `chrome://extensions/`.
3.  Enable **Developer mode** in the top-right corner.
4.  Click **Load unpacked** and select the repository folder.
5.  Open `index.js` and ensure the `API_URL` matches your deployed API Gateway endpoint.

## UI Risk Levels

| State | Visual | Description |
| :--- | :--- | :--- |
| **STABLE** | Green | Risk Score < 40. No significant ethical violations found. |
| **WARNING** | Yellow | Risk Score 40-74. Potential disruptions or minor ethical concerns. |
| **CRITICAL** | Red | Risk Score 75+. Serious labor, safety, or environmental violations detected. |

---
**Note:** The backend logic and ML training scripts are located in the sister repository: [Supply Chain Sleuth: ML Pipeline].
