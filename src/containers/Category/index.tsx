import { Table } from '../../components';
import { TableValues } from '../../components/Table/table-types';
interface CategoryTableState<Values> {
  data: Values[];
}
type CategoryTableProps<Values> = CategoryTableState<Values> & {
  headers?: string[];
  filterKeys: string[];
  onRead: (index: number) => void;
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
};

export function CategoryTable<Values extends TableValues>(props: CategoryTableProps<Values>) {
    function getKeysofObject(obj: Values[]){
        if(!obj.length) return [];

        const keys = props?.headers || Object.keys(obj.at(0) as object);
        return keys;
    }

    return (
        <div style={{width: '100%'}}>
            <Table.TableTools 
                searchMatchesResult={[]}
                searchKey={getKeysofObject(props.data)}
                filterKeys={props.filterKeys || getKeysofObject(props.data)}
                data={props.data}
            >
                {({searchMatchesResult}) =>{
                return <>
                    <Table.Table 
                        hasAction
                        headers={props?.headers || getKeysofObject(props.data)}
                        data={searchMatchesResult}
                        perPageEntities={5}
                        onRead={(rowNumber) => props.onRead(rowNumber)}
                        onUpdate={(rowNumber) => props.onEdit(rowNumber)}
                        onDelete={(rowNumber) => props.onDelete(rowNumber)}
                    ></Table.Table>
                </>
                }}
            </Table.TableTools>
        </div>
    )
}
