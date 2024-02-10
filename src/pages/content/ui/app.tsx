
import React from 'react';

import EndPickPopup from './EndPickPopup';
import { FXJ_Actions, FXJ_Message } from '@root/src/shared/fxjail';
import PickingOverlay from './PickingOverlay';
import ImportTypePrompt from './ImportTypePrompt';
import Jail from './Jail';
import { FxStorage, JailItem } from '@root/src/shared/storages/fxJailStorage';
import { timeStamp } from 'console';


export default function App() {

  enum CONTENT_STATE
  {
    LOADING,
    IDLE, 
    PICKING, 
    PICKED,
    JAIL, 
    IMPORT_PROMPT
  }

  const data = React.useRef(new FxStorage());
  const importData = React.useRef(new FxStorage());
  const [contentState, setContentState] = React.useState(CONTENT_STATE.LOADING);
  const [artistName, setArtistName] = React.useState("");
  const [tokenName, setTokenName] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [targetElem, setTargetElement] = React.useState(null);

  const GENERIC_CARD_CONTAINER_CLASS = "Card_container_";
  const cardElems = document.querySelectorAll( '[ class^="'+GENERIC_CARD_CONTAINER_CLASS+'" ]' );
  let cardContainerClass:string;
  if( cardElems.length > 0)
  {
    cardContainerClass = cardElems[0].classList[0].toString();
  }
  else 
  {
    console.log("Can't find card container class, default to Card_container__Ng56K")
    cardContainerClass = "Card_container__Ng56K";
  }

  const GENERIC_TOKEN_CARD_CLASS = "GenerativeTokenCard_anchor_";
  let tokenCardClass:string;
  const tokenElems = document.querySelectorAll( '[ class^="'+GENERIC_TOKEN_CARD_CLASS+'" ]' );
  if( tokenElems.length > 0)
  {
    tokenCardClass = "." + tokenElems[0].classList[0].toString();
  }
  else 
  {
    console.log("Can't find token card class, default to GenerativeTokenCard_anchor__DbGXY")
    tokenCardClass = ".GenerativeTokenCard_anchor__DbGXY";
  }

  const GENERIC_BIG_CONTAINER_CLASS = "CardsContainer_container_";
  const bigContainerElems = document.querySelectorAll( '[ class^="'+GENERIC_BIG_CONTAINER_CLASS+'" ]' );
  let bigContainerClass:string;
  if( bigContainerElems.length > 0)
  {
    bigContainerClass = bigContainerElems[0].classList[0].toString();
  }
  else 
  {
    console.log("Can't find big container class, default to CardsContainer_container__JeuYq")
    bigContainerClass = "CardsContainer_container__JeuYq";
  }

  const isJailDirty = React.useRef(false);
  const flaggedNodes = React.useRef([]);
  
  function refreshPageState(event = null, caller = '', dataSrc = null)
  {
    //console.log("refreshPageState ", caller, event);
    const container = document.getElementsByClassName(cardContainerClass);
    
    const bigContainer = document.getElementsByClassName(bigContainerClass)[0];
    if( bigContainer == null)
    {
      console.log("Can't find cards container");
      return;
    }
    if( container.length == 0 )
      return;
    
    //console.log( "Data? " , data.current, dataSrc);
    const src = (dataSrc!=null)?dataSrc:data.current;
    const toRemove = [];
    for (const item of container) 
    {
      let found = false;
      for(const check of src.artists) 
      {
        //console.log("item ? " , item);
        if( item.textContent.includes(check.name)) 
        {
          const card = item.closest(tokenCardClass);
          
          if( card != null )
            toRemove.push(card);
          found = true;
          break;
        }
      }
      if( !found)
      {
        //console.log("not found ", item.textContent);
        const card = item.closest(tokenCardClass) as HTMLElement;
        //if( card != null && flaggedNodes.current.indexOf(card) != -1 )
        if( card != null)
          card.style.display = "inline-flex";
      }
      found = false;
      for(const check of src.collections) 
      {
        if( item.textContent.includes(check.name)) 
        {
          const card = item.closest(tokenCardClass);
          if( card != null )
            toRemove.push(card);
          found = true;
          break;
        }
      }
      if( !found)
      {
        const card = item.closest(tokenCardClass) as HTMLElement;
        //if( card != null && flaggedNodes.current.indexOf(card) != -1 )
        if( card != null)
          card.style.display = "inline-flex";
      }
    }
    flaggedNodes.current = toRemove;

    for(const item of toRemove)
    {
      try {
        item.style.display = "none";
      }
      catch(e)
      {
        //console.log("Error removing element", e);
      }      
    }
  }


  React.useEffect(() => {

    if( contentState === CONTENT_STATE.LOADING)
    {
      //console.log('content view loaded');

      (async () => {
        while( document.readyState !== 'complete' )
        {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        await new Promise(resolve => setTimeout(resolve, 30));

        const response = await chrome.runtime.sendMessage({ type: FXJ_Actions.GET_STATE });
        //console.log("response app ? " , response);
        //setData(response);
        data.current = response;        
        refreshPageState(null, "first");
        setContentState(CONTENT_STATE.IDLE);
      })();

      
    }
}, [CONTENT_STATE.IDLE, CONTENT_STATE.LOADING, contentState]);


React.useEffect(() => 
{
  chrome.runtime.onMessage.addListener((message: FXJ_Message, _, sendResponse) => 
  {
    //console.log('content : message received ->' , message.type, message.payload);
    if( message.type === FXJ_Actions.START_PICK )
    {
      setContentState(CONTENT_STATE.PICKING);
    }
    if( message.type === FXJ_Actions.OPEN_JAIL )
    {
      setContentState(CONTENT_STATE.JAIL);
    }
    return true;
  });

    window.addEventListener('scroll', handleScroll);
    if( contentState === CONTENT_STATE.IDLE)
        refreshPageState(null, "bob");
      
}, []);

  function handleScroll(event)
  {
    refreshPageState(event, "scroll");
  }

  function onEndPickClose(msg)
  {
    //console.log("onEndPickClose -> ", msg);
    if( msg === "artist")
    {

      (async () => {
        const response = await chrome.runtime.sendMessage({ type: FXJ_Actions.ADD_ARTIST, payload:new JailItem(artistName, slug) });
        //console.log("response to add artist? " , response);
        //setData(response);
        data.current = response;
        refreshPageState();
      })();
      
    }
    else if( msg === "collection")
    {
        (async () => {
          const response = await chrome.runtime.sendMessage({ type: FXJ_Actions.ADD_COLLECTION, payload:new JailItem(tokenName, slug) });
          //console.log("response to add collection? " , response);
          //setData(response);
          data.current = response;
          refreshPageState();
        })();
    }
    
    setContentState(CONTENT_STATE.IDLE);
    
  }

  function finishPick(msg)
  {
    //console.log("finishPick -> ", msg);
    if( msg.reason == "cancel")
    {
      setContentState(CONTENT_STATE.IDLE);
      return;
    }

    setArtistName(msg.artist);
    setTokenName(msg.title);
    setTargetElement(msg.elem);
    setSlug(msg.slug);
    setContentState(CONTENT_STATE.PICKED);
  }

  function HandleJailClose()
  {
    
    //console.log("HandleJailClose -> ", isJailDirty.current);
    if( isJailDirty.current )
    {
      setContentState(CONTENT_STATE.LOADING);
      isJailDirty.current = false;
      (async () => {
        const response = await chrome.runtime.sendMessage({ type: FXJ_Actions.GET_STATE });
        //console.log("response app ? " , response);
        data.current = response;
        setContentState(CONTENT_STATE.IDLE);
        refreshPageState(null, "dirtyJail");

      })();
    }
    setContentState(CONTENT_STATE.IDLE);
  }

  function exportJail()
  {
    //console.log('export jail' , data.current);
    const json = JSON.stringify(data.current);
    const blob = new Blob([json],{type:'application/json'});
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    const timestamp = new Date().getTime();
    link.download = 'fxjail_prisoners_' + timestamp  + '.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

  }

  function importJail(data)
  {
    importData.current = data;
    setContentState(CONTENT_STATE.IMPORT_PROMPT);
    //setContentState(CONTENT_STATE.LOADING);
    //console.log('import jail' , data);
    // check that data is valid, comform to FxStorage
    
  }

  function handleImportConfirm(method:string)
  {

    console.log("handleImportClose ", method, importData.current, data.current)
    if( importData.current.artists == null || importData.current.collections == null)
    {
      console.log("invalid data");
      return;
    }

    if( method === "merge")
    {
      importData.current.artists = importData.current.artists.concat(data.current.artists);
      importData.current.collections = importData.current.collections.concat(data.current.collections);
      console.log(importData.current as FxStorage)
      FxStorage.removeDuplicates(importData.current);
      
    }


    (async () => {
      const response = await chrome.runtime.sendMessage({ type: FXJ_Actions.SET_STATE, payload:importData.current, method:method });
      //console.log("response appppp ? " , response);
      data.current = response;
      setContentState(CONTENT_STATE.IDLE);
      refreshPageState(null, "import", data.current);

    })();
  }

  return (
    <>
      
      <EndPickPopup open={contentState === CONTENT_STATE.PICKED}  artist={artistName} token={tokenName} slug={slug} elem={targetElem} onClose={onEndPickClose}/>
      <PickingOverlay open={contentState === CONTENT_STATE.PICKING} onClose={finishPick}/>
      <Jail open={contentState === CONTENT_STATE.JAIL} onClose={HandleJailClose} dirty={isJailDirty} onExport={exportJail} onImport={importJail} />
      <ImportTypePrompt open={contentState === CONTENT_STATE.IMPORT_PROMPT} onClose={handleImportConfirm}/>
    </>

  );
}
