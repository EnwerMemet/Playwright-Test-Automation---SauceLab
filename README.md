# Playwright SauceDemo Automation 🚀

![Playwright Tests CI](https://github.com/EnwerMemet/Playwright-Test-Automation---SauceLab/actions/workflows/playwright.yml/badge.svg)

This repository contains a professional-grade automation suite using **Playwright**, **TypeScript**, and the **Page Object Model**.

## 🏗️ Features
* **CI/CD:** Automated runs on Push and Pull Requests using GitHub Actions.
* **Security:** Sensitive data managed via GitHub Secrets and `.env` files.
* **Reporting:** HTML reports generated and stored as artifacts in CI.
* **Testing Levels:** Separated into `@sanity` and `@regression` suites.

## 🚀 How to Run Locally

1. **Install dependencies:**
   ```bash
   npm install



🏆 Project Milestone: Full-Stack Automation Framework
Framework Overview
Project Name: SauceLab E-Commerce Automation

Core Stack: Playwright, TypeScript, Node.js

Architecture: Page Object Model (POM)

Execution: Parallel Cross-browser (Chromium, Firefox, Webkit)

Key Achievements
1. End-to-End UI Automation
Automated the critical "Money Path": Login → Product Selection → Cart → Checkout → Confirmation.

Implemented Dynamic Data Generation to ensure unique test runs.

Used Tagged Execution (@sanity, @regression) for smart test filtering.

2. Full API CRUD Integration
Developed a complete API testing suite covering POST, GET, PUT, and DELETE methods.

Implemented Request Chaining to pass data (like IDs) between sequential API calls.

Validated status codes, response schemas, and data persistence.

3. Professional CI/CD Pipeline
Integrated GitHub Actions to trigger full regression suites on every push.

Configured Secure Environment Management via .env and GitHub Secrets.

Automated Artifact Collection, hosting HTML reports and execution traces in the cloud.

Technical Skills Demonstrated
Languages: TypeScript / JavaScript (CommonJS)

Testing Types: UI, API, Integration, Regression, Sanity

DevOps: GitHub Actions, YAML, Linux Cloud Runners

Debugging: Playwright Trace Viewer, HTML Reporting, Network Interception

📂 Repository Structure
tests/UI/ — User journey and interface validation.

tests/API/ — Backend service and data integrity checks.

pages/ — Reusable Page Object classes.

.github/workflows/ — Automation pipeline configuration.