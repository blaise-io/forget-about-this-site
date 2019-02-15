import defaultOptions from "./options/defaults";

function success(hostnames: string[], dataTypes: browser.browsingData.DataTypeSet) {
    const removed = Object.keys(dataTypes).join(", ").replace(/([A-Z]+)/g, " $1").trim().toLowerCase();
    browser.notifications.create({
        type: "basic" as browser.notifications.TemplateType.basic,
        title: `Removed data for ${hostnames.join(", ")}`,
        message: `Removed: ${removed}`
    });
}

function error(hostnames: string[], reason: string) {
    browser.notifications.create({
        type: "basic" as browser.notifications.TemplateType.basic,
        title: `Error removing data for ${hostnames.join(", ")}`,
        message: reason
    });
}

browser.browserAction.onClicked.addListener((tab) => {

    browser.storage.sync.get("options").then((result) => {
        const hostnames = [new URL(tab.url).hostname];
        const options = {...defaultOptions, ...(result.options || {})};

        const dataTypesToRemove = Object.keys(defaultOptions).reduce(
            (obj, key) => options[key] ? {...obj, [key]: true} : obj,
            {}
        );

        browser.browsingData.remove({hostnames}, dataTypesToRemove)
            .then(() => success(hostnames, dataTypesToRemove))
            .catch((reason) => error(hostnames, reason));

    });

});
