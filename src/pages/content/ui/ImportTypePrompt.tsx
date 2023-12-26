
import React from 'react';
import {Fade, Center, Box, useDisclosure, Flex, Button, Heading, Stack} from '@chakra-ui/react';
import useStorage from '@src/shared/hooks/useStorage';
import exampleThemeStorage from '@root/src/shared/storages/exampleThemeStorage';

export default function ImportTypePrompt(props:any)
{
    const [wsx, setWsx] = React.useState(window.innerWidth);
    const [wsy, setWsy] = React.useState(window.innerHeight);

    const [open, setOpen] = React.useState(false);
    const theme = useStorage(exampleThemeStorage);

    const handleEsc = (e) => {
        if (e.key === 'Escape') {
            props.onClose();
        }
    };
    
    React.useEffect(() => {

        setOpen(props.open);
        
        if( !open)
            return;
        
        setWsx(window.innerWidth);
        setWsy(window.innerHeight);

        addEventListener('resize', () => {
            setWsx(window.innerWidth);
            setWsy(window.innerHeight);
        });

        

        document.addEventListener('keydown', handleEsc);

    //}, [props.open, dirty]);
}, [open, setOpen, props.open]);


function handleClose(e, method="")
{
    setOpen(false);
    props.onClose(method);
}

function handleReplaceClick(e)
{
    handleClose(e, "replace")
}

function handleMergeClick(e)
{
    handleClose(e, "merge")
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
            
            onClick={(e) => { e.stopPropagation(); e.preventDefault(); } }
        >
            <Center h='100%' w='100%' >
                <Box
                
                
                p={4}
                
                backgroundColor={ theme === 'light' ? '#fff' : '#222'}
                color={theme === 'light' ? '#222' : '#fff'}
                border={'2px solid #ff005c'}
                onClick={(e) => {e.stopPropagation();}}
                >
                <Flex
                    direction={'column'}
                    align={'center'}
                >
                    <Heading as='h3' size={'md'}>How do you want to import the new data ?</Heading>
                    <Stack mt={4}>
                        <Button borderRadius={0} width='100%' onClick={handleReplaceClick} 
                                    colorScheme={theme === 'light'?'hotpink':'ihotpink'}
                                    color={"fff"}
                                >
                                        Replace previous list
                        </Button>
                        <Button borderRadius={0} width='100%' onClick={handleMergeClick} 
                                    colorScheme={theme === 'light'?'hotpink':'ihotpink'}
                                    color={"fff"}
                                >
                                        Merge with previous list
                        </Button>
                    </Stack>
                </Flex>
                </Box>
                


            </Center>
        </Box>
        </Fade>
        </>
    );
}