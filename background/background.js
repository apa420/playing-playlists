"use strict";
import {storageGet, storageSet} from "../modules/wrapper.js";
var API = chrome || browser;

let inputFile = document.createElement("input");
inputFile.setAttribute("type", "file");

let currentPlaylistName;

function setCurrentPlaylistName(name) {
  currentPlaylistName = name;
}

function getCurrentPlaylistName() {
  return currentPlaylistName;
}

inputFile.onchange = () => {
  for (let i = 0; i < inputFile.files.length; i++) {
    handleFile(inputFile.files[i]);
  }
}

function importClick() {
  inputFile.click();
}

function handleFile(file) {
  file.text().then(jsonText => {
    
    // Check if it's a parsable json
    try {
      let jsonParsed = JSON.parse(jsonText);

      storageGet(null, (playlistsList) => {

        let newItems = {};

        for (let name in jsonParsed) {

          let newName = name;
          let i = 0;
          while (Object.
              getOwnPropertyNames(playlistsList)
              .includes(newName) ||
              newItems[newName]
              !== undefined)
          {
            i++;
            newName = name + i;
          }

          newItems[newName] = jsonParsed[name];
        }

        storageSet(newItems);
      });

    } catch {
      console.log("Not a JSON file");
    }
  });
}
let bg = API.extension.getBackgroundPage();
bg.importClick = importClick;
bg.setCurrentPlaylistName = setCurrentPlaylistName;
bg.getCurrentPlaylistName = getCurrentPlaylistName;
