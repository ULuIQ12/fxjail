import React from 'react';
import { createRoot } from 'react-dom/client';
import '@pages/popup/index.css';
import Popup from '@pages/popup/Popup';
import refreshOnUpdate from 'virtual:reload-on-update-in-view';
import { ChakraProvider } from '@chakra-ui/react'
import { extendTheme } from "@chakra-ui/react"

refreshOnUpdate('pages/popup');

function init() {
  const appContainer = document.querySelector('#app-container');
  if (!appContainer) {
    throw new Error('Can not find #app-container');
  }
  const root = createRoot(appContainer);
  const popupTheme = extendTheme({
    colors: {
      hotpink: {
        50: "#f4bcd0",
      100: "#f7aac5",
      200: "#ff79aa",
      300: "#ff2f7e",
      400: "#ff0863",
      500: "#ff005c",
      600: "#e3004c",
      700: "#a20039",
      800: "#780730",
      900: "#560f29",
      },
    },
  })
  root.render(
    <ChakraProvider theme={popupTheme}>
      <Popup />
    </ChakraProvider>);
}

init();
