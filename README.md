# 🚀 KSBCL Auto Indent Chrome Extension

A Chrome Extension built to help retailers automate the **KSBCL indent process**, reducing waiting time and ensuring **faster submission with lower queue numbers**.

---

## 📌 Overview

This extension automates the indent workflow on the KSBCL portal by:

* Allowing users to pre-select products and quantities
* Monitoring the portal opening time
* Automatically filling and submitting the indent form instantly

⚡ Result: **Lower latency → Better indent priority**

---

## ✨ Features

* ⚡ Instant auto submission when portal opens
* 🛒 Select product & quantity via popup
* 💾 Saves data using browser local storage
* ⏳ Waits and triggers automatically (~10 minutes before opening)
* 🤖 Auto form fill + submission
* 🔔 Handles confirmation alerts (manual confirmation required)

---

## 📁 Project Structure

```bash
CHRO_EX_PRAC/
│
├── dist/                # ✅ Build output (USE THIS FOLDER IN CHROME)
├── src/                 # Source code (development)
├── public/              # Static files (used by Vite)
├── package.json         # Project config
├── vite.config.ts       # Vite configuration
└── README.md
```

---

## ⚠️ Important Note

This project uses **Vite**, so you **CANNOT directly load the repository into Chrome**.

👉 You MUST build the project first to generate the `dist/` folder.

---

## ⬇️ How to Download the Repository

### Option 1: Clone via Git

```bash
git clone https://github.com/Shrejan/Easy-Indent.git
cd CHRO_EX_PRAC
```

### Option 2: Download ZIP

1. Click **Code → Download ZIP**
2. Extract the project folder

---

## 🛠️ Build Instructions (Required)

Before using the extension:

```bash
npm install
npm run build
```

👉 This will generate the `dist/` folder.

---

## 🌐 How to Load Extension in Chrome

1. Open Chrome and go to:

   ```
   chrome://extensions/
   ```

2. Enable **Developer Mode** (top right)

3. Click **Load unpacked**

4. Select the **`dist/` folder**

✅ Extension is now installed

---

## 🧑‍💻 How to Use the Extension

### Step 1: Open KSBCL Indent Page

* Navigate to the KSBCL indent portal in your browser

---

### Step 2: Configure Product & Quantity

1. Click the extension icon
2. Select:

   * Product
   * Quantity
3. Save your selection

💾 This data is stored locally in the browser

---

### Step 3: Wait for Portal Opening

* Keep the indent page open
* The system will monitor availability

⏳  when the portal becomes **Manually active refresh the page frequently**

---

### Step 4: Automatic Submission

Once the portal opens:

* ✅ Product is automatically selected
* ✅ Quantity is filled
* ✅ Form is submitted instantly with minimal delay

---

### Step 5: Handle Alerts

After submission:

* ⚠️ Two alert popups will appear
* 👉 Manually confirm both alerts

✅ Your indent will be successfully submitted

---

## ⚠️ Usage Guidelines

* Keep the indent page **open and active**
* Ensure **stable internet connection**
* Do not refresh or close the tab
* Configure product details before waiting

---

## 🧠 How It Works

* Uses **content scripts** to interact with the webpage
* Uses **chrome.storage** to store user input
* Monitors timing/DOM changes
* Executes actions instantly when conditions are met

---

## 🐞 Troubleshooting

| Issue                     | Solution                         |
| ------------------------- | -------------------------------- |
| Extension not working     | Reload in `chrome://extensions/` |
| No logs visible           | Inspect popup or service worker  |
| Data not saving           | Check popup script connection    |
| Auto-submit not triggered | Ensure correct page is open      |

---

## 🔄 Updating the Extension

After making changes:

```bash
npm run build
```

Then:

* Go to `chrome://extensions/`
* Click **Reload**

---

## 🤝 Contribution

Contributions are welcome:

* Improve performance
* Enhance UI
* Add new automation features

---

## 📜 Disclaimer

This extension is intended to assist retailers by automating repetitive tasks.
Users should ensure compliance with KSBCL platform rules and policies.

---

## 🚀 Future Improvements

* Full alert automation
* Better timing prediction
* Multi-product selection
* Backend sync support

---

## 🎯 Final Words

This extension gives you a **competitive advantage** by reducing manual delay and ensuring **fastest possible indent submission**.

🔥 *Speed = Priority. Automate Smartly.*
