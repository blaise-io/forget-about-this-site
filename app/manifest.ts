import * as iconImage from "./icons/icon.png";

const manifest = {
    manifest_version: 2,
    name: "Forget about this site",
    version: process.env.npm_package_version,
    description: process.env.npm_package_description,
    homepage_url: process.env.npm_package_homepage,
    permissions: [
        "activeTab",
        "browsingData",
        "downloads",
        "history",
        "storage",
        "notifications"
    ],
    background: {
        scripts: ["/background.js"]
    },
    applications: undefined,
    icons: {
        256: iconImage,
    },
    browser_action: {
        default_icon: iconImage,
        browser_style: undefined,
    },
    options_ui: {
        page: "/options.html",
        browser_style: undefined,
    },
    commands: {
        _execute_browser_action: {
            suggested_key: {
                default: "Ctrl+Alt+H",
                windows: "Ctrl+Alt+H",
                linux: "Ctrl+Alt+H",
                mac: "Command+Alt+H",
            }
        }
    }
};

if (process.env.BROWSER === "firefox") {
    manifest.applications = {
        gecko: {
            id: `${process.env.npm_package_name}@blaise.io`
        }
    };
    manifest.options_ui.browser_style = true;
    manifest.browser_action.browser_style = false;
}

module.exports = JSON.stringify(manifest, null, 2);
