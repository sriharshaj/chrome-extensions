"use strict";
let expression = /((https:\/\/chrome.google.com\/webstore\/detail\/[^\s]{2,}\/[^\s]{2,})|chrome:\/\/extensions\/\?id=[^\s]{2,})/gi;
let regex = new RegExp(expression);
const extensionsFileUrl = chrome.runtime.getURL("extensions.json");

const permissionWarnings = {
  "<all_urls>": ["Read and change all your data on the websites you visit"],
  bookmarks: ["Read and change your bookmarks"],
  clipboardRead: ["Read data you copy and paste"],
  clipboardWrite: ["Modify data you copy and paste"],
  contentSettings: [
    "Change your settings that control websites' access to features such as cookies, JavaScript, plugins, geolocation, microphone, camera etc."
  ],
  debugger: [
    "Access the page debugger backend",
    "Read and change all your data on the websites you visit"
  ],
  declarativeNetRequest: ["Block page content"],
  desktopCapture: ["Capture content of your screen"],
  downloads: ["Manage your downloads"],
  geolocation: ["Detect your physical location"],
  history: ["Read and change your browsing history"],
  management: ["Manage your apps, extensions, and themes"],
  nativeMessaging: ["Communicate with cooperating native applications"],
  notifications: ["Display notifications"],
  pageCapture: ["Read and change all your data on the websites you visit"],
  privacy: ["Change your privacy-related settings"],
  proxy: ["Read and change all your data on the websites you visit"],
  tabCapture: ["Read and change all your data on the websites you visit"],
  tabs: ["Read your browsing history"],
  topSites: ["Read a list of your most frequently visited websites"],
  ttsEngine: ["Read all text spoken using synthesized speech"],
  webNavigation: ["Read your browsing history"]
};

let question = document.getElementById("question");
let answer = document.getElementById("answer");

question.onclick = function(element) {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    let url = tabs[0].url;
    if (url.match(regex)) {
      let extensionId;
      if (url.slice(0, 5) === "https") {
        extensionId = url.split("/")[6].split("?")[0];
      } else {
        extensionId = url.split("=")[1];
      }
      fetch(extensionsFileUrl)
        .then(response => response.json()) //assuming file contains json
        .then(json => addPermissionWarnings(json, extensionId));
    }
  });
};

let addPermissionWarnings = function(extensionsData, extensionId) {
  if (extensionsData[extensionId]) {
    let permissions = extensionsData[extensionId];
    let permissionWarnings = getPermissionWarnings(permissions);
    answer.innerHTML = "It could:";
    for (let warning of permissionWarnings) {
      var node = document.createElement("LI");
      var textnode = document.createTextNode(warning);
      node.appendChild(textnode);
      answer.appendChild(node);
    }
    answer.style.display = "block";
  } else {
    answer.innerHTML = "Not present in our Database";
    answer.style.display = "block";
  }
};

let getPermissionWarnings = function(permissions) {
  let extensionPermissionWarings = [];
  for (let permission of permissions) {
    if (permissionWarnings[permission]) {
      for (let warning of permissionWarnings[permission]) {
        extensionPermissionWarings.push(warning);
      }
    }
  }

  return [...new Set(extensionPermissionWarings)];
};
