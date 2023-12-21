import { ReactNode, useCallback, useEffect, useState } from "react";
import {
  ColorMode,
  ColorModeContext,
  ColorModeScript,
  CSSReset,
  extendTheme,
  GlobalStyle,
  ThemeProvider,
  ChakraProvider,

} from "@chakra-ui/react";
import useStorage from '@src/shared/hooks/useStorage';
import exampleThemeStorage from '@root/src/shared/storages/exampleThemeStorage';

const theme = extendTheme({
  colors: {
    hotpink: {
      50: "#ff005c",
      100: "#ff005c",
      200: "#ff005c",
      300: "#ff79aa",
      400: "#ff0863",
      500: "#ff005c",
      600: "#e3004c",
      700: "#a20039",
      800: "#780730",
      900: "#560f29",
    },
    ihotpink: {
      900: "#ff005c",
      800: "#ff005c",
      700: "#ff005c",
      600: "#ff005c",
      500: "#ff005c",
      400: "#ff005c",
      300: "#a20039", // <-- hightlight
      200: "#ff005c", 
      100: "#ff005c", // <-- main
      50: "#ff005c",
    },

  },
});

const getCurrentTheme = () => {
  const theme = useStorage(exampleThemeStorage);
  return theme;
};

type CustomChakraProviderProps = {
  shadowRootId: string;
  children: ReactNode;
};
export default function CustomChakraProvider({ children, shadowRootId }: CustomChakraProviderProps) {
  const [colorMode, setColorMode] = useState<ColorMode>(getCurrentTheme());
  //const [colorMode, setColorMode] = useState<ColorMode>("light");

  useEffect(() => {
    const darkThemeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const onChangeColorSchema = (event: MediaQueryListEvent) => {
      const isDark = event.matches;
      setColorMode(isDark ? "dark" : "light");
      
    };

    darkThemeMediaQuery.addEventListener("change", onChangeColorSchema);

    return () => {
      darkThemeMediaQuery.removeEventListener("change", onChangeColorSchema);
    };
  }, []);

  const toggleColorMode = useCallback(() => {
    setColorMode(prev => (prev === "dark" ? "light" : "dark"));
  }, []);

  return (
    <ChakraProvider theme={theme} cssVarsRoot={`#${shadowRootId}`}>
      <ColorModeScript initialColorMode="system" />
      <ColorModeContext.Provider value={{ colorMode, setColorMode, toggleColorMode }}>
        <CSSReset />
        <GlobalStyle />
        {children}
      </ColorModeContext.Provider>
    </ChakraProvider>
  );
}