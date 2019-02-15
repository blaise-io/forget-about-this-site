import defaultOptions from "./defaults";

if (process.env.BROWSER !== "firefox") {
    window.browser = require("webextension-polyfill");  // tslint:disable-line
}

document.addEventListener("change", saveOptions, false);

let options = {};

const savedOptionsPromise = browser.storage.sync.get("options");

Promise.all([savedOptionsPromise]).then((result) => {
    options = {...defaultOptions, ...result[0].options};
    restoreOptions();
    setLastSaved();
});

function restoreOptions() {
    const checkboxes = document.querySelectorAll("input[type=checkbox][name]");
    Array.from(checkboxes).forEach((input: HTMLInputElement) => {
        input.checked = options[input.name];
    });
}

function saveOptions() {
    options = {"meta.lastSaved": new Date().toISOString()};
    const checkboxes = document.querySelectorAll("input[type=checkbox][name]");
    Array.from(checkboxes).forEach((input: HTMLInputElement) => {
        options[input.name] = input.checked;
    });
    browser.storage.sync.set({options}).then(setLastSaved);
}

function setLastSaved() {
    if (options["meta.lastSaved"]) {
        const savedElement: HTMLElement = document.querySelector("#last-saved");
        const time = (new Date(options["meta.lastSaved"])).toLocaleString();
        savedElement.textContent = `Last saved at ${time}`;
        savedElement.style.display = "block";
    }
}
