"use strict";

// Buttons
let addButton = document.getElementById("addButton");
let optionsButton = document.getElementById("optionsButton");
let backButton = document.getElementById("backButton");
let renameButton = document.getElementById("renameButton");
let deleteButton = document.getElementById("deleteButton");
let newPlaylistButton = document.getElementById("newPlaylistButton");
let exportPlaylistButton = document.getElementById("exportPlaylistButton");
let exportAllButton = document.getElementById("exportAllButton");
let importButton = document.getElementById("importButton");

// Input boxes
let renameInput = document.getElementById("renameInput");
let searchBox = document.getElementById("search");

// Lists
let playlistList = document.getElementById("playlists");

// Tab
let newTab;

//TODO: Add sort to table
// Current playlist variable
let currentPlaylistName;


importButton.onclick = () => {
  let bp = browser.extension.getBackgroundPage();
  bp.importClick();
};

exportAllButton.onclick = () => {
  let storage = browser.storage.local;
  storage.get(null).then(data => {
    let tempItem = document.createElement("a");
    tempItem.setAttribute('href', 'data:text/plain;charset=utf-8,'
      + encodeURIComponent(JSON.stringify(data)));
    tempItem.style.display = "none";
    tempItem.setAttribute("download", "playlists.json");

    document.body.appendChild(tempItem);
    tempItem.click();
    document.body.removeChild(tempItem);
  });
};

exportPlaylistButton.onclick = () => {
  let storage = browser.storage.local;
  storage.get(currentPlaylistName).then(data => {
    let tempItem = document.createElement("a");
    tempItem.setAttribute('href', 'data:text/plain;charset=utf-8,'
      + encodeURIComponent(JSON.stringify(data)));
    tempItem.style.display = "none";
    tempItem.setAttribute("download", "playlists.json");

    document.body.appendChild(tempItem);
    tempItem.click();
    document.body.removeChild(tempItem);
  });
};


newPlaylistButton.onclick = () => {
  let storage = browser.storage.local;
  let newName = "new playlist ";

  storage.get(null).then(playlistsList => {
    let i = 1;
    while (Object.
        getOwnPropertyNames(playlistsList)
        .includes(newName + i.toString()))
    {
      i++;
    }
    let newItem = {};
    newItem[newName + i.toString()] = [];
    storage.set(newItem);

    currentPlaylistName = newName + i.toString();
    playlistSelectorAdd(currentPlaylistName);
    playlistList.onchange();
  });
};  

playlistList.onchange = () => {
  currentPlaylistName = playlistList.value;
  tableDelete();
  tableCreate();
};

searchBox.onkeyup = () => {
  let regex = new RegExp(searchBox.value);
  let children = document.getElementById("createdTable").firstChild.children;

  for (let i = 0; i < children.length; i++) {

    if (children[i].children[0].textContent
      .match(regex) == null &&
      children[i].children[1].textContent
      .match(regex) == null) {
      
      children[i].classList.add("hidden");
    } else {
      children[i].classList.remove("hidden");
    }
  }
};


addButton.onclick = function() {
  addPlayListEntry();
}

function tableDelete() {
  let table = document.getElementById("createdTable");
  return table.parentNode.removeChild(table);
};

function removeButtonCallback(e) {
  var event = Object.assign({},e);
  let storage = browser.storage.local;
  storage.get(currentPlaylistName).then(playlist => {

    let value = playlist[currentPlaylistName] || [];

    for (let i = 0; i < value.length; i++) {
      if (value[i].url == e.target.parentNode.parentNode
        .children[1].firstChild.href) {
        value.splice(i, 1);
        break;
      }
    }

    let newItem = {};
    newItem[currentPlaylistName] = value;
    storage.set(newItem);
    e.target.parentNode.parentNode.remove();
  });
};

function tableUpdate(title, url) {
  let tr = document.createElement("tr");
  let td1 = document.createElement("td");
  let td2 = document.createElement("td");
  let td3 = document.createElement("td");

  td1.setAttribute("title", title);
  td1.append(document.createTextNode(title));

  let link = document.createElement("a");
  link.href = url;
  link.text = url;
  td2.setAttribute("title", url);
  td2.append(link);

  let button = document.createElement("button");
  button.innerHTML = "Remove";
  button.onclick = removeButtonCallback;

  td3.append(button);

  tr.append(td1);
  tr.append(td2);
  tr.append(td3);

  let tblBody = document.getElementById("tbody");
  tblBody.prepend(tr);
};

