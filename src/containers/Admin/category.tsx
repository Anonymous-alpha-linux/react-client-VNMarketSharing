import { AxiosError, AxiosResponse } from 'axios';
import { Formik, FormikHelpers } from 'formik';
import React from 'react'
import {Spinner, Table, Button, Form, Stack} from 'react-bootstrap';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { categoryAPIInstance } from '../../config';
import { useTypedSelector,axiosErrorHandler } from '../../hooks';
import {NodeValue, Tree as TreeView} from '../../components';

enum FormStatus {
    CREATE,
    EDIT,
    DELETE,
    NONE
}
interface CategoryData {
    id: string,
    name:string,
    level: number,
    subCategoryCount: number; 
    hasOpened: boolean;
    subCategories?: CategoryData[];
}
interface CategoryState {
    data: CategoryData[],
    keyTables: string[],
    loading: boolean,
    error: string,
    page: number,
    take: number,
    hasChanges?: FormStatus
}
export const Category = () => {
    const {data: {isAuthorized}} = useTypedSelector(state => state.auth);
    const [state, setState] = React.useState<CategoryState>({
        loading: false,
        error: '',
        data: [],
        keyTables: ["id", "name", "level","subcategory", "action"],
        page: 1,
        take: 5,
        hasChanges: FormStatus.NONE
    });

    React.useEffect(() =>{
        if(!state.data.length){
            getItem();
        }
    },[isAuthorized]);

    function getItem(){
        setState(o =>({
            ...o,
            error: '',
            loading: true,
        }));
        categoryAPIInstance.getCategories({page: state.page, take: state.take}).then(({data}) =>{
            setState(o =>({
                ...o,
                data: data,
                loading: false,
                error: '',
                page: o.page + 1,
            }));
        }).catch((error: Error | AxiosError | any) =>{
            let errorResponse = "Failed";
            if(error instanceof AxiosError){
                errorResponse = error.response?.data || errorResponse;
            };
            setState(o =>({
                ...o,
                data: o.data,
                loading: false,
                error: errorResponse,
            }));
        })
    }
    function updateItem(newRecord: CategoryData, type: FormStatus, rootId?: string){
        if(state.data){
            if(type === FormStatus.CREATE && rootId){
                setState(o => ({
                        ...o,
                        data: o.data.map(r => (r.id === rootId) ? {...r,subCategoryCount: r.subCategoryCount + 1} : r)
                    }),
                );
            }
            else if(type === FormStatus.CREATE){
                setState(o => ({
                    ...o,
                    data: [...o.data, newRecord]
                }));
            }
            else if(type === FormStatus.EDIT){
                setState(o=>({
                    ...o,
                    data: o.data.map(oldRecord => (oldRecord.id === newRecord.id)? newRecord : oldRecord)
                }));
            }
            else if(type === FormStatus.DELETE){
                setState(o => ({
                    ...o,
                    data: o.data.filter(d => d.id !== newRecord.id)
                }));
            }
        }
    }
    function replaceStateData(oldCategoryDataLst: CategoryData[],updatedCategoryData:CategoryData): CategoryData[]{
        return oldCategoryDataLst.map(oldCategoryData =>{
            if(updatedCategoryData.id === oldCategoryData.id){
                return {...oldCategoryData, 
                    hasOpened: updatedCategoryData.hasOpened,
                    level: updatedCategoryData.level,
                    name: updatedCategoryData.name,
                    subCategories: updatedCategoryData.subCategories,
                    subCategoryCount: updatedCategoryData.subCategoryCount
                };
            }
            else if(oldCategoryData.subCategories){
                const newSubCategories = replaceStateData(oldCategoryData.subCategories, updatedCategoryData);
                return {
                    ...oldCategoryData,
                    subCategories: newSubCategories
                };
            }
            return oldCategoryData;
        });
    }
    function hasNewChanges(){
        setState(o =>({
            ...o,
            hasChanges: FormStatus.CREATE
        }));
    }
    function hasClosedChanges(){
        setState(o =>({
            ...o,
            hasChanges: FormStatus.NONE
        }))
    }
    function transformStatetoTreeViewInput(source: CategoryData[], setCurrentIcon?: () => React.ReactNode): NodeValue[]{
        return source.map(category=>{
            return {
                key: category.id,
                label: category.name,
                level: category.level,
                icon: !!setCurrentIcon ? setCurrentIcon() : <span>{'Icon - '}</span>,
                childrenAmount: category.subCategoryCount,
                childrenCurrent: category.subCategories ? category.subCategories.length : 0,
                hasOpened: category.hasOpened,
                subNodes: !!category.subCategories ? transformStatetoTreeViewInput(category.subCategories, setCurrentIcon) : []
            }
        })
    } 
    function transformTreeViewInputtoState(source: NodeValue[]): CategoryData[]{
        return source.map(n=>{
            return {
                id: n.key,
                name: n.label,
                level: n.level,
                hasOpened: n.hasOpened,
                subCategoryCount: n.childrenAmount,
                subCategories: n.subNodes ? transformTreeViewInputtoState(n.subNodes) : [],
            }
        })
    }
    function mergeTwoObjectsWithUnique(entryArray: any[], dataArray: any[], key: string): CategoryData[]{
        return entryArray.reduce((prev, cur) => {
            const hasNoDuplicated = dataArray.every(item => {
                if(item[key] === cur[key]){
                    prev = [...prev, item];
                    return false;
                }
                return true;
            });
        
            if(hasNoDuplicated){
                prev = [...prev, cur];
            }
            return prev;
        },[]);
    }
    return (<Stack direction='vertical' gap={1} className="align-items-start">
        <TreeView data={transformStatetoTreeViewInput(state.data)}
            setCurrentNode={async (currentNode) => {
                function getSubItem(parentId: string) : Promise<CategoryData[]> {
                    // setState(o =>({
                    //     ...o,
                    //     error: '',
                    //     loading: true,
                    // }));
                    return new Promise<CategoryData[]>((resolve) => categoryAPIInstance.getCategories({
                        parentId: parseInt(parentId), 
                        level: currentNode.level + 1,
                        page: Math.floor(currentNode.childrenCurrent / state.take) || 1,
                        take: state.take
                    }).then(({data}:{data: CategoryData[]}) =>{
                        // const updatedCategoryData:CategoryData = {
                        //         id: currentNode.key,
                        //         name: currentNode.label,
                        //         level: currentNode.level,
                        //         hasOpened: currentNode.hasOpened,
                        //         subCategories: data,
                        //         subCategoryCount: currentNode.childrenAmount
                        // }
                        // setState(o =>{
                        //     const newData:CategoryData[] = replaceStateData(state.data, updatedCategoryData);
                        //     return ({
                        //     ...o,
                        //     loading: false,
                        //     error: '',
                        //     data: newData
                        //     });
                        // });
                        resolve(data);
                    }).catch((error: Error | AxiosError | any) =>{
                        let errorResponse = "Failed";
                        if(error instanceof AxiosError){
                            errorResponse = error.response?.data || errorResponse;
                        };
                        toast(errorResponse);
                        // setState(o =>({
                        //     ...o,
                        //     data: o.data,
                        //     loading: false,
                        //     error: errorResponse,
                        // }));
                    }));
                }
                const newList = await getSubItem(currentNode.key);
                return transformStatetoTreeViewInput(newList);
            }}>
        </TreeView>
        <Table responsive='lg'>
            <thead>
                <tr>
                    {state.keyTables.map((key,index) =>{
                        return <th key={index + 1}>{key}</th>
                    })}
                </tr>
            </thead>

            <tbody>
                {!state.loading && state?.data && state.data.map((record,index) =>{
                    return  <CategoryTableRow key={index + 1}    
                        setRecord={(newRecord,type,rootId) => !rootId ? updateItem(newRecord,type): updateItem(newRecord,type, rootId)}
                        record={record}>
                    </CategoryTableRow>
                })}

                {state.loading && <tr>
                    <td colSpan={4}>
                        <Spinner animation='border'></Spinner>
                    </td>
                </tr>}

                {state.hasChanges !== FormStatus.NONE && <tr>
                        <Formik initialValues={{name: ''}} 
                            validationSchema={yup.object().shape({
                                name: yup.string().required('*Required'),
                            })}
                            onSubmit={(values: {name: string}, formHelpers:FormikHelpers<{name: string}>) =>{
                                axiosErrorHandler(() =>{
                                    categoryAPIInstance.postNewCategory(values).then((response) =>{
                                        updateItem(response.data,FormStatus.CREATE);
                                    });
                                },
                                errorMsg =>{
                                    toast(errorMsg);
                                });

                                formHelpers.setSubmitting(false);
                                formHelpers.setErrors({});
                                formHelpers.setTouched({});
                                formHelpers.setValues({name: ''});
                        }}>
                            {(props) =>{
                                return (<>
                                    <td></td>

                                    <td>
                                        <Form onSubmit={props.handleSubmit}>
                                            <Form.Control value={props.values.name} 
                                            isInvalid={props.touched.name && !!props.errors.name}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            name="name"></Form.Control>
                                            <Form.Control.Feedback type="invalid">{props.errors.name}</Form.Control.Feedback>
                                        </Form>                                    
                                    </td>

                                    <td>0</td>

                                    <td>
                                        <Button variant="success" onClick={() => props.handleSubmit()}>+</Button>
                                        <Button variant="danger" onClick={hasClosedChanges}>-</Button>
                                    </td>
                                </>
                            )}}
                        </Formik>
                </tr>}

                <tr>
                    <td colSpan={5}>
                        <Button variant="primary" onClick={hasNewChanges}>+</Button>
                    </td>
                </tr>           
            </tbody>
        </Table>
    </Stack>
    )
}


