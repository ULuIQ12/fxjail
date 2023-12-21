import React from 'react';
import {  Box, Center, Tabs, TabList, Tab, TabPanels, TabPanel, TabIndicator, Heading, Fade, CloseButton, Flex, Spacer, Button, Menu, MenuButton, MenuList, MenuItem, MenuGroup } from '@chakra-ui/react';
import JailTable from './JailTable';
import { DownloadIcon, ExternalLinkIcon, SettingsIcon } from '@chakra-ui/icons';
import useStorage from '@src/shared/hooks/useStorage';
import exampleThemeStorage from '@root/src/shared/storages/exampleThemeStorage';

export default function Jail(props:any)
{
    const [wsx, setWsx] = React.useState(window.innerWidth);
    const [wsy, setWsy] = React.useState(window.innerHeight);
    const [open, setOpen] = React.useState(props.open);
    const [menuOpen, setMenuOpen] = React.useState(false);
    const theme = useStorage(exampleThemeStorage);
    
    const dirty = props.dirty;
    // close on esc
    const handleEsc = (e) => {
        if (e.key === 'Escape') {
            props.onClose();
        }
    };
    
    React.useEffect(() => {

        setOpen(props.open);
        
        if( !open)
            return;
        
        dirty.current = false;
        setWsx(window.innerWidth);
        setWsy(window.innerHeight);

        addEventListener('resize', () => {
            setWsx(window.innerWidth);
            setWsy(window.innerHeight);
        });

        

        document.addEventListener('keydown', handleEsc);

    //}, [props.open, dirty]);
}, [open, dirty, setOpen, props.open]);

    const exportJail = () => 
    {
        props.onExport();

    }

    const importJail = () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json'; 
        fileInput.addEventListener('change', (event) => {
            if (fileInput.files.length > 0) {
                const file = fileInput.files[0];
                const reader = new FileReader();
                reader.onload = (event) => {
                    const fileContent = event.target.result as string;
                    // Parse the file content as JSON
                    const jsonData = JSON.parse(fileContent);
                    props.onImport(jsonData);
                };
                reader.readAsText(file);
            }
        });
    
        fileInput.click();
        fileInput.remove();
    }

    const handleClose = () => {
        props.onClose();
    }

    return (
        <>
        <Fade in={open}>
        <Box
            pointerEvents={open?'auto':'none'}
            position="fixed"
            top="0"
            left="0"
            w="100%"
            h="100%"
            bg="rgba(0,0,0,0.5)"
            zIndex="9999"
            overflow='hidden'
            
            onClick={() => {props.onClose()} }
        >
            <Center h='100%' w='100%' >
                <Box
                w={wsx * 0.8 + 'px'}
                h={wsy * 0.8 + 'px'} 
                p={0}
                
                backgroundColor={ theme === 'light' ? '#fff' : '#222'}
                color={theme === 'light' ? '#222' : '#fff'}
                border={'2px solid #ff005c'}
                onClick={(e) => {e.stopPropagation();}}
                >
                <Flex
                    direction={'row'}
                    p={2}
                    width='100%'
                >
                    <Box >
                        <Heading size='md' p={2}>
                            - prisoners list
                        </Heading>
                    </Box>     
                    <Spacer />
                    <Box>
                        <Menu>
                            <MenuButton >
                               <Box as="button" p={2} _hover={{bg:'hotpink.500'}} ><SettingsIcon boxSize={6}/></Box>
                                
                            </MenuButton>
                            <MenuList 
                                borderRadius={0}
                                backgroundColor={ theme === 'light' ? '#fff' : '#222'}
                                color={theme === 'light' ? '#222' : '#fff'}
                            >
                                
                                <MenuItem onClick={exportJail} icon={<ExternalLinkIcon /> } backgroundColor={ theme === 'light' ? '#fff' : '#222'} _hover={{bg:'hotpink.500', textColor:'fff'}}>export prisoners list</MenuItem>
                                <MenuItem onClick={importJail} icon={<DownloadIcon />} backgroundColor={ theme === 'light' ? '#fff' : '#222'} _hover={{bg:'hotpink.500', textColor:'fff'}}>import prisoners list</MenuItem>

                            </MenuList>
                        </Menu>
                    </Box>  
                    <Box>
                        <CloseButton size='lg' onClick={() => {props.onClose()} }/>                        
                    </Box>                    
                </Flex>
                
                <Tabs colorScheme='hotpink' isFitted variant='line'>
                    <TabList>
                        <Tab _selected={{ color: 'white', bg: 'hotpink.500' }} ><Heading as='h4' size='md' pb={4}>artists</Heading></Tab>
                        <Tab _selected={{ color: 'white', bg: 'hotpink.500' }} ><Heading as='h4' size='md' pb={4}>collections</Heading></Tab>
                    </TabList>
                    <TabIndicator
                    mt="-1.5px"
                    
                    height="2px"
                    bg="hotpink.500"
                    borderRadius="1px"
                    />
                    <TabPanels mt='2em' overflowY='auto' maxH={(wsy * .8 - 50)+ 'px'}>
                        <TabPanel>
                        <JailTable content='artists' open={props.open} dirty={dirty}/>
                        </TabPanel>
                        <TabPanel>
                        <JailTable content='collections' open={props.open} dirty={dirty}/>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
                </Box>
            </Center>
        </Box>
        </Fade>
        </>
    );
}