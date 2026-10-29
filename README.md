# NEPSE Signal Desk

A web app for technical analysis of every NEPSE-listed stock: 35 indicators, a NEPSE-trained model call, a 10-session forecast, trade plans with entry, stop-loss and targets, and a daily market scan with buy and sell candidates.

It installs to a phone or computer like a normal app, works offline with the last downloaded data, and updates its prices automatically after every trading day.

## What's in this folder

| File | What it does |
|---|---|
| `index.html` | The whole app |
| `nepse.json` | Daily prices for every listed share and mutual fund (about two years) |
| `manifest.webmanifest`, `sw.js`, `icons/` | Make it installable and let it work offline |
| `scripts/build.py` | Downloads new trading days and rebuilds `nepse.json` |
| `.github/workflows/update-data.yml` | Runs `build.py` every weekday at 5:37 PM Nepal time |

## Put it online (free, about 10 minutes)

1. **Create a GitHub account** at github.com if you don't have one.
2. **Create a repository.** Click **New repository**, name it `nepse-desk`, set it to **Public** (free GitHub Pages needs a public repository), and click **Create repository**.
3. **Upload the files.** On the new repository's page, click **uploading an existing file**, then drag in everything from this folder: `index.html`, `nepse.json`, `manifest.webmanifest`, `sw.js`, `README.md`, `.nojekyll`, and the `icons` and `scripts` folders. Click **Commit changes**.
4. **Add the daily update.** Folders whose names start with a dot are often hidden or skipped when you drag them in, so add this one by hand: click **Add file → Create new file**, type `.github/workflows/update-data.yml` as the name, paste in the contents of that file from this folder, and click **Commit changes**.
5. **Let the update save its work.** Go to **Settings → Actions → General**, scroll to **Workflow permissions**, choose **Read and write permissions**, and click **Save**.
6. **Turn on the website.** Go to **Settings → Pages**. Under **Build and deployment**, set Source to **Deploy from a branch**, Branch to **main** and folder to **/ (root)**, then click **Save**. After a minute or two the page shows your address: `https://YOUR-USERNAME.github.io/nepse-desk/`
7. **Run the first update.** Open the **Actions** tab, click **Update NEPSE data**, then **Run workflow**. After this, it runs on its own every weekday evening.

## Install it on your phone

- **Android (Chrome):** open your address and tap **Install app** at the top of the page, or use the menu's **Install app** / **Add to Home screen**.
- **iPhone or iPad (Safari):** open your address, tap the **Share** button, then **Add to Home Screen**.
- **Computer (Chrome or Edge):** click the install icon in the address bar.

The app then opens full-screen from its own icon.

## Good to know

- **Data source:** NEPSE's daily floor sheet and official closing prices, as mirrored by the open-source [YoNEPSE](https://github.com/shubhamnpk/yonepse) project. If that project stops updating, the daily job fails visibly (you'll see a red mark in the Actions tab) instead of publishing stale data.
- **End-of-day only:** prices update once a day after the close, not live during trading.
- **Prices are not adjusted for bonus or rights issues.** A large drop on a book-closure date is a corporate action, and the indicators will treat it as a real fall for a few weeks.
- **Model:** the call ranks today's shares with weights learned from NEPSE's own history, tested on a year of data it hadn't seen. Its edge is real but small. Treat the trade plans as a rules-based starting point, not personal financial advice.
- **Costs:** plans are shown before broker commission, SEBON fee, DP charge and capital gains tax.
- **Updating the app later:** replace `index.html` in the repository with a new version. The app picks up the change the next time it's opened online.