type CategoryTableRowProps = {
    record: CategoryData,
    setRecord?: (newRecord: CategoryData,type: FormStatus,rootId?: string) => void,
    children?: React.ReactNode,
    handleResult?: (props: CategoryTableRowResultProps) => React.ReactNode,
    handleCreate?: (props: CategoryData) => any;
    handleUpdate?: (props: CategoryData) => any;
    handleDelete?: (id: string) => void;
    handleBlur?: () => void;
}
interface CategoryTableRowResultProps {
    values?: CategoryData[],
}
const CategoryTableRow = React.memo(({record,setRecord,handleBlur}:CategoryTableRowProps) => {
    const [state, setState] = React.useState<Partial<CategoryState>>({
        loading: false,
        error: '',
        data: record.subCategories || [],
        hasChanges: FormStatus.NONE,
        page: 1,
        take: 5
    });

    function getSubItem(parentId: string){
        setState(o =>({
            ...o,
            error: '',
            loading: true,
        }));
        categoryAPIInstance.getCategories({parentId: parseInt(parentId), 
            level: record.level + 1,
            page: state.page,
            take: state.take,
        }).then(({data}) =>{
            setState(o =>({
                ...o,
                data: !!o.data ? [...o.data,...data] : data,
                loading: false,
                error: '',
                page: o.page && o.page + 1
            }));
        }).catch((error: Error | AxiosError | any) =>{
            let errorResponse = "Failed";
            if(error instanceof AxiosError){
                errorResponse = error.response?.data || errorResponse;
            };
            setState(o =>({
                ...o,
                data: o.data,
                loading: false,
                error: errorResponse,
            }));
        })
    }
    function updateItem(newRecord: CategoryData, type: FormStatus, rootId?:string){
        if(state.data){
            if(type === FormStatus.CREATE && rootId){
                setState(o => ({
                        ...o,
                        data: !!o.data ? o.data.map(r =>(r.id === rootId) ? {...r,subCategoryCount: r.subCategoryCount + 1} : r) : o.data
                    })
                );
            }
            else if(type===FormStatus.CREATE){
                setState(o => ({
                    ...o,
                    data: !!o.data? [...o.data, newRecord]:[newRecord]
                }));
            }
            else if(type === FormStatus.EDIT){
                setState(o=>({
                    ...o,
                    data: !!o.data ? o.data?.map(oldRecord => (oldRecord.id === newRecord.id)? newRecord : oldRecord): []
                }));
            }
            else if(type === FormStatus.DELETE){
                setState(o => ({
                    ...o,
                    data: !!o.data ? o.data.filter(d => d.id !== newRecord.id):o.data
                }))
            }
        }
    }
    function deleteItem(recordId: string){
        categoryAPIInstance.deleteSingleCategory(recordId).then(response =>{
            toast("Deleted item");
            setRecord && setRecord(record, FormStatus.DELETE);
            hasClosedChanges();
        }).catch((err: Error | AxiosError | any)=>{
            let errorResponse = "Delete failed";
            if(err instanceof AxiosError) {
                errorResponse = err.response?.data as string || errorResponse;
            } 
            toast(errorResponse);
        });
    }
    function hasNewChanges(){
        setState(o =>({
            ...o,
            hasChanges: FormStatus.CREATE
        }));
    }
    function hasChanges(){
        setState(o =>({
            ...o,
            hasChanges: FormStatus.EDIT
        }));
    }
    function hasClosedChanges(){
        setState(o =>({
            ...o,
            hasChanges: FormStatus.NONE
        }))
    }
    

    return <>
        <Formik initialValues={{name: '', parentCategoryId: record.id}} 
            validationSchema={yup.object().shape({
                name: yup.string().required('*Required'),
                parentCategoryId: yup.string().nullable()
            })}
            onSubmit={(values: {name: string, parentCategoryId: string}, formHelpers:FormikHelpers<{name: string,parentCategoryId: string}>) =>{
                if(state.hasChanges === FormStatus.CREATE){
                    axiosErrorHandler(() =>{
                        categoryAPIInstance.postNewCategory(values)
                        .then((response) => {
                            const {data}: AxiosResponse = response;
                            return categoryAPIInstance.getSingleCategory(data.id)
                        })
                        .then((response) =>{
                            updateItem(response.data, FormStatus.CREATE);
                            setRecord && setRecord(response.data, FormStatus.CREATE, record.id);
                        });
                    },
                    errorMsg =>{
                        toast(errorMsg);
                    });
                }
                else if(state.hasChanges === FormStatus.EDIT){
                    axiosErrorHandler(
                        () =>{
                            categoryAPIInstance.updateSingleCategory(record.id,values).then(({data}) =>{
                                return data && setRecord && setRecord(data,FormStatus.EDIT);
                            });
                        },
                        errorMsg =>{
                        toast(errorMsg);
                    })
                }

                formHelpers.setSubmitting(false);
                formHelpers.setErrors({});
                formHelpers.setTouched({});
                formHelpers.setValues({name: '', parentCategoryId:''});
        }}>
            {(props) =>{
                return (<>
                    {/* Show record information  */}
                    <tr>
                        <td>#C{record.id}</td>
                        <td>{record.name}</td>
                        <td>{record.level}</td>
                        <td>{record.subCategoryCount}</td>
                        <td>
                            {/* {!!record.subCategoryCount && <Button onClick={() => getSubItem(record.id)}>Expand</Button>} */}
                            <Button variant='success' onClick={hasNewChanges}>Add SubCategory</Button>
                            <Button variant='warning' onClick={() => {
                                hasChanges();
                                props.setFieldValue("name", record.name);
                                props.setFieldValue("parentCategoryId", record.id);
                            }}>Update SubCategory</Button>
                            <Button variant="danger" onClick={() => deleteItem(record.id)}>Delete Item</Button>
                        </td>
                    </tr>

                    {/* Add or Edit record */}
                    {state.hasChanges !== FormStatus.NONE && <tr>
                        <td></td>

                        <td>
                            <Form onSubmit={props.handleSubmit} onBlur={() =>{
                                handleBlur && handleBlur();
                                hasClosedChanges();
                            }}>
                                <Form.Control value={props.values.name} 
                                isInvalid={props.touched.name && !!props.errors.name}
                                onChange={props.handleChange}
                                autoFocus
                                onBlur={props.handleBlur}
                                name="name"></Form.Control>
                                <Form.Control.Feedback type="invalid">{props.errors.name}</Form.Control.Feedback>
                            </Form>                                    
                        </td>

                        <td>{state.hasChanges === FormStatus.CREATE? record.level + 1: record.level}</td>

                        <td>
                            <Button variant="success" onClick={() => props.handleSubmit()}>+</Button>
                            <Button variant="danger" onClick={() =>{    
                                hasClosedChanges();
                            }}>x</Button>
                        </td>
                    </tr>}
                </>
                )}
            }
        </Formik>

        {/* Loading waiter */}
        {state.loading && <tr>
            <td colSpan={4}>
                <Spinner animation="border"></Spinner>
            </td>
        </tr>}

        {/* Expanding subitems */}
        {!!state.data?.length && state.data?.map((sub,index) => <CategoryTableRow key={index + 1} 
        setRecord={(newRecord,type,recordId)=> updateItem(newRecord,type,recordId)} 
        record={sub}></CategoryTableRow>)}
    
        {/* Load more signature */}
        {(!!state.data && state.data?.length < record.subCategoryCount) && <tr>
            <td colSpan={4}>
                <Button variant="success" onClick={() => getSubItem(record.id)}>+</Button>
            </td>
        </tr>}
    </>
})