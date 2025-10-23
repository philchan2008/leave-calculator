# 🗓️ Leave Calculator – Vue 3.5 + Vuetify + Electron

A modern, standalone leave calculator application built with Vue 3.5 and Vuetify UI framework. This project is a refactored version of a legacy Visual Basic leave management module, designed to run as a desktop application via Electron for Windows.

# 🏗️ Project Background

Originally part of an online leave management system, this calculator was extracted from a legacy VB program and rebuilt using Vue 3.5. It preserves the original business logic while offering a modern UI and improved user experience. The app is designed to operate independently and will be packaged as a Windows desktop application using Electron.

# 🚀 Features

    🧮 Accurate leave balance computation based on legacy rules
    📅 Vuetify-powered calendar and form components
    🗂️ Support for multiple leave types (annual, sick, etc.)
    🖥️ Electron-ready for Windows desktop deployment (TBC)

# 🛠️ Tech Stack
| Layer |	Technology |
|---|---|
| Frontend | Vue 3.5, Vuetify 3, Pinia
| Styling | Vuetify, SCSS |
| Desktop | Electron (planned) |
| Testing | Vitest, Vue Test Utils |
| Build Tool |	Vite |

# 📦 Installation

```bash
# Clone the repository
git clone https://github.com/philchan2008/leave-calculator.git
cd leave-calculator

# Install dependencies
npm install

# Run the development server
npm run dev

# Run the unit tests
npm run test

# Run the unit tests on browser
npm run test:browser
```

# 🖥️ Electron Packaging (Coming Soon)

The app will be bundled using Electron to run as a native Windows application. Packaging scripts and installer generation will be added in future releases.

# 📌 Roadmap
    [ ] Integrate Electron build and installer (planning)
    [ ] Export leave reports to CSV/PDF
    [ ] Sync with backend leave system (optional)

# 📄 License

This project is licensed under the MIT License.