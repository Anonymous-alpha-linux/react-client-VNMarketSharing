import { 
    AiOutlineDashboard, 
    AiOutlineInbox,} from 'react-icons/ai';
import { BiPurchaseTagAlt, BiCategoryAlt } from 'react-icons/bi';
import { BsDot } from 'react-icons/bs';
import { FaUser, FaUserLock } from 'react-icons/fa';
import { FiUser } from 'react-icons/fi';
import { GoChevronRight,GoChevronDown } from 'react-icons/go';
import { HiOutlineUsers } from 'react-icons/hi';
import { FcInspection }from 'react-icons/fc';
import { Sidebar, SidebarPropData } from '../../components';
export * from './category';

export const AdminLinksSidebar:React.FC<{children: React.ReactNode}>= (props) => {
    const sidebarStatic : SidebarPropData[] = [
        {
            title: "Dashboard",
            path: "dashboard",
            icon: <AiOutlineDashboard></AiOutlineDashboard>,
            iconClosed: <GoChevronRight></GoChevronRight>,
            iconOpened: <GoChevronDown></GoChevronDown>,
            isRoot: true
        },
        {
            title: "Product",
            path: "product",
            icon: <AiOutlineInbox></AiOutlineInbox>,
            iconClosed: <GoChevronRight></GoChevronRight>,
            iconOpened: <GoChevronDown></GoChevronDown>,
            isRoot: true,
            subNav: [
                {
                    title: 'Product Inspect',
                    path: "product",
                    icon: <FcInspection></FcInspection>,
                    iconClosed: <GoChevronRight></GoChevronRight>,
                    iconOpened: <GoChevronDown></GoChevronDown>,
                },
                {
                    title: "Category",
                    path: "category",
                    icon: <BiCategoryAlt></BiCategoryAlt>,
                    iconClosed: <GoChevronRight></GoChevronRight>,
            iconOpened: <GoChevronDown></GoChevronDown>,
                    isRoot: true
                }
            ]
        },
        {
            title: "Expense",
            path: "expense",
            icon: <BiPurchaseTagAlt></BiPurchaseTagAlt>,
            iconClosed: <GoChevronRight></GoChevronRight>,
            iconOpened: <GoChevronDown></GoChevronDown>,
            isRoot: true
        },
        {
            title: 'Seller',
            path: "seller",
            isRoot: true,
            icon: <HiOutlineUsers></HiOutlineUsers>,
            iconClosed: <GoChevronRight></GoChevronRight>,
            iconOpened: <GoChevronDown></GoChevronDown>,
        },
        {
            title: "User",
            path: "user",
            icon: <FiUser></FiUser>,
            iconClosed: <GoChevronRight></GoChevronRight>,
            iconOpened: <GoChevronDown></GoChevronDown>,
            isRoot: true,
            subNav: [
                {
                    title: "List",
                    path: "user",
                    icon: <FaUser></FaUser>,
                    iconClosed: <GoChevronRight></GoChevronRight>,
                    iconOpened: <GoChevronDown></GoChevronDown>,
                },
                {
                    title: "Block",
                    path: "block",
                    icon: <FaUserLock></FaUserLock>,
                    iconClosed: <GoChevronRight></GoChevronRight>,
                    iconOpened: <GoChevronDown></GoChevronDown>,
                }
            ]
        },
        // {
        //     title: "Report",
        //     path: "report",
        //     icon: <AiOutlinePrinter></AiOutlinePrinter>,
        //     iconClosed: <GoChevronRight></GoChevronRight>,
        //     iconOpened: <GoChevronDown></GoChevronDown>,
        //     isRoot: true
        // }
    ]

    return (
        <Sidebar data={sidebarStatic} show={true}>
            {props.children}
        </Sidebar>
    )
}
