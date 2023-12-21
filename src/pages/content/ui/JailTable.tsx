import React from 'react';
import { TableContainer, Table, Thead, Tr, Th, Tbody, Td, Button, Link } from '@chakra-ui/react';
import { ExternalLinkIcon , UnlockIcon } from '@chakra-ui/icons'
import { FXJ_Actions } from '@root/src/shared/fxjail';
import useStorage from '@src/shared/hooks/useStorage';
import exampleThemeStorage from '@root/src/shared/storages/exampleThemeStorage';

export default function JailTable(props:any)
{
    const [open, setOpen] = React.useState(props.open);
    const [content, setContent] = React.useState(props.content || 'artists');
    const [data, setData] = React.useState({artists:[], collections:[]});
    const theme = useStorage(exampleThemeStorage);
    const dirty = props.dirty;

    
    
    React.useEffect(() => {

        setOpen(props.open);
        if( !props.open )
            return;
        
        (async () => {
            const response = await chrome.runtime.sendMessage({ type: FXJ_Actions.GET_STATE });
            console.log("response ? " , response);            
            setData(response);
        })();
        
        

    }, [setData, setOpen, props.open]);


    const handleReleaseClick = (e, index) => {
        dirty.current = true;
        console.log( 'release clicked => ', index);
        if( content === 'artists')
        {
            (async () => {
                const response = await chrome.runtime.sendMessage({ type: FXJ_Actions.RELEASE_ARTIST, payload:data.artists[index].name });
                console.log("response ? " , response);
                setData(response);
            })();
        }
        else 
        {
            (async () => {
                const response = await chrome.runtime.sendMessage({ type: FXJ_Actions.RELEASE_COLLECTION, payload:data.collections[index].name });
                console.log("response ? " , response);
                setData(response);
            })();
        }
        
    }

    const buildURL = (item) => {

        if( content === 'artists')
        {
            return 'https://www.fxhash.xyz/u/' + item.name;
        }
        else 
        {
            return 'https://www.fxhash.xyz' + item.url;
        }
    }

    const getElements = () => 
    {
        if( !open)
            return;
        //console.log( "items current = " , data);

        const listItems = (content === 'artists')?data.artists:data.collections;
        if( listItems == null || listItems.length == 0)
            return; 

        return (
            <>
            {
                
                listItems.map( (item, index) => {
                    return (
                        <Tr key={index}>
                            <Td >{item.name}</Td>
                            <Td><Link href={buildURL(item)} target='_blank'>visit page<ExternalLinkIcon ml='5px' mb='3px'/></Link></Td>
                            <Td isNumeric>
                                <Button 
                                onClick={(event)=>handleReleaseClick(event, index)} 
                                colorScheme={theme === 'light'?'hotpink':'ihotpink'}
                                color={theme === 'light'?'#fff':'#fff'}
                                pb={1.5}
                                borderRadius={0}
                                key={index}
                                >
                                    release <UnlockIcon as="span" ml={2} mb={-0.25}/>
                                </Button>
                            </Td>
                        </Tr>
                    );
                })
            }
           </>
        );
    }
    

    return (
    <>
    <TableContainer>
        <Table variant='simple'>
        <Thead>
            <Tr>
                <Th width='60%'>name</Th>
                <Th>link</Th>
                <Th isNumeric>actions</Th>
            </Tr>
        </Thead>
        <Tbody>
            {getElements()}
        </Tbody>
        </Table>
    </TableContainer>
    </>
    );
}