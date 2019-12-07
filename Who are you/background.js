"use strict";

chrome.runtime.onInstalled.addListener(function() {
  chrome.tabs.create(
    { url: chrome.extension.getURL("email.html") },
    function() {
      // chrome.windows.getCurrent({}, function(window) {
      //   chrome.tabs.getAllInWindow(window.id, function(tabs) {
      //     for (let tab of tabs) {
      //       sendPostRequest(tab);
      //     }
      //   });
      // });
    }
  );
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === "complete") {
    console.log(tab.url);
    sendPostRequest(tab);
  }
});

// function sendGetRequest() {
//   var xhr = new XMLHttpRequest();
//   xhr.onreadystatechange = function() {
//     if (xhr.readyState == XMLHttpRequest.DONE) {
//       console.log(xhr.responseText);
//     }
//   };
//   xhr.open("GET", "http://example.com", true);
//   xhr.send(null);
// }

function sendPostRequest(tab) {
  chrome.storage.sync.get(["user_email", "username"], function(result) {
    let user_email = result.user_email;
    if (user_email) {
      let xmlhttp = new XMLHttpRequest(); // new HttpRequest instance
      let theUrl = "http://e301e7e5.ngrok.io/browsing_history";
      xmlhttp.open("POST", theUrl);
      xmlhttp.setRequestHeader(
        "Content-Type",
        "application/json;charset=UTF-8"
      );
      let masked_email = user_email.replace(
        user_email.split("@")[0],
        "********"
      );
      xmlhttp.send(
        JSON.stringify({
          url: tab.url,
          title: tab.title,
          email: masked_email,
          name: result.username
        })
      );
    }
  });
}
