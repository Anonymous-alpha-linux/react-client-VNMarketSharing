import React from 'react'
import { useNavigate } from 'react-router-dom';
import { Table } from '../../components';
import { TableValues } from '../../components/Table/table-types'
import { getKeysofObject } from '../../utils';

interface OrderTableState<Values> {
  data: (Values)[];
}

type OrderTableProps<Values> = OrderTableState<Values> & {
  headers?: string[];
  onRead: (item: Values) => void;
  onAccept: (item: Values) => void;
  onDeny: (item: Values) => void;
}

export function OrderTable<Values extends TableValues>(props: OrderTableProps<Values>) {
  return (
    <section>
      <h2>Order List</h2>
      <Table.TableTools
        searchMatchesResult={[]}
        searchKey={props.headers || getKeysofObject(props.data)}
        filterKeys={getKeysofObject(props.data)}
        data={props.data}
      >
        {({searchMatchesResult}) =>{
          return <Table.Table hasAction
            headers={getKeysofObject(props.data)}
            data={searchMatchesResult}
            perPageEntities={5}
            onRead={(rowNumber) => {
              props.onRead(searchMatchesResult[rowNumber]);
            }}
            onAccept={rowNumber => {
              props.onAccept(searchMatchesResult[rowNumber]);
            }}
            onDeny={rowNumber => {
              props.onDeny(searchMatchesResult[rowNumber]);
            }}
          ></Table.Table>
        }}
      </Table.TableTools>
    </section>
  )
}
