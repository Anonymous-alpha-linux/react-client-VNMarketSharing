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
    RowListProps, 
    RowProps, 
    TableProps, 
    TableState, 
    TableValues
} from './table-types';


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

    async function sortByHeader(key: string){
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
    }

    function getKeysOfObject(obj: Values[]): string[]{
        if(!obj.length) return [];

        const keys = Object.keys(obj[0]);
        return keys;
    }

    function getValueListOfObject(obj: {[k: string]: any}[]):Values[][]{
        if(!obj.length) return [];
        return obj.map(item => Object.values(item).map(i => i));
    }

    return (<>
        <table className="table__root">
            <RowHeader data={headers || getKeysOfObject(data)} onClick={(key: string)=>{
                sortByHeader(key);
            }} {...props}></RowHeader>
            <RowBodyList data={getValueListOfObject(state.data).slice((state.currentPage - 1) * state.perPageEntries, state.currentPage * state.perPageEntries)} {...props}></RowBodyList>
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

function RowBodyList({data,...props}:RowListProps){
    return <tbody>
        {
            data.map((row,index) => (
                <RowData key={index + 1} 
                    data={row}
                    {...props}
                ></RowData>
            ))
        }
    </tbody>
}

function RowData({data, ...props}: RowProps){
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

        <td className="table__data">
            {props.onAccept && <span className="table__data--action" 
            aria-controls="accept" >
                    <FaCheck></FaCheck>
                </span>
            }
            {props.onDeny && <span className="table__data--action" 
                aria-controls="deny">
                    <FaTimes></FaTimes>
                </span>
            }
            {props.onRead && <span className="table__data--action" aria-controls="read">
                    <HiOutlineEye></HiOutlineEye>
                </span>
            }
            {props.onUpdate && <span className="table__data--action" aria-controls="edit">
                    <HiPencil></HiPencil>
                </span>}
            {props.onDelete && <span className="table__data--action" aria-controls="delete">
                    <HiTrash></HiTrash>
                </span>
            }
        </td>
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
        return <span>
            {typeof data === "boolean" &&  data.toString() || data}
        </span>
    }

    if(Array.isArray(data)){
        return <ul className="table__cell">
            {data.map((i, idx) => <li key={idx} className="table__cell--li" style={{listStyleType: 'circle'}}>
                <CellDataComponentHandler data={i}></CellDataComponentHandler>
            </li>)}
        </ul>
    }

    if(data && "title" in data){
        return <span className="table__cell">
            <span className="table__cell--flex">
                {data.image !== undefined && <img className="table__cell--image" 
                src={data.image || "https://logopond.com/logos/8eaaac3a2fe79ea70f852b5c332c7efb.png"} 
                alt={data.title + 'image'}></img>}
                <span className="table__cell--title">
                    {data.title}
                    <div>
                        <i className="table__cell--subtitle">{data.subtitle}</i>
                    </div>
                </span>
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

    const from = ((currentPage - 1) * perPageAmount) + 1;
    const to = from + perPageAmount - 1;

    React.useEffect(() =>{
        setCurrenPage(1);
        props.onSelectPage(1);
    },[props.dataLength]);

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
                    ></Pagination>
                </div>
            </div>
        </>
    )
}