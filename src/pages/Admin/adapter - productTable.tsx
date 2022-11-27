import { Table } from '../../components';
import { TableValues, TableProps } from '../../components/Table/table-types';

type ProductTableProps<Values> = Omit<TableProps<Values>, "headers"> & {
    headers?: string[];
};

export function ProductTableAdapter<Values extends TableValues>(props: ProductTableProps<Values>) {
    function getKeysofObject(obj: Values[]){
        if(!obj.length) return [];

        const keys = props?.headers || Object.keys(obj.at(0) as object);
        return keys;
    }

    return (
        <div>
            <Table.TableTools 
                searchMatchesResult={[]}
                searchKey={getKeysofObject(props.data)}
                filterKeys={getKeysofObject(props.data)}
                data={props.data}
            >
                {({searchMatchesResult}) =>{
                    return (<>
                        <Table.Table 
                            {...props}
                            headers={props?.headers || getKeysofObject(props.data)}
                            data={searchMatchesResult}
                            perPageEntities={5}
                        ></Table.Table>
                    </>)
                }}
            </Table.TableTools>
        </div>
    )
}
