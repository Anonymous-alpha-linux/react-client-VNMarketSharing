import React, { HTMLProps } from 'react';
import { Form } from 'react-bootstrap';
import { TableToolContextType, 
  TableToolsProps, 
  TableToolsState } from './table-search-types';
import { HiOutlineFilter, HiOutlineSearch } from 'react-icons/hi';
import { VscFilePdf } from 'react-icons/vsc';
import { SiMicrosoftexcel } from 'react-icons/si';
import { FaTimes } from 'react-icons/fa';
import { Input } from '..';
import { getNestedObject } from '../../utils';
import { useDebouncedInput } from '../../hooks';

const TableToolContext = React.createContext<TableToolContextType<any>>({
  searchMatchesResult: []
});

export const TableTools = function<Values extends {[key: string]: any}>(props: TableToolsProps<Values>){
  const [state, setState] = React.useState<TableToolsState<Values>>({
    data: props.data,
    searchMatchesResult: props.data,
    showFilterPanel: !!props.showFilterPanel,
  });

  // Sync with props
  React.useEffect(() =>{  
    setState(o => ({
      ...o,
      data: props.data,
      searchMatchesResult: props.data
    }));
  },[props.data])

  function searchHandler(pattern: string) {
    setState(o => { 
      const matchRegExp = new RegExp(`(${pattern})+`, "i");
      let key = props.searchKey;

      if(!pattern) {
        return {
          ...o,
          searchMatchesResult: o.data
        }
      }

      function dataMatchObject(
        data: Values
      ): boolean{
        const keys = data ? Object.keys(data) : []; 

        return keys.some(k => dataMatch(data[k as keyof typeof data], k))
      }

      function dataMatch(
        data: number|string|boolean|Values|Values[],
        key: string
      )
      : boolean{
        if(
          typeof data === "string" || 
          typeof data === "number" || 
          typeof data === "boolean"){
            return !!data.toString().match(matchRegExp);
        }
        else if(Array.isArray(data)) {
          return data.some(i => {
            return dataMatch(i,key);
          });
        }
        return dataMatchObject(data);
      }

      const matches = o.data.map((curr) =>{
        if(typeof key === 'string' && (curr[key as keyof typeof curr] as string).match(matchRegExp)) 
        {
          return curr;
        }
        else if(
          Array.isArray(key) 
          && 
          dataMatchObject(curr)
        ){
          return curr;
        }
        return null;
      }).filter(r => r) as Values[]; 

      return {
        ...o,
        searchMatchesResult: matches
      }
    });
  }

  function toggleFilterPanel(){
    setState(o =>({
      ...o,
      showFilterPanel: !o.showFilterPanel
    }));
  }

  function offSuggestion(){
    setState(o=>({
      ...o,
      showSuggestion: false
    }))
  }

  return <section className="table-tools__root">
      <div className="table-tools__header">

        <div className="table-tools__searchBar">
          <TableFilter show={state.showFilterPanel}
            toggleFilterPanel={toggleFilterPanel}>
              <TableSearch searchResultHandler={(pattern: string) => {
                searchHandler(pattern);
              }}
              onBlur={offSuggestion}
              ></TableSearch>
          </TableFilter>
        </div>

        <div className="table-tools__exports">
          <span title='export pdf'>
            <VscFilePdf></VscFilePdf>
          </span>
          <span title='export excel'>
            <SiMicrosoftexcel></SiMicrosoftexcel>
          </span>
        </div>

        <div className="table-tools__panel">
          <TableFilterPanel data={state.data}
            getMatchResults={(matchResult) => {
              setState(o => ({
                ...o,
                searchMatchesResult: matchResult
              }));
            }}
            filterMatchResults={[]}
            show={state.showFilterPanel} 
            filterKeys={props.filterKeys}></TableFilterPanel>
        </div>
      </div>

      <div className="table-tools__context">
        <TableToolContext.Provider value={{
          searchMatchesResult: state.searchMatchesResult
        }}>
          {props.children
            ? typeof(props.children) === 'function'
              ? (props.children as (output: TableToolContextType<Values>) => React.ReactNode)(
                state
              )
              : !React.Children.count(props.children)
                ? React.Children.only(props.children)
                : null
            : null
          }
        </TableToolContext.Provider>
      </div>
    </section>
}

