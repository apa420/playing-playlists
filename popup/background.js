"use strict";

let inputFile = document.createElement("input");
inputFile.setAttribute("type", "file");

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

      let storage = browser.storage.local;
      storage.get(null).then(playlistsList => {

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

        storage.set(newItems);
      });

    } catch {
      console.log("Not a JSON file");
    }
  });
}
