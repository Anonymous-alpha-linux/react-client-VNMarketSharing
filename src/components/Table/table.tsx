import React from "react";
import { TiArrowUnsorted } from 'react-icons/ti';
import { HiOutlineEye, HiPencil,HiTrash } from 'react-icons/hi';
import { FaCheck, FaTimes } from 'react-icons/fa';

import "./table.css";
import { usePagination } from '../../hooks';
import Pagination from "./pagination";
import {
    CellDataComponentHandlerProps, 
    CellDataObjectProps, 
    FooterProps, 
    RowBodyProps, 
    RowDataProps, 
    RowListProps, 
    RowProps, 
    TableProps, 
    TableState, 
    TableValues
} from './table-types';
import { Badge } from "react-bootstrap";
import { TbLock, TbLockOpen } from "react-icons/tb";


export function Table<Values extends TableValues>({data,headers,...props}: TableProps<Values>) {
    const [state, setState] = React.useState<TableState<Values>>({
        data: data,
        sortedKey: "",
        currentPage: 1,
        perPageEntries: props.perPageEntities || 5
    });

    React.useEffect(() => {
        setState(o =>({
            ...o,
            data: data
        }));
    }, [data])

    const functions = {
        async sortByHeader(key: string){
            let action;
            if(state.sortedKey === key){
                action = Promise.resolve(state.data.reverse());
            }
            else{
                action = Promise.resolve(state.data.sort((a,b) => {
                    if(!!parseInt(a[key])) {
                        const number1 = parseInt(a[key]); 
                        const number2 = parseInt(b[key]);

                        return number1 > number2 ? 1 : number1 < number2 ? -1 : 0;
                    }
                    else if(typeof a[key] === "object" && "title" in a[key]){
                        const str1 = a[key]["title"].toString().toUpperCase();
                        const str2 = b[key]["title"].toString().toUpperCase();

                        return str1 > str2 ? 1 : str1 < str2 ? -1 : 0;
                    }
                    else if(typeof a[key] === 'string'){
                        return a[key] 
                    }
                    return 0;
                }))
            }
            await action.then(newData => {
                setState(o => {
                    return {
                        ...o,
                        data: newData,
                        sortedKey: key
                    }
                });
            });
        },
        getKeysOfObject(obj: Values[]): string[]{
            if(!obj.length) return [];

            const keys = Object.keys(obj[0]);
            return keys;
        },
        getValueListOfObject(obj: {[k: string]: any}[]):Values[][]{
            if(!obj.length) return [];
            return obj.map(item => Object.values(item).map(i => i));
        }
    }

    return (<>
        <table className="table__root">
            <RowHeader 
                data={headers || functions.getKeysOfObject(data)} 
                onClick={(key: string)=>{
                    functions.sortByHeader(key);
                }} 
                sortBy={props.sortBy}
                {...props}></RowHeader>
            <RowBodyList 
                data={functions.getValueListOfObject(state.data)
                    .slice(state.currentPage * state.perPageEntries, 
                    (state.currentPage + 1) * state.perPageEntries)}
                perPageAmount={state.perPageEntries}
                currentPage={state.currentPage}
                dataLength={data.length}
                {...props}></RowBodyList>
        </table>
        <Footer perPageAmount={state.perPageEntries}
            currentPage={state.currentPage}
            dataLength={data.length}
            onSelectPage={(page) => {
                setState(o => ({
                    ...o,
                    currentPage: page
                }));
            }}
            onSelectPerPage={(amount) => {
                setState(o =>({
                    ...o,
                    perPageEntries: amount
                }))
            }}
        ></Footer>
    </>
    )
}

function RowHeader({data,...props}: RowProps){
    return <thead>
        <tr>
            <th className="table__checkbox table__heading">
                <input type={"checkbox"}></input>
            </th>
            {data.map((header,index) => <th 
                onClick={() => props.onClick && props.onClick(header.toString() as string)}
                className="table__heading" 
                key={index + 1}>
                    <span className="table__heading--text">{header}</span>
                    <span className="table__icon"><TiArrowUnsorted></TiArrowUnsorted></span>
            </th>)}
            {props.hasAction && <th className="table__heading">Action</th>}
        </tr>
    </thead>
}

function RowBodyList({data,...props}: RowListProps){
    return <tbody>
        {
            data.map((row,index) => (
                <RowData key={index + 1} 
                    data={row}
                    rowNumber={props.currentPage && props.perPageAmount ? props.currentPage * props.perPageAmount + index : index}
                    {...props}
                ></RowData>
            ))
        }
    </tbody>
}

