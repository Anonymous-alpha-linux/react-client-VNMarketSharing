import React from 'react'
import { useLocation } from 'react-router-dom';
import { HiOutlineMenuAlt1 } from 'react-icons/hi';
import MediaQuery from 'react-responsive';
import { CustomNavLink} from '..';
import './sidebar.css';

interface SidebarProps {
    children?: React.ReactNode;
    show: boolean;
    data: SidebarPropData[];
}
export interface SidebarPropData{
    title: string;
    path: string;
    icon: React.ReactNode;
    subNav?: SidebarPropData[];
    isOpened?: boolean;
    isRoot?: boolean;
    iconOpened: React.ReactNode;
    iconClosed: React.ReactNode;
}
interface SidebarState{
    data: SidebarPropData[];
    show: boolean;
}

export function Sidebar(props: SidebarProps) {
    const [state , setState] = React.useState<SidebarState>({
        data: props.data,
        show: props.show
    });

    React.useEffect(() => { setState({
        data: props.data,
        show: props.show
    }) },[props]);

    function setOpenForSpecificTab(pathName: string){
        setState(o => {
            return {
                ...o,
                data: o.data.map(tab =>{
                    if(tab.path !== pathName) return {
                        ...tab,
                        isOpened: false
                    };
                    return {
                        ...tab,
                        isOpened: !tab.isOpened
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
                    top: '1.5rem', 
                    left: '260px',
                    zIndex: 1000,
                    cursor: 'pointer'
                }}>
                    <HiOutlineMenuAlt1></HiOutlineMenuAlt1>
            </div>
        </MediaQuery>

        <div className={"sidebar__root" + `${!state.show ? " sidebar__root--hidden": ""}`}>
            <SidebarData data={state.data} 
                onOpenTab={(pathName: string) => setOpenForSpecificTab(pathName)} 
                show={state.show}
            ></SidebarData>
        </div>

        {props?.children && <main className={"main"}>
            {props.children}
        </main>}
    </>
    )
}

interface SidebarDataProps {
    children?: React.ReactNode;
    className?: string;
    show?: boolean;
    data: SidebarPropData[];
    onOpenTab?: (tab: string) => void;
}

const SidebarData = React.forwardRef(({data, onOpenTab, show}: SidebarDataProps, ref) => {
    // const [height, setHeight] = React.useState<number>(0);
    const elementRefs = React.useRef<HTMLLIElement[]>([]);
    
    // React.useLayoutEffect(() =>{        
    //     if(elementRefs.current.length){
    //         Promise.resolve(elementRefs.current.reduce((prev, current) => {
    //             console.log(current.offsetHeight);
    //             return prev + current.offsetHeight;
    //         }, 0)).then(elementHeight => {
    //             setHeight(elementHeight);
    //         })
    //     }
    // },[elementRefs, show])

    return <>
        <ul className={`sidebar__group${show && " sidebar__group--show" || ''}`}>
            {data.map((link,index) =>(
                <SidebarLink key={index + 1} 
                    ref={element =>{
                        if(element){
                            elementRefs.current[index] = element;
                        }
                    }} 
                    show={show}
                    data={link} 
                    onOpenTab={onOpenTab}
                ></SidebarLink>
            ))}
        </ul>
    </>
})

interface SidebarLinkProps {
    data: SidebarPropData;
    show?: boolean;
    onOpenTab?: (path: string) => void;
}

const SidebarLink = React.forwardRef<HTMLLIElement,SidebarLinkProps>(({data, onOpenTab, ...props}, ref) => {
    const [showNav,setShowNav] = React.useState<boolean>();
    const location = useLocation();
    return <>
        <li ref={ref}
        onClick={() => {
            onOpenTab && onOpenTab(data.path);
            setShowNav(show => !show);
        }}
        data-isopen={props.show}
        className={"sidebar__data--title" + `${!location.pathname.includes(data.path) 
        ? "" 
        : data.isRoot
            ? " sidebar__title--active"
            : location.pathname.match(`${data.path}$`)
                ? " sidebar__link--active" 
                : ""}`}
        >
            <CustomNavLink to={data.path}>
                <i className='sidebar__title--icon' style={{display:'inline-block'}}>{data.icon}</i>
                <span className="sidebar__context" style={{ verticalAlign: 'middle', margin: '0 0.96rem'}}>
                    {data.title}
                </span>
            </CustomNavLink>

            {data.subNav && <span className={`sidebar__icon ${data.isOpened ?"sidebar__icon--open" : ""}`}>
                {data.iconClosed}
            </span>}
        </li>

        {data.subNav && <li 
            data-isopen={props.show}>
            <SidebarData data={data.subNav || []}
                show={data.isOpened}
            ></SidebarData>
        </li>}
    </>
})