export function useTableToolContext<TSearch>(){
  const tableTools = React.useContext<TableToolContextType<TSearch>>(TableToolContext);
  return tableTools;
}


type TableSearchProps = {
  onChangeSearchInput?: (newString: string) => void;
  searchResultHandler?: (pattern: string) => void;
} & HTMLProps<HTMLInputElement>;

export function TableSearch(props: TableSearchProps) {
  const [searchString, changeSearchString] = useDebouncedInput<string>("",{
    debouncedCallback: props.searchResultHandler
  });
  const inputRef = React.useRef<HTMLInputElement>(null);
  
  function changeHandler(e: React.FormEvent<HTMLInputElement>){
    const targetValue: string = e.currentTarget.value;
    changeSearchString(targetValue);
    props.onChangeSearchInput && props.onChangeSearchInput(targetValue || " ");
    props.searchResultHandler && props.searchResultHandler(targetValue);
  }

  return (
    <span className='table-search__root'>
      <input type={"text"} 
        className="table-search__input" 
        ref={inputRef} 
        value={searchString}
        onChange={changeHandler} 
        onBlur={props.onBlur} 
        placeholder="Search..."
      ></input>
    </span>
  )
}


interface TableFilterProps {
  show ?: boolean;
  toggleFilterPanel: () => void;
  children?: React.ReactNode;
}

export function TableFilter(props: TableFilterProps){
    return (
      <>
        <span className='table-filter__root'>
          <i className='table-filter__icon' onClick={props.toggleFilterPanel}>
            {!props.show 
            ? (<HiOutlineFilter></HiOutlineFilter>)
            : (<FaTimes></FaTimes>)}
          </i>
          { props.children }
        </span>
      </>
    )
}

type TableFilterPanelProps<Values> = { 
  show?: boolean;
  filterKeys?: string | string[];
  data: Values[];
  onChangeHandler?: (props: TableFilterObject) => void;
  getMatchResults?: (finalResult: Values[]) => void;
} & TableFilterPanelStateShared<Values>;

type TableFilterPanelStateShared<Values> = {
  filterMatchResults: Values[];
}

type TableFilterPanelState<Values> = TableFilterPanelStateShared<Values> & {
  filterList: Map<string,TableFilterObject>;
}

