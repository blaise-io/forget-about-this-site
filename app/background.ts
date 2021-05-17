import * as tldts from "tldts";
import * as iconImage from "./icons/icon.png";
import defaultOptions from "./options/defaults";

const deleteOptions = ["cookies", "localStorage", "history", "downloads"];

if (process.env.BROWSER !== "firefox") {
  window.browser = require("webextension-polyfill"); // tslint:disable-line
}

browser.tabs.onUpdated.addListener((tabId) => browser.pageAction.show(tabId));
console.info("Forget about this site loaded");

browser.pageAction.onClicked.addListener(async (tab) => {
  const result = await browser.storage.sync.get("options");
  const options = { ...defaultOptions, ...(result.options || {}) };
  console.info({ options });

  const taburl = new URL(tab.url);
  const hostname = taburl.hostname;
  const hostnameDomain = tldts.parse(hostname).domain;
  const hostnames = Array.from(new Set([hostnameDomain, hostname]));
  const origins = hostnames.map((h) => `${taburl.protocol}//${h}`);
  const browsingDataQuery =
    process.env.BROWSER === "firefox" ? { hostnames } : { origins };
  console.info({ browsingDataQuery });

  const removeText = Object.keys(defaultOptions)
    .filter((key) => deleteOptions.includes(key))
    .map((key) => browser.i18n.getMessage(key).toLocaleLowerCase())
    .join(", ");

  if (options.askConfirmation) {
    const ask = browser.i18n.getMessage("confirmationPrompt", [removeText]);
    const confirm = await browser.tabs.executeScript({
      // NotificationOptions.buttons not supported in Firefox.
      code: `confirm(${JSON.stringify(ask)})`,
    });
    if (confirm && !confirm[0]) {
      return;
    }
  }

  const promises = [];

  if (options.closeTab) {
    await browser.tabs.remove(tab.id);
  }

  if (options.history) {
    promises.push(...(await removeHistory(hostnameDomain)));
  }

  if (options.downloads) {
    promises.push(browser.downloads.erase({ query: hostnames }));
  }

  if (options.cookies) {
    promises.push(browser.browsingData.removeCookies(browsingDataQuery));
  }

  if (options.localStorage) {
    promises.push(browser.browsingData.removeLocalStorage(browsingDataQuery));
  }

  try {
    console.info({ promises });
    await Promise.all(promises);
    console.info("All promises fulfilled, data deleted.");
  } catch (error) {
    console.warn({ error });
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
      message: browser.i18n.getMessage("successNotificationBody", [
        removeText,
        hostnameDomain,
      ]),
    });
  }

  if (options.refreshPage) {
    if (options.closeTab) {
      await browser.tabs.create({ url: tab.url });
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
  console.info({ historyItems });
  return Promise.all(
    historyItems.map((historyItem) =>
      browser.history.deleteUrl({ url: historyItem.url })
    )
  );
}
