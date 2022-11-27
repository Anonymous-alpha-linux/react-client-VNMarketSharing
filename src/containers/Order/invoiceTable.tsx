import React from 'react'
import { Table } from '../../components';
import { TableValues, CellDataValues } from '../../components/Table/table-types'
import { getKeysofObject } from '../../utils';

interface InvoiceTableState<Values> {
  data: (Values & CellDataValues)[];
}

type InvoiceTableProps<Values extends TableValues> = InvoiceTableState<Values> & {
  headers?: string[];
} & InvoiceTableHandlers<Values>;

interface InvoiceTableHandlers<Values> {
    onRead: (item: Values) => void;
}

export function InvoiceTable<Values extends TableValues>(props:InvoiceTableProps<Values>) {
    return (
        <section>
            <h3>Invoice List</h3>
            <Table.TableTools
                searchMatchesResult={[]}
                searchKey={props.headers || getKeysofObject(props.data)}
                filterKeys={getKeysofObject(props.data)}
                data={props.data}
            >
                {({searchMatchesResult}) =>{
                return <Table.Table 
                    hasAction
                    headers={getKeysofObject(props.data)}
                    data={searchMatchesResult}
                    perPageEntities={5}
                    onRead={(rowNumber) =>{
                        props.onRead(searchMatchesResult[rowNumber]);
                    }}
                ></Table.Table>
                }}
            </Table.TableTools>
    </section>
    )
}