function TableFilterPanel<Values extends {[key: string]: any}>(props:TableFilterPanelProps<Values>){
  const [state, setState] = React.useState<TableFilterPanelState<Values>>({
    filterMatchResults: props.data,
    filterList: new Map<string, TableFilterObject>()
  });
  const spanElement = React.useRef<HTMLElement>();
  
  React.useEffect(() => {
    setState(o => ({
      ...o,
      filterMatchResults: !props.filterMatchResults.length ? props.data : props.filterMatchResults
    }));
  },[props.data]);

  const filterListHandler = async (data: Values[], tableFilterList: TableFilterObject[]) => {
    if(tableFilterList.length){
      data = data.filter(item => {
        // filter steps
        return tableFilterList.every(filter =>{
          return filterHandler(item, filter);
        });
      });
    }

    props.getMatchResults && props.getMatchResults(data);

    setState(o => ({
      ...o,
      filterMatchResults: data
    }));  
  };

  function filterHandler(item: Values, tableFilerObj: TableFilterObject | OtherTableFilterObject) : boolean {
    if((typeof tableFilerObj.sortValue === "string"
        && tableFilerObj.objectType === "string") 
        || tableFilerObj.objectType === "boolean")
    {
      const str = getNestedObject(item, tableFilerObj.sortField) as string;
      const pattern = tableFilerObj.sortValue as string;
      return !!str && str.toString().toLowerCase().includes(pattern.toLowerCase());
    }
    if(tableFilerObj.objectType === "number" && Array.isArray(tableFilerObj.sortValue)){
      const min = tableFilerObj.sortValue[0];
      const max = tableFilerObj.sortValue[1];
      const ent = getNestedObject(item, tableFilerObj.sortField);

      if(typeof ent === "string" && ent.includes("-")) return ent.split(" - ").some(number => parseInt(number) > min || parseInt(number) < max);
      return ent >= min && ent <= max;
    }
    if(tableFilerObj.objectType === "array" && typeof tableFilerObj.sortValue === "string"){
      const arr = getNestedObject(item, tableFilerObj.sortField) as Array<string>;
      return arr.includes(tableFilerObj.sortValue as string);
    }
    if(tableFilerObj.objectType === "object" && !!tableFilerObj.otherFilter){
      return filterHandler(item, tableFilerObj.otherFilter as OtherTableFilterObject);
    }
    return false;
  }

  async function addFilter(newFilter: TableFilterObject){
    const tableFilterMap = state.filterList as Map<string, TableFilterObject>;
    if(!newFilter.sortValue) {
      await Promise.resolve(tableFilterMap.delete(newFilter.sortField)).then((isDeleted:boolean) =>{
        if(isDeleted){
          setState((o: TableFilterPanelState<Values>)=>{
            return {
              ...o,
              filterList: tableFilterMap
            }});
          }
        });
    }
    else {
      await Promise.resolve(state.filterList.set(newFilter.sortField, newFilter)).then(map=>{
        setState((o: TableFilterPanelState<Values>)=>{
          return {
          ...o,
          filterList: map
        }});
      });
    }
  }

  return  (
    <div className='table-filter__panel'
    aria-pressed={!!props.show}
    style={{
      height: spanElement.current?.offsetHeight
    }}>
      <div className="table-filter__panel--inner"
        ref={e => {
          if(e) spanElement.current = e;
        }} 
        style={{
          padding: "1.2rem 0",
        }}>
          {
          props.filterKeys
          ? typeof props.filterKeys === 'string'
            ? <span className="table-filter__panel--input">
                <label className="table-filter__panel--label">{props.filterKeys}</label>
                <TableFilterPanelInput 
                  filterKey={props.filterKeys}
                  typeOfData={typeof props.data[0]}
                  onChangeHandler={async (data) => await addFilter(data)}
                  data={props.data.map((obj) => {
                    return obj[props.filterKeys as keyof typeof obj];
                  })}
                ></TableFilterPanelInput>
              </span>

            : props.filterKeys.map((key,index) => {
                const data = props.data.map((cur) => cur[key as keyof typeof cur]);
  
                if(data.some(value => Array.isArray(value) && typeof value[0] === "object")) return null;
                return <span className="table-filter__panel--input" key={index}>
                  <label className='table-filter__panel--label'>{key}</label>
                  <TableFilterPanelInput filterKey={key}
                    onChangeHandler={async (data) => await addFilter(data)}
                    typeOfData={Array.isArray(data[0]) ? "array": typeof data[0]}
                    data={data}
                  ></TableFilterPanelInput>
                </span>
              })
          : null
          }
        <span style={{
          verticalAlign: "text-bottom",
          float: "right",
          // position: "absolute",
          padding: '0.6rem 1rem',
          display: 'inline-block',
          height: '50px',
          alignSelf:'end',
          backgroundColor: "var(--clr-logo)",
          color: '#fff',
          cursor: 'pointer',
          marginLeft: "auto",
          // right: 0,
          // top: 0,
          // bottom: 0
        }} onClick={() => {
          filterListHandler(Array.from(props.data),Array.from(state.filterList.values()));
        }}>
          <HiOutlineSearch></HiOutlineSearch>
        </span>
      </div>
    </div>
  )
}

interface TableFilterObject{
  objectType: string;
  sortValue?: string | number[] ;
  sortField: string;
  otherFilter?: OtherTableFilterObject
}

type OtherTableFilterObject = Omit<TableFilterObject, "sortField"> & {
  sortField: string[]
}

interface TableFilterPanelInputProps<Values>{
  filterKey: string;
  typeOfData: string;
  data: Values[];
  onChangeHandler: (props: TableFilterObject) => void;
}

