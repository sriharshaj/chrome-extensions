"use strict";

let submit_email = document.getElementById("submit_email");

submit_email.onclick = function() {
  let username = document.getElementById("username").value;
  let user_email = document.getElementById("user_email").value;
  if (
    !(username === undefined || username === "") &&
    !(user_email === undefined || user_email === "")
  ) {
    chrome.storage.sync.set({ user_email, username }, function() {
      // console.log("User email set to: " + user_email);
      chrome.tabs.getCurrent(function(tab) {
        chrome.tabs.remove(tab.id, function() {});
      });
    });
  }
};
