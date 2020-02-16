"use strict";
var API = chrome || browser;
import {storageGet, storageSet, storageRemove, tabsQuery} from "./wrapper.js";

// Background page
let bg = API.extension.getBackgroundPage();

export function newPlaylist() {
  return new Promise((resolve, reject) => {
    let newName = "new playlist ";

    storageGet(null, (playlistsList) => {
      let i = 1;
      while (Object.
          getOwnPropertyNames(playlistsList)
          .includes(newName + i.toString()))
      {
        i++;
      }
      let newItem = {};
      newItem[newName + i.toString()] = [];
      storageSet(newItem);

      newName += i.toString();
      bg.setCurrentPlaylistName(newName);

      resolve();
    });
  });
}

export function tableDelete() {
  let table = document.getElementById("createdTable");
  return table.parentNode.removeChild(table);
};

export function tableUpdate(title, url) {
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
export function tableCreate() {
  var body = document.getElementsByClassName("playlist")[0];
  var tbl = document.createElement("table");
  var tblBody = document.createElement("tbody");

  tbl.setAttribute("id", "createdTable");
  tblBody.setAttribute("id", "tbody");

  let pln = bg.getCurrentPlaylistName();
  storageGet(pln, (playlist) => {
    let value = playlist[pln] || [];

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

export function addPlaylistEntry() {
  return new Promise((resolve, reject) => {
    tabsQuery({active: true, currentWindow: true},(tabs) => {

      let tab = tabs[0];
      let url = tab.url;
      let title = tab.title;
      let time = Date.now();

      let pln = bg.getCurrentPlaylistName();
      storageGet(pln, (playlist) => {

        let value = playlist[pln] || [];

        if (!value.map(a => a.url).includes(url)) {

          value.push({title: title, url: url, time: time});
          let newItem = {};
          newItem[pln] = value;
          storageSet(newItem);
          tableUpdate(title, url);
        }

        resolve();
      });
    });
  });
}

export function playlistSelectionPopulate() {
  return new Promise((resolve, reject) => {
    let playlistList = document.getElementById("playlists");
    storageGet(null, (playlistsList) => {
      for (let name in playlistsList) {
        let option = document.createElement("option");
        option.value = name;
        option.append(document.createTextNode(name));
        playlistList.appendChild(option);
      }
      bg.setCurrentPlaylistName(playlistList.value);

      resolve();
    });

  });
}

export function playlistSelectorAdd(itemName) {
  return new Promise((resolve, reject) => {
    let option = document.createElement("option");
    option.value = itemName;
    option.append(document.createTextNode(itemName));

    let playlistList = document.getElementById("playlists");
    playlistList.appendChild(option);
    playlistList.value = bg.getCurrentPlaylistName();

    resolve();
  });
}

export function playlistRename(newName, oldName) {
  return new Promise((resolve, reject) => {
    if (newName == "") {
      return;
    }
    storageGet(null, (playlistsList) => {
      for (let name in playlistsList) {
        if (newName == name) {
          return;
        }
      }
      let newItem = {};
      newItem[newName] = playlistsList[oldName];
      storageSet(newItem, () => {
        storageRemove(oldName);
        bg.setCurrentPlaylistName(newName);
        playlistSelectorRemove(oldName);
        playlistSelectorAdd(newName);

        resolve();
      });
    });
  });
}

export function playlistDelete(gettingDeleted) {
  return new Promise((resolve, reject) => {
    storageRemove(gettingDeleted);
    backButton.onclick();
    playlistSelectorRemove(gettingDeleted);
    let playlistList = document.getElementById("playlists");
    bg.setCurrentPlaylistName(playlistList.value);
    tableDelete();
    tableCreate();

    resolve();
  });
}

export function searchTable(regex) {
  return new Promise((resolve, reject) => {
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
    resolve();
  });
}

function playlistSelectorRemove(itemName) {
  let playlistList = document.getElementById("playlists");
  for (let i = 0; i < playlistList.children.length; i++) {
    if (playlistList.children[i].value == itemName) {
      playlistList.children[i].remove();
    }
  }
};

function removeButtonCallback(e) {
  var event = Object.assign({},e);
  let pln = bg.getCurrentPlaylistName();
  storageGet(pln, (playlist) => {

    let value = playlist[pln] || [];

    for (let i = 0; i < value.length; i++) {
      if (value[i].url == e.target.parentNode.parentNode
        .children[1].firstChild.href) {
        value.splice(i, 1);
        break;
      }
    }

    let newItem = {};
    newItem[pln] = value;
    storageSet(newItem);
    e.target.parentNode.parentNode.remove();
  });
};
