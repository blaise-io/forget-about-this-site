import * as tldts from "tldts";
import * as iconImage from "./icons/icon.png";
import defaultOptions from "./options/defaults";

const deleteOptions = ["cookies", "localStorage", "history", "downloads"];

if (process.env.BROWSER !== "firefox") {
    window.browser = require("webextension-polyfill");  // tslint:disable-line
}

browser.tabs.onUpdated.addListener((tabId) => browser.pageAction.show(tabId));

browser.pageAction.onClicked.addListener(async (tab) => {

    const result = await browser.storage.sync.get("options");
    const options = {...defaultOptions, ...(result.options || {})};

    const taburl = new URL(tab.url);
    const hostname = taburl.hostname;
    const hostnameDomain = tldts.parse(hostname).domain;
    const hostnames = Array.from(new Set([hostnameDomain, hostname]));
    const origins = hostnames.map((h) => `${taburl.protocol}//${h}`);
    const browsingDataQuery = (process.env.BROWSER === "firefox") ? {hostnames} : {origins};

    const removeText = Object.keys(defaultOptions).filter(
        (key) => deleteOptions.includes(key)
    ).map((key) => browser.i18n.getMessage(key).toLocaleLowerCase()).join(", ");

    const promises = [];

    if (options.closeTab) {
        await browser.tabs.remove(tab.id);
    }

    if (options.history) {
        promises.push(...await removeHistory(hostnameDomain));
    }

    if (options.downloads) {
        promises.push(browser.downloads.erase({query: hostnames}));
    }

    if (options.cookies) {
        promises.push(browser.browsingData.removeCookies(browsingDataQuery));
    }

    if (options.localStorage) {
        promises.push(browser.browsingData.removeLocalStorage(browsingDataQuery));
    }

    try {
        await Promise.all(promises);
    } catch (error) {
        await browser.notifications.create({
            type: "basic",
            iconUrl: iconImage,
            title: `Error removing data for ${hostnames[0]}`,
            message: error,
        });
    }

    if (options.showNotification) {
        await browser.notifications.create({
            type: "basic",
            iconUrl: iconImage,
            title: browser.i18n.getMessage("successNotificationText"),
            message: browser.i18n.getMessage("successNotificationBody", [removeText, hostnameDomain]),
        });
    }

    if (options.refreshPage) {
        if (options.closeTab) {
            await browser.tabs.create({url: tab.url});
        } else {
            await browser.tabs.reload(tab.id);
        }
    }

});

async function removeHistory(hostnameDomain: string) {
    const historyItems = await browser.history.search({
        text: hostnameDomain,
        startTime: 0,
        maxResults: 1000,
    });
    return Promise.all(historyItems.map(
        (historyItem) => browser.history.deleteUrl({url: historyItem.url})
    ));
}
