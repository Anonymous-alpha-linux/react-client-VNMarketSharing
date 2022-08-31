import React from 'react'
import { useLocation } from 'react-router-dom';
import { HiOutlineMenuAlt1 } from 'react-icons/hi';
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

function SidebarData({data, onOpenTab, show}: SidebarDataProps) {
    const [height, setHeight] = React.useState<number>(0);
    const elementRefs = React.useRef<HTMLLIElement[]>([]);
    
    React.useEffect(() =>{        
        if(elementRefs.current.length){
            Promise.resolve(elementRefs.current.reduce((prev, current) => {
                return prev + current.offsetHeight;
            }, 0)).then(elementHeight => {
                setHeight(elementHeight);
            })
        }

    },[elementRefs, show])

    return <>
        <ul className={`sidebar__group${show && " sidebar__group--show" || ''}`}
            style={{
                height: height
            }}>
            {show && data.map((link,index) =>(
                <SidebarLink key={index + 1} 
                    ref={element =>{
                        if(element){
                            elementRefs.current[index] = element;
                        }
                    }} 
                    data={link} 
                    onOpenTab={onOpenTab}
                ></SidebarLink>
            ))}
        </ul>
    </>
}

interface SidebarLinkProps {
    data: SidebarPropData;
    onOpenTab?: (tab: string) => void;
}

const SidebarLink = React.forwardRef<HTMLLIElement,SidebarLinkProps>(({data, onOpenTab}, ref) => {
    const location = useLocation();
    return <>
        <li ref={ref}
        onClick={() => onOpenTab && onOpenTab(data.path)}
        className={"sidebar__data--title" + `${!location.pathname.includes(data.path) 
        ? "" 
        : data.isRoot
        ? " sidebar__title--active"
        : location.pathname.match(`${data.path}$`)
        ? " sidebar__link--active" : ""}`}>
            <CustomNavLink to={data.path}>
                <i style={{display:'inline-block'}}>{data.icon}</i>
                <span style={{ verticalAlign: 'middle', margin: '0 0.96rem'}}>
                    {data.title}
                </span>
            </CustomNavLink>

            {data.subNav && <span className={`sidebar__icon ${data.isOpened ?"sidebar__icon--open" : ""}`}>
                {data.iconClosed}
            </span>}
        </li>

        {data.subNav && <li>
            <SidebarData data={data.subNav || []} show={data.isOpened}></SidebarData>
        </li>}
    </>
})
