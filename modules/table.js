"use strict";
var API = chrome || browser;
import {storageGet, storageSet, storageRemove, tabsQuery} from "./wrapper.js";

// Background page
let bg = API.extension.getBackgroundPage();

export async function newPlaylist() {
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
    console.log(bg.getCurrentPlaylistName());
    //currentPlaylistName = newName + i.toString();
    //playlistSelectorAdd(currentPlaylistName);
    //playlistList.onchange();
  });
}
