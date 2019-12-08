"use strict";

let inputGetFile = document.getElementById("inputGetFile"); 
let dropArea = document.getElementById("dropArea");

function handleFile(file) {
  console.log("didn't even get called");
  file.text().then(jsonText => {
    
    // Check if it's a parsable json
    try {
      let jsonParsed = JSON.parse(jsonText);

      let storage = browser.storage.local;
      storage.get(null).then(playlistsList => {

        let newItems = {};
        console.log(playlistsList);
        console.log(jsonParsed);

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

inputGetFile.onchange = () => {
  let file = inputGetFile.files[0];
  handleFile(file);
}

dropArea.dragenter = () => {
}

dropArea.dragover = () => {
}

dropArea.dragover = () => {
}

dropArea.drop = () => {
  //TODO: Implement dropArea
  let dt = e.dataTranser;
  let files = dt.files
  inputGetFile.onchange(files);
}