function RowData({data, ...props}: RowDataProps){
    return <tr className="table__data--row">
        <td className="table__checkbox">
            <input type={"checkbox"}></input>
        </td>

        {data.map((str,index) => {
            const isNumber = typeof str === "number" || typeof str === "string" && str.includes(" - ") && str.split(" - ").every(char => parseInt(char));
            return <td className="table__data" key={index + 1}
            style={{
                whiteSpace: isNumber ? "nowrap" : "break-spaces",
                color: isNumber ? "var(--clr-green-light)" : "initial",
            }}>
                <CellDataComponentHandler data={str}></CellDataComponentHandler>
            </td>
        })}
        {props.hasAction && <td className="table__data">
            {props.onAccept && <span className="table__data--action" 
                onClick={() => props?.onAccept?.(props.rowNumber)}
                aria-controls="accept" 
                >
                    <FaCheck></FaCheck>
                </span>
            }
            {props.onDeny && <span className="table__data--action" 
                aria-controls="deny" 
                onClick={() => props?.onDeny?.(props.rowNumber)}>
                    <FaTimes></FaTimes>
                </span>
            }
            {props.onRead && <span className="table__data--action" 
                aria-controls="read" 
                onClick={() => props?.onRead?.(props.rowNumber)}>
                    <HiOutlineEye></HiOutlineEye>
                </span>
            }
            {props.onUpdate && <span 
                className="table__data--action" 
                aria-controls="edit"
                onClick={() => props?.onUpdate?.(props.rowNumber)}>
                    <HiPencil></HiPencil>
                </span>}
            {props.onDelete && <span 
                className="table__data--action" 
                aria-controls="delete"
                onClick={() => props?.onDelete?.(props.rowNumber)}>
                    <HiTrash></HiTrash>
                </span>
            }
            {props.onUnlocked && <span 
            className="table__data--action" 
            aria-controls="unlocked"
            onClick={() => props?.onUnlocked?.(props.rowNumber)}>
                <TbLockOpen></TbLockOpen>
            </span>}
            {props.onBlocked && <span 
                className="table__data--action" 
                aria-controls="blocked"
                onClick={() => props?.onBlocked?.(props.rowNumber)}>
                    <TbLock></TbLock>
                </span>}
        </td>}
    </tr>
}

function CellDataComponentHandler(props: CellDataComponentHandlerProps){
    const {data} = props;

    if(
        typeof data === "string" ||
        typeof data === "number" ||
        typeof data === 'boolean'||
        !data
    ){
        return <span className="table__cell--content">
            {typeof data === "boolean" &&  data.toString() || data}
        </span>
    }

    if(Array.isArray(data)){
        return(
            <span className="table__cell--content">
                <ul className="table__cell">
                    {data.map((i, idx) => <li key={idx} className="table__cell--li" style={{listStyleType: 'circle'}}>
                        <CellDataComponentHandler data={i}></CellDataComponentHandler>
                    </li>)}
                </ul>
            </span>
        ) 
    }

    if(data && "status" in data && "title" in data){
        return <span className="table__cell--content">
            <Badge bg={data.status}>
                {data.title}
            </Badge>
        </span>
    }

    if(data && ("title" in data || "image" in data || "subtitle" in data)){
        return <span className="table__cell table__cell--content">
            <span className="table__cell--flex">
                {data?.["image"] && <img className="table__cell--image" 
                src={data?.image || "https://logopond.com/logos/8eaaac3a2fe79ea70f852b5c332c7efb.png"} 
                alt={data?.title + ' image'}></img>}
                {!!(data?.title || data?.subtitle) && <span className="table__cell--title">
                    {data?.title}
                    {data?.subtitle && <div>
                        <i className="table__cell--subtitle">{data?.subtitle}</i>
                    </div>}
                </span>}
            </span>
        </span>
    }

    return <CellDataObject data={data}></CellDataObject>
} 

function CellDataObject(props: CellDataObjectProps) {
    const entries = Object.entries(props.data);

    return <ul> 
        {entries.map((col,indx) => 
            <li key={indx}>
                {`${col[0]}: `}
                <CellDataComponentHandler data={col[1]}></CellDataComponentHandler> 
            </li>
        )}
    </ul>
}

function Footer(props: FooterProps){
    const { currentPage, perPageAmount, total, setCurrenPage, ...state } = usePagination({
        dataLength: props.dataLength,
        perPageAmount: props.perPageAmount || 10
    });

    const from = (currentPage * perPageAmount) + 1;
    const to = from + perPageAmount - 1;

    React.useEffect(() =>{
        setCurrenPage(0);
        props.onSelectPage(0);
    },[state.dataLength]);

    return (
        <>
            <div className="table__footer">
                <div className="table__footer--entries">
                    <span>Show per page: </span>
                    <span>
                        <select onChange={e => {
                            props.onSelectPerPage(parseInt(e.target.value));
                            state.setPerPageAmount(parseInt(e.target.value));
                        }}>
                            <option value="5">05</option>
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                    </span>
                </div>
                <div>
                    <span>
                        {`${from.toString()} 
                        - ${to > state.dataLength ? state.dataLength.toString() : to.toString()} 
                        of ${props.dataLength} items   `}
                    </span>
                    <Pagination
                        perPageAmount={perPageAmount}
                        total={total}
                        selectCurrentPage={(page) =>{
                            setCurrenPage(page);
                            props.onSelectPage(page);
                        }}
                        activePage={currentPage}
                    ></Pagination>
                </div>
            </div>
        </>
    )
}