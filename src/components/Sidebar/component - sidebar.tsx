import React from 'react'
import { useLocation } from 'react-router-dom';
import { HiOutlineMenu, HiOutlineMenuAlt1 } from 'react-icons/hi';
import MediaQuery from 'react-responsive';
import { CustomNavLink} from '..';
import { screenType, useResponsive } from '../../hooks';
import { SidebarLinkProps, SidebarProps, SidebarState, SidebarListProps } from './type';
import './sidebar.css';

export function Sidebar(props: SidebarProps) {
    const [state , setState] = React.useState<SidebarState>({
        data: [],
        show: props.show
    });
    const screen = useResponsive();
    const location = useLocation();

    React.useEffect(() => { 
        setState({
            data: props.data.map(link =>({
                ...link,
                isOpened: location.pathname.includes(link?.path || "")
            })),
            show: props.show
        }); 
    },[props]);

    function setOpenForSpecificTab(position: number){
        setState(o => {
            return {
                ...o,
                data: o.data.map((tab, index) =>{
                    if(index !== position) return {
                        ...tab,
                        isOpened: false
                    };
                    return {
                        ...tab,
                        isOpened: true
                    } 
                }),
            }
        });
    }

    function toggleSidebar(){
        setState(o =>({
            ...o,
            show: !o.show
        }));
    }

    React.useEffect(() =>{
        if(screen < screenType["large"]){
            setState(o =>({
                ...o,
                show: false
            }));
        }
    }, [location])

    return (
    <>
        <MediaQuery maxWidth={910} onChange={match =>{
            setState(o =>({
                ...o,
                show: !match
            }));
        }}>
            <div onClick={toggleSidebar}
                style={{
                    position: 'fixed', 
                    top: '1rem', 
                    left: screen <= screenType["mobile"] ? '30px' : '260px',
                    padding: screen <= screenType["mobile"] ? '8px 8px' : 'unset',
                    background: screen <= screenType["mobile"] ? "var(--clr-logo)" : "transparent",
                    zIndex: 1000,
                    borderRadius: '4px',
                    cursor: 'pointer',
                    width: 'max-content',
                    display:'inline-block',
                    ...props?.styleToggle
                }}>
                    {!state.show ? (<HiOutlineMenu></HiOutlineMenu>) : (<HiOutlineMenuAlt1></HiOutlineMenuAlt1>)}
            </div>
        </MediaQuery>

        <div className={"sidebar__root" + `${!state.show ? " sidebar__root--hidden": ""}`} 
            style={{    
                minWidth: screen < screenType["mobile"] ? '100%' : '0',
                ...props.styleContainer}}>

            <SidebarList data={state.data} 
                onOpenTab={(index: number) => setOpenForSpecificTab(index)} 
                show={state.show}
            ></SidebarList>
        </div>

        {props?.children && <main className={"main"} style={{minHeight: '100vh'}}>
            {props.children}
        </main>}
    </>
    )
}

const SidebarList = React.forwardRef(({data, onOpenTab, show}: SidebarListProps, ref) => {

    function openTab(index: number){
        onOpenTab(index)
    }

    return <>
        <ul className={`sidebar__group${show ? " sidebar__group--show" : ''}`}>
            {data.map((link,index) =>(
                <React.Fragment key={index + 1}>
                    <li onClick={() => openTab(index)}>
                        <SidebarLink 
                            item={link}
                        ></SidebarLink>
                    </li>
                    {!!link?.subNav && (
                        <li data-isopen={link.isOpened}>
                            <SidebarList 
                                onOpenTab={() => openTab(index)}
                                data={link?.subNav.map(nav => ({...nav, isOpened: false}))}
                                show={link.isOpened}
                            ></SidebarList>
                        </li>
                    )}
                </React.Fragment>
            ))}
        </ul>
    </>
})

const SidebarLink = ({item}: SidebarLinkProps) => {
    const location = useLocation();
    const screen = useResponsive();

    return <>
        <div
            style={{textAlign: screen < screenType["medium"] ? 'center' : 'left'}}
            className={"sidebar__data--title" + `${!location.pathname.includes(item?.path || "") 
        ? "" 
        : item.isRoot
            ? " sidebar__title--active"
            : location.pathname.match(`${item.path}$`)
                ? " sidebar__link--active" 
                : ""}`}
        >
            {
                !item?.path ?
                (<article>
                    <i className='sidebar__title--icon' style={{display:'inline-block'}}>{item.icon}</i>
                    <span className="sidebar__context" style={{ verticalAlign: 'middle', margin: '0 0.96rem'}}>
                        {item.title}
                    </span>
                </article>) :
                (<CustomNavLink to={item.path}>
                    <article>
                        <i className='sidebar__title--icon' style={{display:'inline-block'}}>{item.icon}</i>
                        <span className="sidebar__context" style={{ verticalAlign: 'middle', margin: '0 0.96rem'}}>
                            {item.title}
                        </span>
                    </article>
                </CustomNavLink>)
            }

            {!!item?.subNav && <span className={`sidebar__icon ${item.isOpened ?"sidebar__icon--open" : ""}`}>
                {item.iconClosed}
            </span>}
        </div>
    </>
}