import * as iconImage from "./icons/icon.png";

const manifest = {
    manifest_version: 2,
    name: "__MSG_extensionName__",
    description: "__MSG_extensionDescription__",
    version: process.env.npm_package_version,
    homepage_url: process.env.npm_package_homepage,
    default_locale: "en",
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
    page_action: {
        default_icon: iconImage,
        browser_style: undefined,
    },
    options_ui: {
        page: "/options.html",
        browser_style: undefined,
    },
    commands: {
        _execute_page_action: {
            suggested_key: {
                default: "Ctrl+Shift+X"
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
    manifest.page_action.browser_style = false;
}

module.exports = JSON.stringify(manifest, null, 2);