function tableCreate() {
  var body = document.getElementsByClassName("playlist")[0];
  var tbl = document.createElement("table");
  var tblBody = document.createElement("tbody");

  tbl.setAttribute("id", "createdTable");
  tblBody.setAttribute("id", "tbody");

  let storage = browser.storage.local;

  storage.get(currentPlaylistName).then(playlist => {
    let value = playlist[currentPlaylistName] || [];

    for (let i = 0; i < value.length; i++) {
      var tr = document.createElement("tr");

      var td1 = document.createElement("td");
      var td2 = document.createElement("td");
      var td3 = document.createElement("td");

      td1.append(document.createTextNode(value[i].title));

      let link = document.createElement("a");
      link.href = value[i].url;
      link.text = value[i].url;
      td2.append(link);

      var button = document.createElement("button");
      button.innerHTML = "Remove";
      button.onclick = removeButtonCallback;
      td3.append(button);

      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);

      tblBody.appendChild(tr);
    }
    tbl.appendChild(tblBody);
    body.appendChild(tbl);
  });
};

function addPlayListEntry() {
  let storage = browser.storage.local;
  browser.tabs.query({active: true, currentWindow: true}).then(tabs => {

    let tab = tabs[0];
    let url = tab.url;
    let title = tab.title;
    let time = Date.now();

    storage.get(currentPlaylistName).then(playlist => {

      let value = playlist[currentPlaylistName] || [];

      if (!value.map(a => a.url).includes(url)) {

        value.push({title: title, url: url, time: time});
        let newItem = {};
        newItem[currentPlaylistName] = value;
        storage.set(newItem);
        tableUpdate(title, url);
      }
    });
  });
};

function playlistSelectionPopulate() {
  let storage = browser.storage.local;

  storage.get(null).then(playlistsList => {
    for (let name in playlistsList) {
      let option = document.createElement("option");
      option.value = name;
      option.append(document.createTextNode(name));
      playlistList.appendChild(option);
    }
    currentPlaylistName = playlistList.value;
  });
}

function playlistSelectorAdd(itemName) {

  let option = document.createElement("option");
  option.value = itemName;
  option.append(document.createTextNode(itemName));

  playlistList.appendChild(option);
  playlistList.value = currentPlaylistName;
}

function playlistSelectorRemove(itemName) {
  for (let i = 0; i < playlistList.children.length; i++) {
    if (playlistList.children[i].value == itemName) {
      playlistList.children[i].remove();
    }
  }
};


optionsButton.onclick = () => {
  let topRow = document.getElementById("topRow");
  let table = document.getElementById("playlist");
  topRow.style.display = "none";
  table.style.display = "none";


  let optionsMenu = document.getElementById("optionsMenu");
  optionsMenu.style.display = "flex";
  renameInput.value = currentPlaylistName;
  deleteButton.firstChild.data = "Delete";

  let importExport = document.getElementById("importExport");
  importExport.style.display = "flex";
};

backButton.onclick = () => {
  let optionsMenu = document.getElementById("optionsMenu");
  let importExport = document.getElementById("importExport");
  optionsMenu.style.display = "none";
  importExport.style.display = "none";

  let topRow = document.getElementById("topRow");
  let table = document.getElementById("playlist");
  topRow.style.display = "flex";
  table.style.display = "flex";
};

renameButton.onclick = () => {
  let newName = renameInput.value;
  let oldName = currentPlaylistName;
  if (newName == "") {
    return;
  }
  let storage = browser.storage.local;
  storage.get(null).then(playlistsList => {
    for (let name in playlistsList) {
      if (newName == name) {
        return;
      }
    }
    let newItem = {};
    newItem[newName] = playlistsList[oldName];
    storage.set(newItem).then(() => {
      storage.remove(oldName);
      currentPlaylistName = newName;
      playlistSelectorRemove(oldName);
      playlistSelectorAdd(newName);
      
    });
  });
};

deleteButton.onclick = () => {
  if (deleteButton.firstChild.data == "Are you sure?"){
    let gettingDeleted = currentPlaylistName;
    let storage = browser.storage.local;
    storage.remove(gettingDeleted);
    backButton.onclick();
    playlistSelectorRemove(gettingDeleted);
    currentPlaylistName = playlistList.value;
    tableDelete();
    tableCreate();
  } else {
    deleteButton.firstChild.data = "Are you sure?";
  }
};

playlistSelectionPopulate();
tableCreate();
