import React from 'react'



let MenuBarContext = React.createContext<MenuBarContext<any>>(undefined as any);;

export function MenuBarProvider<Values extends MenuBarValues>(props: MenuBarProps<Values>) {
    const [index, setIndex] = React.useState<number>(0);
    const [location, setLocation] = React.useState<MenuBarLocation[]>([]);
    const [displayedSub, displaySub] = React.useState(false);

    React.useEffect(() =>{
        setLocation(props.menu.map(o => ({
            center: 0,
            top: 0,
        })));
    },[props.menu])

    return (
        <MenuBarContext.Provider value={
            {
                menu: props.menu,
                openSubmenu: (e, id) => {
                    // const page = e.currentTarget.textContent;
                    const tempBtn = e.currentTarget.getBoundingClientRect();
                    const center = (tempBtn.left + tempBtn.right) / 2 + 20;
                    const bottom = (props?.additionalBottom || 3);
                    displaySub(true);
                    setLocation(o => o.map((_, index) => index === id ? {
                        center: center,
                        top: bottom
                    } : _));
                    setIndex(id);
                }, 
                closeSubmenu: (e, id) => {
                    displaySub(false);
                },
                location: location,
                displaySub: displayedSub,
                position: props?.position || 'center',
            }
        }>
            <MenuBarChildren currentIndex={index} {...props}></MenuBarChildren>
        </MenuBarContext.Provider>
    )
}

function MenuBarChildren<Values extends MenuBarValues>(props: MenuBarProps<Values> & { currentIndex: number}){
    const values = useContext<Values>();

    return (<>
        {(!!props.menu.length && values) && 
            props?.children?.({...values, currentIndex: props.currentIndex})}
    </>)
}

export function useContext<Values extends MenuBarValues>(){
    return React.useContext<MenuBarContext<Values>>(MenuBarContext);
}

