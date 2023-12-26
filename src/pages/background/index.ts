import { FXJ_Actions, FXJ_Message } from '@root/src/shared/fxjail';
import exampleThemeStorage from '@root/src/shared/storages/exampleThemeStorage';
import fxJailStorage, { FxStorage, JailItem } from '@root/src/shared/storages/fxJailStorage';
import reloadOnUpdate from 'virtual:reload-on-update-in-background-script';

import 'webextension-polyfill';

reloadOnUpdate('pages/background');

/**
 * Extension reloading is necessary because the browser automatically caches the css.
 * If you do not use the css of the content script, please delete it.
 */
reloadOnUpdate('pages/content/style.scss');

/**
 * Handles storage managment
 */

/** Initialization */
chrome.runtime.onInstalled.addListener(() => {
    fxJailStorage.set(fxJailStorage => { return { 
        artists: 
        [
            //new JailItem("artist1", "url1"), 
        ],
        collections:
        [
            //new JailItem("collection1", "url1"), 
        ],
    }; });
    
});

fxJailStorage.get().then( (data) => { console.log('storage', data); } );
exampleThemeStorage.get().then( (data) => { console.log('themeStorage', data); } );

/**
 * Add an artist name to the list
 * @param artist name of the artist
 */
async function addArtist(artist: JailItem) {
    //console.log('addArtist', artist);
    await fxJailStorage.set(fxJailStorage => {
        // check is artist already exists, with same name
        let found = false;
        fxJailStorage.artists.forEach( (item) => {
            if( item.name === artist.name ) {
                found = true;
            }
        });
        if( !found )
            fxJailStorage.artists.push(artist);
        return fxJailStorage;
    });
}

/**
 * Removes an artist from list
 * @param artist 
 */
async function removeArtist(artist: string) {
    //console.log('removeArtist', artist);
    await fxJailStorage.set(fxJailStorage => {
        fxJailStorage.artists = fxJailStorage.artists.filter( (item) => item.name !== artist);
        return fxJailStorage;
    });
}
/**
 * Add a collection to the list
 * @param collection The name of the collection
 */
async function addCollection(collection: JailItem) {
    //console.log('addCollection', collection);
    await fxJailStorage.set(fxJailStorage => {
        let found = false;
        fxJailStorage.collections.forEach( (item) => {
            if( item.name === collection.name ) {
                found = true;
            }
        });
        if( !found ) 
            fxJailStorage.collections.push(collection);
        return fxJailStorage;
    });
}

/**
 * Removes a collection form the list
 * @param collection The aanem of the collection
 */
async function removeCollection(collection: string) {
    //console.log('removeCollection', collection);
    await fxJailStorage.set(fxJailStorage => {
        fxJailStorage.collections = fxJailStorage.collections.filter( (item) => item.name !== collection);
        return fxJailStorage;
    });
}

/** Update storage with new data (in the case of loading an external json) */
async function setData( data:FxStorage) {
    await fxJailStorage.set(fxJailStorage => {
        fxJailStorage = data;
        return fxJailStorage;
    });
}

// LISTENERS
//chrome.runtime.onInstalled.addListener(() => {
    chrome.runtime.onMessage.addListener((message: FXJ_Message, _, sendResponse) => {

        //console.log('background : message received ->' , message.type, message.payload);

        /** 
         * storage retrieveal for the various components
         */
        if (message.type === FXJ_Actions.GET_STATE) {
            fxJailStorage.get().then( (data) => {
                //console.log( "Data from storage", data, sendResponse);
                sendResponse(data);
            } );
        }

        /**
         * Override the storage in the case of loading from a json
         */
        if(message.type == FXJ_Actions.SET_STATE) {
            (async () => {
                await setData(message.payload);
                fxJailStorage.get().then( (data) => {
                    //console.log( "Data from storage", data, sendResponse)
                    sendResponse(data);
                } );
            })();    
        }

        /**
         * handles add artist request and sends back the updated storage
         */
        if( message.type === FXJ_Actions.ADD_ARTIST) {
            (async () => {
                await addArtist(message.payload);
                fxJailStorage.get().then( (data) => {   
                    //console.log( "Data from storage", data, sendResponse);             
                    sendResponse(data);
                } );
            })();
        }

        /**
         * handles artist removal, sends back the updated storage
         */
        if( message.type === FXJ_Actions.RELEASE_ARTIST) {
            (async () => {
                await removeArtist(message.payload);
                fxJailStorage.get().then( (data) => {
                //console.log( "Data from storage", data, sendResponse)
                sendResponse(data);
            } );
            })();
        }

        /**
         * Adds a collection and sends back the update data
         */
        if( message.type === FXJ_Actions.ADD_COLLECTION) {
            (async () => {
                await addCollection(message.payload);
                fxJailStorage.get().then( (data) => {                
                    sendResponse(data);
                } );
            })();
        }

        /**
         * Removes a collection and sends back the updated data
         */
        if( message.type === FXJ_Actions.RELEASE_COLLECTION) {
            
            (async () => {
                await removeCollection(message.payload);
                fxJailStorage.get().then( (data) => {
                //console.log( "Data from storage", data, sendResponse)
                sendResponse(data);
            } );
            })();
        }

        return true;
    });
//});