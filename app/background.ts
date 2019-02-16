import * as tldts from "tldts";
import defaultOptions from "./options/defaults";

browser.browserAction.onClicked.addListener(async (tab) => {

    const result = await browser.storage.sync.get("options");
    const options = { ...defaultOptions, ...(result.options || {}) };

    const hostname = new URL(tab.url).hostname;
    const hostnameDomain = tldts.parse(hostname).domain;
    const hostnames = Array.from(new Set([
        tldts.parse(hostname).domain,
        hostname
    ]));

    const removeItems = Object.keys(defaultOptions).reduce(
        (obj, key) => options[key] ? { ...obj, [key]: true } : obj, {}
    );

    const removeText = Object.keys(removeItems).join(", ")
        .replace(/([A-Z]+)/g, " $1")
        .toLowerCase();

    const promises = [];

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
        browser.notifications.create({
            type: "basic" as browser.notifications.TemplateType.basic,
            title: `Error removing data for ${hostnames[0]}`,
            message: error,
            isClickable: false,
        });
    }

    browser.notifications.create({
        type: "basic" as browser.notifications.TemplateType.basic,
        title: `Successfully removed data`,
        message: `Removed ${removeText} for ${hostnameDomain}`,
        isClickable: false,
    });

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
