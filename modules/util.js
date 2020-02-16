"use strict";
var API = chrome || browser;
import {storageGet} from "./wrapper.js";

export function exportAll() {
  return new Promise((resolve, reject) => {
    storageGet(null, (data) => {
      let tempItem = document.createElement("a");
      tempItem.setAttribute('href', 'data:text/plain;charset=utf-8,'
        + encodeURIComponent(JSON.stringify(data)));
      tempItem.style.display = "none";
      tempItem.setAttribute("download", "playlists.json");

      document.body.appendChild(tempItem);
      tempItem.click();
      document.body.removeChild(tempItem);

      resolve();
    });
  });
}

export function exportPlaylist(name) {
  return new Promise((resolve, reject) => {
    storageGet(name, (data) => {
      let tempItem = document.createElement("a");
      tempItem.setAttribute('href', 'data:text/plain;charset=utf-8,'
        + encodeURIComponent(JSON.stringify(data)));
      tempItem.style.display = "none";
      tempItem.setAttribute("download", "playlists.json");

      document.body.appendChild(tempItem);
      tempItem.click();
      document.body.removeChild(tempItem);

      resolve();
    });
  });
}
