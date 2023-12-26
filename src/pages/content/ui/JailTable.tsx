import React from 'react';
import { TableContainer, Table, Thead, Tr, Th, Tbody, Td, Button, Link, Spinner } from '@chakra-ui/react';
import { ExternalLinkIcon , TriangleDownIcon, TriangleUpIcon, UnlockIcon } from '@chakra-ui/icons'
import { FXJ_Actions } from '@root/src/shared/fxjail';
import useStorage from '@src/shared/hooks/useStorage';
import exampleThemeStorage from '@root/src/shared/storages/exampleThemeStorage';

export default function JailTable(props:any)
{
    const [open, setOpen] = React.useState(props.open);
    const [content, setContent] = React.useState(props.content || 'artists');
    const [data, setData] = React.useState({artists:[], collections:[]});
    
    const [sortOrder, setSortOrder] = React.useState("down");
    const theme = useStorage(exampleThemeStorage);
    const dirty = props.dirty;

    const isLoaded = React.useRef(false);
    
    
    React.useEffect(() => {

        setOpen(props.open);
        isLoaded.current= false;
        if( !props.open )
            return;
        
        (async () => {
            const response = await chrome.runtime.sendMessage({ type: FXJ_Actions.GET_STATE });
            //console.log("response ? " , response);            
            setData(response);
            isLoaded.current = true;
        })();
        
        

    }, [setData, setOpen, props.open, props.loaded, isLoaded]);


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

    const sorter = (a, b) => {
        if( sortOrder === 'down')
        {
            if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
            if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
        }
        else 
        {
            if (a.name.toLowerCase() > b.name.toLowerCase()) return -1;
            if (a.name.toLowerCase() < b.name.toLowerCase()) return 1;
        }
        return 0;
    }

    const wName = () => 
    {
        return '60%';
    }
    const wLink = () => 
    {
        return '20%';
    }
    const wButton = () =>
    {
        return '20%';
    } 

    const isSmall = () => 
    {
        return window.innerWidth < 800;
    }

    const getElements = () => 
    {
        if( !open)
            return;
        //console.log( "items current = " , data);

        let listItems = (content === 'artists')?data.artists:data.collections;
        if( listItems == null || listItems.length == 0)
            return;
        
        // sort items by name, alphanumeric
        listItems.sort(sorter)
        //console.log(listItems)
        return (
            <>
            {
                
                listItems.map( (item, index) => {
                    return (
                        <Tr key={index}>
                            <Td width={wName()}>{item.name}</Td>
                            <Td ><Link href={buildURL(item)} target='_blank'>{isSmall()?'':'visit page '}<ExternalLinkIcon ml='5px' mb='3px'/></Link></Td>
                            <Td isNumeric>
                                <Button 
                                aria-description='release entry button'
                                onClick={(event)=>handleReleaseClick(event, index)} 
                                colorScheme={theme === 'light'?'hotpink':'ihotpink'}
                                color={theme === 'light'?'#fff':'#fff'}
                                pb={1.5}
                                borderRadius={0}
                                rightIcon={<UnlockIcon/>}
                                key={index}
                                >{isSmall()?'':'release '}
                                    {/* {isSmall()?'':'release '}<UnlockIcon as="span" ml={2} mb={-0.25}/> */}
                                </Button>
                            </Td>
                        </Tr>
                    );
                })
            }
           </>
        );
    }
    
    const toggleSort = () => 
    {
        if( sortOrder === "up")
            setSortOrder("down");
        else 
            setSortOrder("up");
    }

    

    return (
    <>
    <TableContainer>
        <Table variant='simple' aria-description={'list of ' + content}>
        <Thead>
            <Tr verticalAlign={'middle'}>
                <Th width={wName()}>
                    <Button
                    variant='link'
                    color='#888'
                    fontSize={12}
                    onClick={toggleSort}
                    rightIcon={sortOrder==="down"?<TriangleDownIcon />:<TriangleUpIcon/>}>
                        NAME
                    </Button>
                </Th>
                <Th color='#888'>link</Th>
                <Th color='#888' isNumeric>actions</Th>
            </Tr>
        </Thead>
        <Tbody>
            {getElements()}
            {isLoaded.current?'':<Spinner color='#ff005c'/>}
        </Tbody>
        </Table>
    </TableContainer>
    </>
    );
}