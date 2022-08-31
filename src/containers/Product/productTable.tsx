import React from 'react';
import {Table} from '../../components';

interface ProductTableState<Values> {
  data: Values[];
}
type ProductTableProps<Values> = ProductTableState<Values> & {
  headers: string[];
};

export function ProductTable<Values>(props: ProductTableProps<Values>) {
  

  function getKeysofObject(obj: Values[]){
    if(!obj.length) return [];

    const keys = Object.keys(obj[0]);
    return keys;
  }

  return (
    <div>
        <Table.TableTools 
          searchMatchesResult={[]}
          searchKey={props.headers || getKeysofObject(props.data)}
          filterKeys={getKeysofObject(props.data)}
          data={props.data}>
            {({searchMatchesResult}) =>{
              return <>
                <Table.Table 
                  hasAction
                  headers={getKeysofObject(props.data)}
                  data={searchMatchesResult}
                  perPageEntities={5}
                  onRead={() => {}}
                  onUpdate={() => {}}
                  onDelete={() => {}}
                ></Table.Table>
              </>
            }}
        </Table.TableTools>
    </div>
  )
}