function TableFilterPanelInput<Values extends any>(props: TableFilterPanelInputProps<Values>){
  
  if(props.typeOfData === "string"){
    return (
      <Form.Control 
        placeholder={"type your " + props.filterKey.toLowerCase()} 
        onChange={(e) => props.onChangeHandler({
          objectType: props.typeOfData,
          sortField: props.filterKey,
          sortValue: e.target.value
        })}
      >
      </Form.Control>
    );
  }

  if(props.typeOfData === "boolean"){
    return (
      <Form.Select 
        aria-label="Choose sort type" 
        onChange={(e) => props.onChangeHandler({
          objectType: props.typeOfData,
          sortField: props.filterKey,
          sortValue: e.target.value
        })}
      >
        <option value="" label={`select ${props.filterKey.toLowerCase()}`}></option>
        <option value="true" label='true'></option>
        <option value="false" label='false'></option>
      </Form.Select>
    );
  }

  if(props.typeOfData === "number"){
    return (
      <Input.MultiRangeSlider 
        min={0} 
        max={Math.max(...props.data.map(i => {
          if(typeof i === "string" && i.includes("-")){
            return parseInt(i.split(" - ")[1]);
          }
          return i as number;
        }))} 
        onChange={(min, max) =>{
          props.onChangeHandler({
            objectType: props.typeOfData,
            sortField: props.filterKey,
            sortValue: [min, max]
          })
      }}></Input.MultiRangeSlider>
    )
  }

  if(props.typeOfData === "array"){
    if(Array.isArray(props.data[0])){
      const arr = props.data as any[][];
      return <>
        <TableFilterPanelInput
          data={arr.flat()}
          filterKey={props.filterKey}
          onChangeHandler={props.onChangeHandler}
          typeOfData={props.typeOfData}
        ></TableFilterPanelInput>
      </>
    }
    if(typeof props.data[0] === "object" && "title" in (props.data[0] as {[key:string]: any})){
      // return (
      // <Form.Select 
      //   aria-label={`select ${props.filterKey}`} 
      //   onChange={(e) => props.onChangeHandler({
      //     objectType: props.typeOfData,
      //     sortField: props.filterKey,
      //     sortValue: e.target.value
      //   })}
      // >
      //   <option value={""} label={props.filterKey}></option>
      //   {
      //     props.data.map((item,index) => {
      //       const newItem = item["title" as keyof typeof item] || "";
      //       return (
      //       <option key={index} 
      //         value={newItem as string} 
      //         label={newItem as string}>
      //       </option>)
      //     })
      //   }
      // </Form.Select>)
      return null;
    }
    const arrayStr = props.data as Array<string>;
    const set = new Set<string>(arrayStr.flat());
  
    const data = Array.from(set) as Array<string>;
    return (
      <Form.Select 
        aria-label={`select ${props.filterKey}`} 
        onChange={(e) => props.onChangeHandler({
          objectType: props.typeOfData,
          sortField: props.filterKey,
          sortValue: e.target.value
        })}
      >
        <option value={""} label={props.filterKey}></option>
        {
          data.map((item,index) => {
            const newItem = item.toString();
            return (
            <option key={index} 
              value={newItem} 
              label={newItem}>
            </option>)
          })
        }
      </Form.Select>)
  }

  if(props.typeOfData === "object" && "title" in (props.data[0] as {[key: string]: Values})){
    const data = props.data[0] as {[key: string]: any};
    return (
      <TableFilterPanelInput filterKey={"title"}
        onChangeHandler={(newProps: TableFilterObject) => {
          props.onChangeHandler({
            objectType: props.typeOfData,
            sortField: props.filterKey,
            sortValue: props.filterKey,
            otherFilter: {
              ...newProps,
              sortField: [props.filterKey, newProps.sortField]
            }
          })}
        } 
        typeOfData={typeof data["title" as keyof typeof data]}
        data={props.data.map(i => {
          return (i as {[key:string]: any})["title"]
        })}
      ></TableFilterPanelInput>
    )
  }

  return null;
}
// interface TableSearchSuggestionProps{
//   data: {
//     title: string;
//     imageUrl?: string;
//     subtitle?: string;
//   }[];
//   show?: boolean;
// }
// function TableSearchSuggestion(props: TableSearchSuggestionProps){
//   const [height, setHeight] = React.useState<number>(0);
//   const listRef = React.useRef<HTMLLIElement[]>([]);
//   React.useEffect(() =>{
//     const elementHeight: number = listRef.current.reduce((prev, current) => {
//             return prev + current.offsetHeight;
//         },0);
//     setHeight(elementHeight);
//   },[listRef.current,props.show])

//   return <ul className='table-tools__suggestion'
//     style={{
//       height: height
//     }}
//     aria-haspopup={props.show}>
//     {props.data.map((s,index) => <li key={index} 
//     className="table-tools__suggestion--item"
//     ref={e =>{ if(e) listRef.current[index] = e}}>
//       <div>
//         {!!s.imageUrl && <img src={s.imageUrl} alt={s.title}></img>}
//         {s.title}
//       </div>
//       {!!s.subtitle && <i>{s.subtitle}</i>}
//     </li>)}
//   </ul>
// }

