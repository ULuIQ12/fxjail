import React from 'react';
import { Button, ButtonGroup, Stack, Box, Center, AbsoluteCenter,  Text, Heading, StackDivider, Card, CardHeader, CardBody  } from '@chakra-ui/react';
import { useDisclosure, Popover, PopoverTrigger,PopoverHeader, PopoverArrow, PopoverContent, PopoverBody, PopoverCloseButton } from '@chakra-ui/react';
import { LockIcon } from '@chakra-ui/icons';
import useStorage from '@src/shared/hooks/useStorage';
import exampleThemeStorage from '@root/src/shared/storages/exampleThemeStorage';

export default function EndPickPopup(props:any)
{
    const [open, setOpen] = React.useState(props.open);
    const [artistName, setArtistName] = React.useState("");
    const [tokenName, setTokenName] = React.useState("");
    const [anchorEl, setAnchorEl] = React.useState(null);
    const { onToggle } = useDisclosure()
    const theme = useStorage(exampleThemeStorage);

    React.useEffect(() => {

        setOpen(props.open);
        if( !props.open)
            return;

        setArtistName(props.artist);
        setTokenName(props.token);
        setAnchorEl(props.elem);
        console.log(props.elem);
    }, [props]);

    const getLeft = () => {
        if( !anchorEl )
            return 0;
        
        return anchorEl.getBoundingClientRect().left + window.scrollX;
    }

    const getTop = () => {
        if( !anchorEl )
            return 0;
        return anchorEl.getBoundingClientRect().top + window.scrollY;
    }

    const handleArtistClick = () => {
        console.log('handleArtistClick ->', artistName);
        props.onClose("artist");
    }

    const handleCollectionClick = () => {
        console.log('handleCollectionClick ->', tokenName);
        props.onClose("collection");
    }


    const handleClose = () => {
        console.log( "HandleCLOSE ", props);
        props.onClose("cancel");
    }
    
    return (
        <>
        <Popover 
            isOpen={open}
            placement='right'
            onClose={handleClose}
            closeOnBlur={true}
            >
            <PopoverTrigger>
                <Box 
                    onClick={handleClose}
                    position='absolute' 
                    top={getTop() + 'px'}
                    left={getLeft() + 'px'}
                    w={ (anchorEl?.clientWidth + 8)+ 'px'} 
                    h={ (anchorEl?.clientHeight + 8)+ 'px'}
                    bg='rgba(1,0,0,0.0)' 
                    border={'2px dashed #ff005c'}
                    display={open?'block':'none'}
                    
                />
            </PopoverTrigger>
            <PopoverContent 
                border={'4px solid #ff005c'}
                p={4}
                boxSizing='border-box'
                backgroundColor={theme==='light'?'fff':'#222'}
                color={theme==='light'?'#222':'#fff'}
                borderRadius={0}>
                { /* <PopoverHeader color={'#222'} fontWeight='semibold' textTransform='uppercase'>Choose punishment</PopoverHeader> */}
                <PopoverArrow bgColor={'#ff005c'}/>
                <PopoverCloseButton />
                <PopoverBody>

                    <Stack spacing='4' mb={2} divider={<StackDivider />} >
                        <Box>
                            <Heading size='md'>
                            - artist
                            </Heading>
                            <Text pt='3' fontSize='md' noOfLines={1}>
                            {artistName}
                            </Text>
                            <Button mt={8} p={4} borderRadius={0} width='100%' onClick={handleArtistClick} 
                                colorScheme={theme === 'light'?'hotpink':'ihotpink'}
                                color={"fff"}
                            >
                                    Imprison artist <LockIcon as="span" ml={2} mb={-0.25}/>
                            </Button>
                        </Box>
                        <Box>
                            <Heading size='md'>
                            - collection
                            </Heading>
                            <Text pt='3' fontSize='md' noOfLines={1}>
                            {tokenName}
                            </Text>
                            <Button mt={8} p={4} borderRadius={0} width='100%' onClick={handleCollectionClick}
                                colorScheme={theme === 'light'?'hotpink':'ihotpink'}
                                color={"fff"}
                            >
                                Imprison collection <LockIcon as="span" ml={2} mb={-0.25}/>
                            </Button>
                        </Box>
                    </Stack>  
        
                </PopoverBody>
            </PopoverContent> 
        </Popover>
        </>
      );
}