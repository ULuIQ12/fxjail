import React from 'react';
import logo from '@assets/img/logo.svg';
import '@pages/popup/Popup.css';
import useStorage from '@src/shared/hooks/useStorage';
import exampleThemeStorage from '@src/shared/storages/exampleThemeStorage';
import withSuspense from '@src/shared/hoc/withSuspense';
import withErrorBoundary from '@src/shared/hoc/withErrorBoundary';
import { useDisclosure, Button, ButtonGroup, Stack, Box, Center, AbsoluteCenter,  Text, Heading, Image, Flex, Spacer, StackDivider, Slide, Icon   } from '@chakra-ui/react';
import hand from '@assets/img/hand.png';
import door from '@assets/img/door.png';
import ululogo from '@assets/img/ulu.png';

import { FXJ_Actions } from '@root/src/shared/fxjail';
import { ExternalLinkIcon, InfoIcon, InfoOutlineIcon, MoonIcon, SettingsIcon, SunIcon } from '@chakra-ui/icons';


const Popup = (props) => {
  const theme = useStorage(exampleThemeStorage);
  const { isOpen, onToggle } = useDisclosure()
  const [pickingEnabled, setPickingEnabled] = React.useState(false);
  function getVersion() {
    return chrome.runtime.getManifest().version;
  }
  
  const version = React.useRef(getVersion());

  React.useEffect(() => {

    //check to see if the active tab is fxhash
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = tabs[0].url;
      if (url.includes('fxhash.xyz')) {
        setPickingEnabled(true);
      }
      else {
        setPickingEnabled(false);
      }
    });
    //console.log('popup view loaded');
    /*
    chrome.runtime.sendMessage({ type: FXJ_Actions.GET_STATE }, (response) => {
      Object.assign(state.current, response);
    });
*/
    

  }, []);

  /*
  <Button onClick={HandleClick} colorScheme='hotpink'>
            Pick a Card
          </Button>*/

  function HandleClick (event) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { type: FXJ_Actions.START_PICK });
    });
    window.close();
  }

  function HandleClickJail (event) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { type: FXJ_Actions.OPEN_JAIL });
    });
    window.close();
  }

  const GALLERY_URL = 'https://www.fxhash.xyz/u/Christophe%20%22Ulu%22%20Choffel';
  const INSTA_URL = 'https://www.instagram.com/uluiq12/';
  const X_URL = 'https://twitter.com/ULuIQ12';

  function handleClickGalleryLink(event) {
    chrome.tabs.create({ url:GALLERY_URL});
  }

  function handleInstagramClick(event) {
    chrome.tabs.create({ url:INSTA_URL});
  }

  function handleXClick(event) {
    chrome.tabs.create({ url:X_URL});
  }

  function handleToggleTheme(event) {
    exampleThemeStorage.toggle();
  }
  
  const popupWidth = 320;
  const footerSize = 40;
  const buttonSize = 260;
  const totalSize = footerSize + buttonSize;

  return (
    
    <Flex 
      w={popupWidth+'px'}  
      h={ totalSize + 'px'}
      direction={'column'}
    >
      <Box 
          w={popupWidth +'px'}
          h={footerSize + 'px'}
          backgroundColor={ theme === 'light' ? '#fff' : '#222'}
          color={theme === 'light' ? '#222' : '#fff'}
        >
        <Flex
          p={2}
          w='100%'
          h='100%'
          direction={'row'}
          borderBottom={'1px solid #aaa'}
        >
          <Heading as='h1' size={'md'}>
            fx(jail)
          </Heading>
          <Spacer />
          <Center>
            <Text fontSize='sm' color='gray.500'>version {version.current}</Text>
          </Center>
          <Center>
            <Button onClick={onToggle} borderRadius={0} colorScheme={'hotpink'} variant={'link'}><InfoOutlineIcon boxSize={4}/></Button>
            <Button onClick={handleToggleTheme} borderRadius={0} colorScheme={'hotpink'} variant={'link'} m={-2}>
              {theme === 'light' ? (<MoonIcon boxSize={4}/>) : (<SunIcon boxSize={4}/>) }
              
            </Button>
          </Center>
        </Flex>
        <Slide direction='bottom' in={isOpen} style={{ zIndex: 10 }}>
          <Box
            w={popupWidth +'px'}
            h={buttonSize + 'px'}
            backgroundColor={ theme === 'light' ? '#fff' : '#222'}
            color={theme === 'light' ? '#222' : '#fff'}
          >
            <Center w={'100%'} h={'100%'}>
              <Flex direction='column' align={'center'}>
              <Image
                src={ululogo}
                w='64px'
                h='64px'
              />
              <Box p={2} justifyContent={'center'} textAlign={'center'}>
                <Text fontSize='sm' >extension developed by ULU</Text>
              </Box>
              <Stack p={2} direction={'row'} spacing={1}>
                <Button onClick={handleXClick} borderRadius={0} colorScheme={'hotpink'} variant={'ghost'} >
                <Icon viewBox='0 0 24 24' boxSize={6}>
                  <path
                    fill='currentColor'
                    d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                  />
                </Icon>
                </Button>
                <Button onClick={handleInstagramClick} borderRadius={0} colorScheme={'hotpink'} variant={'ghost'} >
                <Icon viewBox='0 0 512 512' boxSize={6}>
                  <path
                    fill='currentColor'
                    d="M349.33,69.33a93.62,93.62,0,0,1,93.34,93.34V349.33a93.62,93.62,0,0,1-93.34,93.34H162.67a93.62,93.62,0,0,1-93.34-93.34V162.67a93.62,93.62,0,0,1,93.34-93.34H349.33m0-37.33H162.67C90.8,32,32,90.8,32,162.67V349.33C32,421.2,90.8,480,162.67,480H349.33C421.2,480,480,421.2,480,349.33V162.67C480,90.8,421.2,32,349.33,32Z"
                  />
                  <path
                    fill='currentColor'
                    d="M377.33,162.67a28,28,0,1,1,28-28A27.94,27.94,0,0,1,377.33,162.67Z"
                  />
                  <path
                    fill='currentColor'
                    d="M256,181.33A74.67,74.67,0,1,1,181.33,256,74.75,74.75,0,0,1,256,181.33M256,144A112,112,0,1,0,368,256,112,112,0,0,0,256,144Z"
                  />
                </Icon>
                </Button>
              </Stack>
              <Button borderRadius={0} colorScheme={'hotpink'} variant={'solid'} onClick={handleClickGalleryLink}>visit my fx(hash) gallery <ExternalLinkIcon ml={2} boxSize={6}/></Button>
              </Flex>
            </Center>
          </Box>
        </Slide>
        </Box>
        <Box 
          w={popupWidth +'px'}
          h={buttonSize + 'px'}
          backgroundColor={ theme === 'light' ? '#fff' : '#222'}
          color={theme === 'light' ? '#222' : '#fff'}
          >
          
          <Stack divider={<StackDivider borderColor='#aaa' />} spacing={0}  direction="row" align="center">
            <Box 
              as='button'
              onClick={HandleClick}
              _hover={{ background: '#ff005c', color: '#fff' }}
              transition={"background-color 200ms"}
              >
              <Flex
                  p={2}
                  w='160px'
                  h='260px'
                  direction={'column'}
                  align={'center'}                  
                >
                  <Heading>point</Heading>
                  <Heading>culprit</Heading>
                  <Spacer />
                  <Image 
                    position='relative'
                    width='200px'
                    marginBottom={0}
                    objectFit='cover'
                    overflow='hidden'
                    src={hand} />
              </Flex>
            </Box>
            <Box 
              as='button'
              onClick={HandleClickJail}              
              _hover={{ background: '#ff005c', color: '#fff' }}
              transition={"background-color 200ms"}
              >
                <Flex
                  p={2}
                  w='160px'
                  h='260px'
                  direction={'column'}
                >
                  <Heading>visit</Heading>
                  <Heading>prison</Heading>
                  <Image 
                    position='relative'
                    width='90px'
                    margin='auto'
                    marginBottom={0}
                    objectFit='cover'
                    overflow='hidden'
                    src={door} />
                </Flex>
            </Box>
          </Stack>
          <Box
            display={pickingEnabled?'none':'block'}
            position='absolute'
            top={footerSize + 'px'}
            left={0}
            bgColor={'rgba(0,0,0,0.0)'}
            backdropFilter={'blur(5px)'}
            w={Math.floor( popupWidth*.5 ) +'px'}
            h={buttonSize + 'px'}
          >
          <Center w={'100%'} h={'100%'} p={10} textAlign={'center'}>
            {/*<Text fontSize='md' color='gray.500'>only on (fx)hash</Text>*/}
            <Heading as='h2' size={'lg'}>only on (fx)hash</Heading>
          </Center>
          </Box>
        </Box>
        
    </Flex>

  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
