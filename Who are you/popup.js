"use strict";

let question = document.getElementById("question");
let answer = document.getElementById("answer");

question.onclick = function(element) {
  chrome.storage.sync.get(["username"], function(result) {
    answer.innerHTML = `You are ${result.username || "nobody"}`;
    answer.style.display = "block";
  });
};
