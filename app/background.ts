import * as tldts from "tldts";
import defaultOptions from "./options/defaults";

const deleteOptions = ["cookies", "localStorage", "history", "downloads"];

browser.tabs.onUpdated.addListener((tabId) => browser.pageAction.show(tabId));

browser.pageAction.onClicked.addListener(async (tab) => {

    const result = await browser.storage.sync.get("options");
    const options = { ...defaultOptions, ...(result.options || {}) };

    const hostname = new URL(tab.url).hostname;
    const hostnameDomain = tldts.parse(hostname).domain;
    const hostnames = Array.from(new Set([
        tldts.parse(hostname).domain,
        hostname
    ]));

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
        promises.push(browser.browsingData.remove({ hostnames }, {cookies: true}));
    }

    if (options.localStorage) {
        promises.push(browser.browsingData.remove({ hostnames }, {localStorage: true}));
    }

    try {
        await Promise.all(promises);
    } catch (error) {
        browser.notifications.create('', {
            type: "basic",
            title: `Error removing data for ${hostnames[0]}`,
            message: error,
            isClickable: false,
        });
    }

    if (options.showNotification) {
        browser.notifications.create('', {
            type: "basic",
            title: browser.i18n.getMessage("successNotificationText"),
            message: browser.i18n.getMessage("successNotificationBody", [removeText, hostnameDomain]),
            isClickable: false,
        });
    }

    if (options.refreshPage) {
        if (options.closeTab) {
            browser.tabs.create({url: tab.url});
        } else {
            browser.tabs.reload(tab.id);
        }
    }

});

async function removeHistory(hostnameDomain: string) {
    const historyItems = await browser.history.search({
        text: hostnameDomain,
        startTime: 0,
        maxResults: 1000,
    });
    return historyItems.map(
        (historyItem) => browser.history.deleteUrl({url: historyItem.url})
    );
}
