import React from 'react';
import { Table } from '../../components';
import { RowHandlers, TableValues } from '../../components/Table/table-types';
interface ProductTableState<Values> {
  data: Values[];
}
type ProductTableProps<Values> = ProductTableState<Values> & {
  headers: string[];
} & RowHandlers;

export function ProductTable<Values extends TableValues>(props: ProductTableProps<Values>) {
  const {data,headers} = props;
  function getKeysofObject(obj: Values[]){
    if(!obj.length) return [];

    const keys = !!obj.at(0) ? Object.keys(obj.at(0) as object) : props.headers;
    return keys;
  }

  return (
    <div>
        <Table.TableTools 
          searchMatchesResult={[]}
          searchKey={props.headers || getKeysofObject(props.data)}
          filterKeys={getKeysofObject(props.data)}
          data={props.data}
          >
            {({searchMatchesResult}) =>{
              return <>
                <Table.Table 
                  {...props}
                  hasAction
                  headers={getKeysofObject(props.data)}
                  data={searchMatchesResult}
                  perPageEntities={5}
                ></Table.Table>
              </>
            }}
        </Table.TableTools>
    </div>
  )
}
