import React from 'react';
import { Button, ButtonGroup, Stack, Box, Center, AbsoluteCenter,  Text, Heading  } from '@chakra-ui/react';

export default function PickingOverlay(props:any)
{
    const [open, setOpen] = React.useState(props.open);
    const [width, setWidth] = React.useState(window.innerWidth);
    const [height, setHeight] = React.useState(window.innerHeight);
    
    const modified = React.useRef([]);
    
    const MOUSE_VISITED_CLASSNAME = 'crx_mouse_visited';
    //const CARD_CLASS = "div.GenerativeTokenCard_anchor__0RiND";
    //const CARD_CLASS = ".Card_container__dn3j_";
    const GENERIC_CARD_CLASS = "Card_container_";
    const cardElems = document.querySelectorAll( '[ class^="'+GENERIC_CARD_CLASS+'" ]' );
    let CARD_CLASS = "";
    if( cardElems.length > 0)
    {
        CARD_CLASS = "." + cardElems[0].classList[0].toString();
    }
    else 
    {
        console.log("Can't find token card class, default to GenerativeTokenCard_anchor__DbGXY")
        CARD_CLASS = ".Card_container__dn3j_";
    }
    
    //const CARD_CLASS = ".Card_container__Ng56K";  
    
    const GENERIC_CARD_TITLE_CLASS = "GenerativeTokenCard_title_";
    const titleElems = document.querySelectorAll( '[ class^="'+GENERIC_CARD_TITLE_CLASS+'" ]' );
    let cardID = "";
    if( titleElems.length > 0)
    {
        cardID = "." + titleElems[0].classList[0].toString();
    }
    else 
    {
        console.log("Can't find token title class, default to GenerativeTokenCard_title__y4k6B")
        cardID = ".GenerativeTokenCard_title__y4k6B";
    }
    //const cardID:string = ".GenerativeTokenCard_title__y4k6B";
    
    const GENERIC_USER_NAME_CLASS = "UserBadge_user_name_";
    const badgeElems = document.querySelectorAll( '[ class^="'+GENERIC_USER_NAME_CLASS+'" ]' );
    let badgeID = "";
    if( badgeElems.length > 0)
    {
        badgeID = "." + badgeElems[0].classList[0].toString();
    }
    else 
    {
        console.log("Can't find token artist class, default to UserBadge_user_name__WOGMP")
        badgeID = ".UserBadge_user_name__WOGMP";
    }
    //const badgeID:string = ".UserBadge_user_name__WOGMP";
    
    const prevDOM = React.useRef(null);
    const refDOM = React.useRef(null);

    const handleClose = React.useCallback((msg) => {
        props.onClose(msg);
        setOpen(false);
    }, [props.onClose, setOpen]);

    const handleClick = React.useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        if( prevDOM.current != null)
        {
            stopPick("click");
        }
        

    }, []);

    const highlightCartPointerMove = React.useCallback((e) => {

        if( refDOM.current == null || refDOM.current != e.target)
        {
            if( refDOM.current != null)
                refDOM.current.removeEventListener('click', handleClick, false);

            refDOM.current = e.target;
            refDOM.current.addEventListener('click', handleClick, false);
            
        }
        else if( refDOM.current == e.target)
        {

            return;
        }
        
        const srcElement = e.target.closest(CARD_CLASS);
        
        if (prevDOM != srcElement && srcElement!=undefined ) {
            if (prevDOM.current != null) {
                prevDOM.current.classList.remove(MOUSE_VISITED_CLASSNAME);
            }
            srcElement.classList.add(MOUSE_VISITED_CLASSNAME);
            
            prevDOM.current = srcElement;
            document.body.style.cursor = "crosshair";
            refDOM.current.style.cursor = "crosshair";

            modified.current.push(refDOM.current);
        }        
        else if( srcElement == undefined)
        {
            
            if (prevDOM.current != null) {
                prevDOM.current.classList.remove(MOUSE_VISITED_CLASSNAME);
                prevDOM.current = null;
            }
            document.body.style.cursor = "default";
            refDOM.current.style.cursor = "default";
        }

    }, [handleClick]);

    const handleKeyDown = React.useCallback((e) => {
        if (e.key === "Escape") { // escape key maps to keycode `27`
            
            stopPick("cancel");
        }
    }, []);

    const handleResize = React.useCallback((e) => {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
    }, []);

    const handleVisibilityChange = React.useCallback(() => {
        if (document.visibilityState === 'hidden') {
            stopPick("cancel");
        }
    }, []);

    const handleBlur = React.useCallback(() => {
            stopPick("cancel");
    }, []);

    


    React.useEffect(() => {
        setOpen(props.open);
        if( props.open == false)
            return;

        modified.current = [];

        window.addEventListener('resize', handleResize, false);
        document.addEventListener('mousemove', highlightCartPointerMove, false);
        document.addEventListener('keydown', handleKeyDown, false);
        document.addEventListener("visibilitychange", handleVisibilityChange, false);
        window.addEventListener( "blur" , handleBlur, false);


    }, [props.open, highlightCartPointerMove, handleKeyDown, handleResize, handleVisibilityChange, handleClick, handleBlur]);


    
    const stopPick = React.useCallback((reason) => {
        let title = "";
        let artist = "";
        let pslug = "";

        
        if (prevDOM.current != null) {
            prevDOM.current.classList.remove(MOUSE_VISITED_CLASSNAME);
            prevDOM.current.style.cursor = "default";
            const titleItem = prevDOM.current.querySelector(cardID);
            if( titleItem != null)
                title = titleItem.innerText;

            const artistItem = prevDOM.current.querySelector(badgeID);
            if( artistItem != null)
                artist = artistItem.children[0].innerText;

            pslug = prevDOM.current.parentElement.getAttribute("href");

        }

        document.body.style.cursor = "default";
        /*
        if( refDOM.current != null)
        {
            refDOM.current.style.cursor = "default";
            refDOM.current.removeEventListener('click', handleClick, false);
        }
        */
       for( let i:number =0 ; i< modified.current.length;i++)
       {
              const item = modified.current[i];
              item.style.cursor = "pointer";
              item.removeEventListener('click', handleClick, false);
       }

        
        window.removeEventListener('resize', handleResize, false);
        document.removeEventListener('mousemove', highlightCartPointerMove, false);
        document.removeEventListener('keydown', handleKeyDown, false);
        document.removeEventListener("visibilitychange", handleVisibilityChange, false);
        window.removeEventListener( "blur" , handleBlur, false);

        const msg = {
            reason: reason,
            title: title,
            artist: artist,
            slug: pslug,
            elem: prevDOM.current,
        }
        handleClose(msg);
       
    }, [highlightCartPointerMove, handleKeyDown, handleClose, handleResize, handleVisibilityChange, handleClick, handleBlur]);

    return (
        <>
        <Center 
            pointerEvents='none' 
            display={(open)?'block':'none'} 
            pos="fixed" w={width+'px'} 
            h={height+'px'} 
            top="0" 
            p={2}
            
            zIndex={999}
            >
            <Box w='100%' h='100%' border='2px dashed #FF005C' textAlign={'center'}>
                
            </Box>
        </Center>
        <Center
            pointerEvents='none' 
            display={(open)?'block':'none'} 
            pos="fixed" w={width+'px'} 
            h={height+'px'} 
            top="0" 
            p={2}
            zIndex={999}
         >
        <Box
                    backgroundColor='#ff005c'
                    p={2}
                >
                <Heading size='md'>
                    pick a card (esc to cancel)
                </Heading>
                </Box>
        </Center>
        </>
    );
}