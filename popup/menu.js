"use strict";
var API = chrome || browser;
import {storageGet, storageSet, storageRemove, tabsQuery} from "../modules/wrapper.js";
import {newPlaylist, tableCreate, tableDelete, tableUpdate,
  addPlaylistEntry, playlistSelectionPopulate, playlistSelectorAdd,
  playlistRename, playlistDelete, searchTable} from "../modules/table.js"
import {exportAll, exportPlaylist} from "../modules/util.js";

// Background page
let bg = API.extension.getBackgroundPage();

// Buttons
let playButton = document.getElementById("playButton");
let pausebutton = document.getElementById("pauseButton");
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

//TODO: Add sort to table

playButton.onclick = () => {
  //let bp = API.extension.getBackgroundPage();
  API.tabs.create({
      url: "../play/page.html"
    });
};

pauseButton.onclick = () => {
  //let bp = API.extension.getBackgroundPage();
};

importButton.onclick = () => {
  if (browser) {
    bg.importClick();
  } else {
    // Open meme tab
  }
};

exportAllButton.onclick = () => {
  exportAll();
};

exportPlaylistButton.onclick = () => {
  exportPlaylist(bg.getCurrentPlaylistName());
};


newPlaylistButton.onclick = () => {
  newPlaylist().then(() => {
    playlistSelectorAdd(bg.getCurrentPlaylistName());
    playlistList.onchange();
  });
};  

playlistList.onchange = () => {
  bg.setCurrentPlaylistName(playlistList.value);
  tableDelete();
  tableCreate();
};

searchBox.onkeyup = () => {
  let regex = new RegExp(searchBox.value, "i");
  searchTable(regex);
};

addButton.onclick = function() {
  addPlaylistEntry();
}

optionsButton.onclick = () => {
  let topRow = document.getElementById("topRow");
  let table = document.getElementById("playlist");
  topRow.style.display = "none";
  table.style.display = "none";


  let optionsMenu = document.getElementById("optionsMenu");
  optionsMenu.style.display = "flex";
  renameInput.value = bg.getCurrentPlaylistName();
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
  let oldName = bg.getCurrentPlaylistName();
  playlistRename(newName, oldName);
};

deleteButton.onclick = () => {

  if (deleteButton.firstChild.data == "Are you sure?"){
    playlistDelete(bg.getCurrentPlaylistName());
  } else {
    deleteButton.firstChild.data = "Are you sure?";
  }
};

playlistSelectionPopulate().then(() => {
  tableCreate();
});
