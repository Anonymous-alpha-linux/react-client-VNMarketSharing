import { AxiosError } from 'axios';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import React from 'react'
import { Button, Form, Stack, Modal, Row, Col, Spinner, ButtonGroup, ToggleButton, ToggleButtonGroup} from 'react-bootstrap';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { AiFillMinusCircle, AiFillPlusCircle, AiOutlinePlus } from 'react-icons/ai';
import { categoryAPIInstance } from '../../config';
import { useActions, useTypedSelector } from '../../hooks';
import { NodeValue, Tree as TreeView } from '../../components';
import { Category } from '../../containers';
import './index.css';
import { BiTable } from 'react-icons/bi';
import { MdAccountTree } from 'react-icons/md';

export const CategoryPage = () => {
    const {data: {isAuthorized}} = useTypedSelector(state => state.auth);
    const [state, setState] = React.useState<CategoryState>({
        loading: false,
        error: '',
        data: [],
        displayedData: [],
        keyTables: ["id", "name", "level","subcategory", "action"],
        page: 1,
        take: 5,
        hasChanges: FormStatus.NONE,
        displayedModal: false,
        editIndex: 0,
        mode: 'table'
    });
    const navigatedFormStates = React.useRef<any>();

    const submitButtonRef= React.useRef<HTMLButtonElement>(null);

    const functions = {
        load(loading: boolean){
            setState(o =>({
                ...o,
                error: '',
                loading: loading,
            }));
        },
        displayModal(display: boolean){
            setState(o => ({
                ...o,
                displayedModal: display
            }));
        },
        changeFormStatus(status: FormStatus, states?: any){
            navigatedFormStates.current = states;
            setState(o =>({
                ...o,
                hasChanges: status
            }));
        },
        changeView(mode: 'table' | 'treeview'){
            setState(o =>({
                ...o,
                mode: mode
            }));
        },
        getItem(){
            this.load(true);
            categoryAPIInstance.getAllCategories().then(({data}) =>{
                if(Array.isArray(data)){
                    setState(o =>({
                        ...o,
                        data: data,
                        loading: false,
                        error: '',
                        page: o.page + 1,
                    }));
                }
            }).catch(error =>{
                let msg;
                if(error instanceof AxiosError){
                    msg = error.response?.data || "Failed";
                    toast.error(msg);
                }
            });
        },
        updateItem(newRecord?: CategoryData, type?: FormStatus, rootId?: string){
            if(state.data && newRecord && type){
                if(type === FormStatus.CREATE && rootId){
                    setState(o => ({
                            ...o,
                            data: o.data.map(r => (r.id === rootId) ? {...r,subCategoryCount: r.subCategoryCount + 1} : r)
                        }),
                    );
                }
                else if(type === FormStatus.CREATE){
                    setState(o => {
                        const newData = [...o.data.map(c => Number(c.id) === newRecord.parentId ? {
                            ...c,
                            subCategories: c.subCategories ? [...c.subCategories, newRecord] : [newRecord],
                            subCategoryCount: c.subCategoryCount + 1
                        } : c), newRecord];
                        
                        return {
                            ...o,
                            data: newData
                        }
                    });
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
            this.getItem();
        },
        replaceStateData(oldCategoryDataLst: CategoryData[],updatedCategoryData:CategoryData): CategoryData[]{
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
                    const newSubCategories = functions.replaceStateData(oldCategoryData.subCategories, updatedCategoryData);
                    return {
                        ...oldCategoryData,
                        subCategories: newSubCategories
                    };
                }
                return oldCategoryData;
            });
        },
        submitForCreation(values: {name: string; parentId?: number}){
            categoryAPIInstance.postNewCategory({
                name: values.name,
                parentCategoryId: values.parentId
            }).then((response) =>{
                if(response.data){
                    toast.success("Added new category successfully")
                    functions.updateItem(response.data, FormStatus.CREATE, values?.parentId?.toString?.());
                    functions.displayModal(false);
                }
            }).catch(error =>{
                let msg;
                if(error instanceof AxiosError){
                    msg = error.response?.data || "Post failed";
                }
                toast.error(msg);
            });
        },
        submitForEdit(values: {id?: string; name: string; parentId?: number}){
            if(values?.id){
                categoryAPIInstance.updateSingleCategory(values.id, {
                    name: values.name,
                    parentCategoryId: values.parentId
                }).then((response) =>{
                    toast.success("Edit successfully");
                    functions.updateItem(response.data, FormStatus.EDIT);
                    functions.displayModal(false);
                }).catch(error =>{
                    let msg;
                    if(error instanceof AxiosError){
                        msg = error.response?.data || "Edit failed";
                        toast.error(msg);
                    }
                });
            }
        },
        submitForDelete(values: {id: string, parentId?: number}){
            categoryAPIInstance.deleteSingleCategory(values.id)
                .then(_ =>{
                    toast.success("Deleted successfully");
                    this.updateItem(state.data.find(p => p.id === values.id), FormStatus.DELETE, values?.parentId?.toString?.());
                    this.displayModal(false);
                }).catch(error =>{
                    toast.error(error);
                });
        },
        renderTableOrTree(mode: 'table' | 'treeview'){
            return state.loading ? (<Spinner animation="border"></Spinner>)
            : mode === 'table' ? (<Category.CategoryTable 
                filterKeys={["name", "level"]}
                data={state.data.map(row =>{
                    const {hasOpened, parentId, subCategoryCount,...props} = row;
                    const name = parentId ? state.data.find(p => Number(p.id) === parentId)?.name : "None";
                    return {
                        ...props,
                        "sub number": subCategoryCount,
                        "parent name": name
                    };
                })}
                onRead={(index) => {
                    setState(o =>({
                        ...o,
                        displayedModal: true,
                        editIndex: Number(state.data?.[index]?.id),
                        hasChanges: FormStatus.READ
                    }));
                }}
                onEdit={(index) => {
                    setState(o =>({
                        ...o,
                        displayedModal: true,
                        editIndex: Number(state.data?.[index]?.id) || 0,
                        hasChanges: FormStatus.EDIT
                    }));
                }}
                onDelete={(index) => {
                    setState(o =>({
                        ...o,
                        displayedModal: true,
                        editIndex: Number(state.data?.[index]?.id) || 0,
                        hasChanges: FormStatus.DELETE
                    }));
                }}
            ></Category.CategoryTable>)
            : (<CategoryTreeview data={state.data} 
                activeIcon={() =><AiFillPlusCircle></AiFillPlusCircle>}
                nonActiveIcon={()=><AiFillMinusCircle></AiFillMinusCircle>}
                ></CategoryTreeview>)
        },
        renderModal(){
            return (
                <Formik 
                    initialValues={state.hasChanges !== FormStatus.EDIT ? 
                        {name: '', parentId: navigatedFormStates.current} : 
                        {name: state.data.find(p => Number(p.id) === state.editIndex)?.name || "", 
                         parentId: state.data.find(p => Number(p.id) === state.editIndex)?.parentId}} 
                    enableReinitialize={true}
                    validationSchema={yup.object().shape({
                        name: yup.string().required(),
                    })}
                    onSubmit={(values, formHelpers: FormikHelpers<{name: string, parentId?: number}>) =>{
                        formHelpers.setSubmitting(false);
                        switch (state.hasChanges) {
                            case FormStatus.CREATE:
                                this.submitForCreation({
                                    name: values.name,
                                    parentId: values.parentId
                                })
                                return;
                            case FormStatus.EDIT:
                                this.submitForEdit({
                                    id: state.data.find(p => Number(p.id) === state.editIndex)?.id,
                                    name: values.name,
                                    parentId: values.parentId
                                });
                                return;
                        }
                    }}>
                    {(props) =>{
                        return (
                            <Modal show={state.displayedModal} onHide={() => functions.displayModal(false)}>
                                <Modal.Header closeButton>
                                    <i>{
                                        state.hasChanges === FormStatus.CREATE ? 
                                        "Post new category" :
                                        state.hasChanges === FormStatus.EDIT ?
                                        "Edit category" :
                                        state.hasChanges === FormStatus.READ ?
                                        "Category detail" :
                                        "Warning"
                                    }</i>
                                </Modal.Header>
                                <Modal.Body>
                                    {
                                        state.hasChanges === FormStatus.CREATE ?
                                        this.renderModalOfCreate(props) :
                                        state.hasChanges === FormStatus.EDIT ?
                                        this.renderModalOfEdit(props) :
                                        state.hasChanges === FormStatus.READ ?
                                        this.renderModalOfRead(state.data.find(p => Number(p.id) === state.editIndex)!) :
                                        this.renderDeleteDialog()
                                    }
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="danger" 
                                        onClick={() => functions.displayModal(false)}>
                                        Close
                                    </Button>
                                    <Button 
                                        variant="success" 
                                        onClick={() =>{
                                            if(state.hasChanges === FormStatus.DELETE){
                                                this.submitForDelete({
                                                    id: state.data.find(p => Number(p.id) === state.editIndex)!.id
                                                });
                                                return;
                                            }
                                            else if(state.hasChanges === FormStatus.READ){
                                                functions.changeFormStatus(FormStatus.CREATE, state.data.find(p => Number(p.id) === state.editIndex)!.id);
                                                return;
                                            }
                                            submitButtonRef.current?.click?.();
                                        }}>
                                            {state.hasChanges === FormStatus.DELETE ? "Confirm" :
                                             state.hasChanges === FormStatus.READ ? "Add With This" :
                                             "Save Changes"}
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                        )
                    }}
                </Formik>
            )
        },
        renderModalOfCreate(formikProps: FormikProps<{name: string; parentId?: number;}>){
            return (
                <Form onSubmit={(e) =>{
                    e.preventDefault();
                    formikProps.handleSubmit(e);
                    }}>
                    <Form.Group className="mb-3" controlId="creationForm.Root">
                        <Form.Label>Category Base</Form.Label>
                        <Form.Select
                            name="parentId"
                            onChange={formikProps.handleChange}
                            value={navigatedFormStates?.current}
                            autoFocus
                        >
                            <option value={0}>{"New category"}</option>
                            {state.data.map(c => c.level < 2 && (
                                <option value={c.id} key={c.id}>{c.name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="creationForm.Name">
                        <Form.Label>Category Name</Form.Label>
                        <Form.Control
                            name="name"
                            isInvalid={formikProps.touched.name && !!formikProps.errors.name}
                            onBlur={formikProps.handleBlur}
                            onChange={formikProps.handleChange}
                            placeholder="Ex: Panty, Shoe, ..."
                        />
                        <Form.Control.Feedback type="invalid">{formikProps.errors.name}</Form.Control.Feedback>
                    </Form.Group>
                    <button ref={submitButtonRef} 
                    type="submit"
                    style={{display: 'none'}}></button>
                </Form>
            )
        },
        renderModalOfEdit(formikProps: FormikProps<{name: string; parentId?: number;}>){
            return (
                <Form onSubmit={(e) =>{
                    e.preventDefault();
                    formikProps.handleSubmit(e);
                    }}>
                    <Form.Group className="mb-3" controlId="creationForm.Root">
                        <Form.Label>Category Base</Form.Label>
                        <Form.Select
                            name="parentId"
                            value={formikProps.values?.parentId}
                            onChange={formikProps.handleChange}
                            autoFocus
                        >
                            <option value={0}>{"New category"}</option>
                            {state.data.map(c => c.level < 2 && (
                                <option value={c.id} key={c.id + 1}>{c.name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="creationForm.Name">
                        <Form.Label>Category Name</Form.Label>
                        <Form.Control
                            name="name"
                            value={formikProps.values.name}
                            onChange={formikProps.handleChange}
                            placeholder="Ex: Panty, Shoe, ..."
                        />
                        <Form.Control.Feedback type="invalid">{formikProps.errors.name}</Form.Control.Feedback>
                    </Form.Group>
                    <button ref={submitButtonRef} 
                    type="submit"
                    style={{display: 'none'}}></button>
                </Form>
            )
        },
        renderModalOfRead(data: CategoryData){
            return (
                <section>
                    <Row>
                        <Col>Name</Col>
                        <Col>{data.name}</Col>
                    </Row>
                    <Row>
                        <Col>Level</Col>
                        <Col>{data.level}</Col>
                    </Row>
                    <Row>
                        <Col>Sub-categories count</Col>
                        <Col>{data.subCategoryCount}</Col>
                    </Row>
                    {!!data.parentId && <Row>
                        <Col>Parent node</Col>
                        <Col>{state.data.find(p => Number(p.id) === data.parentId)?.name}</Col>
                    </Row>}
                    <Row>
                        <Col>Sub-nodes</Col>
                        <Col data-pointer>
                            {this.renderSubCategories(Number(data.id))}
                        </Col>
                    </Row>
                </section>
            )
        },
        renderDeleteDialog(){
            return (
                <div>
                    <h4>Do you want to remove this item ?</h4>
                    <i>If you confirmed, this item will be removed permenantly</i>
                </div>
            )
        },
        renderSubCategories(id: number){
            return <Stack>
                {state.data.map(item =>{
                    return item.parentId === id && (
                        <span key={item.id}>
                            - {item.name}
                        </span>)
                })}
            </Stack>
        },
    }

    React.useEffect(() =>{
        functions.getItem();
    },[isAuthorized]);

    return (<Stack direction='vertical' gap={1} className="align-items-start p-3">
        <Row className='px-3 pb-3 w-100' fluid={"true"} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '2rem 1.2rem'
            }}>
            <Col xs={'auto'} sm={'auto'}>
                <h3 style={{textTransform: 'uppercase'}}>Category List</h3>
                <i>View and Edit category</i>
            </Col>
            <Col xs={'auto'} sm={'auto'}>
                <Stack>
                    <Button 
                    onClick={() => {
                        navigatedFormStates.current = null;
                        setState(o =>({
                            ...o,
                            displayedModal: true,
                            hasChanges: FormStatus.CREATE
                        }));
                    }}
                    style={{
                        backgroundColor: 'var(--clr-logo)',
                        fontWeight: '600',
                        border: 'none',
                        padding: '0.6em 0.8em'
                    }}>
                        <span style={{
                        marginRight: '1.2em',
                        verticalAlign: "text-top"
                        }}>
                            <AiOutlinePlus></AiOutlinePlus>
                        </span> 
                        <span>
                            Add New Category
                        </span>
                    </Button>

                    <ToggleButtonGroup className="category-page__toggle mt-2"
                        type="radio" 
                        name="options" 
                        defaultValue={'table'} 
                        onChange={(value) =>{
                            functions.changeView(value);
                        }}>
                        <ToggleButton className="category-page__toggle--button" id="table-view" value={'table'}>
                            <BiTable></BiTable>
                        </ToggleButton>
                        <ToggleButton className="category-page__toggle--button" id="table-tree" value={'treeview'}>
                            <MdAccountTree></MdAccountTree>
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Stack>
            </Col>
        </Row>

        {functions.renderTableOrTree(state.mode)}

        {functions.renderModal()}
    </Stack>
    )
}

export const CategoryTreeview = ({data, activeIcon, nonActiveIcon}: {data: CategoryData[], activeIcon?: () => React.ReactNode, nonActiveIcon?: () => React.ReactNode}) =>{
    const [state,setState] = React.useState(data);
    React.useEffect(() =>{
        setState(data);
    },[data]);

    const functions = {
        transformStateToTreeViewInput(source: CategoryData[], activeIcon?: () => React.ReactNode, nonActiveIcon?: () => React.ReactNode): NodeValue[]{
            return source.map(category=>{
                return {
                    key: category.id,
                    label: category.name,
                    level: category.level,
                    icon: category.hasOpened ? nonActiveIcon?.() : activeIcon?.(),
                    childrenAmount: category.subCategoryCount,
                    childrenCurrent: category.subCategories ? category.subCategories.length : 0,
                    hasOpened: category.hasOpened,
                    subNodes: !!category.subCategories ? functions.transformStateToTreeViewInput(category.subCategories, activeIcon, nonActiveIcon) : []
                }
            })
        },
        transformTreeViewInputToState(source: NodeValue[]): CategoryData[]{
            return source.map(n=>{
                return {
                    id: n.key,
                    name: n.label,
                    level: n.level,
                    hasOpened: n.hasOpened,
                    subCategoryCount: n.childrenAmount,
                    subCategories: n.subNodes ? this.transformTreeViewInputToState(n.subNodes) : [],
                }
            })
        },
        mergeTwoObjectsWithUnique(entryArray: any[], dataArray: any[], key: string): CategoryData[]{
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
        },
    }

    return (
        <div className="p-3 w-100" style={{background: '#fff', minHeight: "50vh"}}>
            <TreeView data={functions.transformStateToTreeViewInput(state.filter(p => p.level === 0), activeIcon, nonActiveIcon)}
                setCurrentNode={(currentNode) => {
                    // setState(p => p.map((item) => item.id === currentNode.key ? {...item, hasOpened: !item.hasOpened} : item));
                    return functions.transformStateToTreeViewInput(state.filter(p => p?.parentId && p.parentId === Number(currentNode.key)), activeIcon, nonActiveIcon);
                }}>
            </TreeView>
        </div>
    )
}

export enum FormStatus {
    READ,
    CREATE,
    EDIT,
    DELETE,
    NONE,
}

export interface CategoryData {
    id: string;
    name: string;
    level: number;
    parentId?: number;
    subCategoryCount: number;
    hasOpened: boolean;
    subCategories?: CategoryData[];
}

export interface CategoryState {
    data: CategoryData[];
    displayedData: CategoryData[];
    keyTables: string[];
    loading: boolean;
    error: string;
    page: number;
    take: number;
    hasChanges?: FormStatus;
    displayedModal: boolean;
    editIndex: number;
    mode: 'table' | 'treeview';
}

export type CategoryTableRowProps = {
    record: CategoryData;
    setRecord?: (
        newRecord: CategoryData,
        type: FormStatus,
        rootId?: string
    ) => void;
    children?: React.ReactNode;
    handleResult?: (props: CategoryTableRowResultProps) => React.ReactNode;
    handleCreate?: (props: CategoryData) => any;
    handleUpdate?: (props: CategoryData) => any;
    handleDelete?: (id: string) => void;
    handleBlur?: () => void;
};

export interface CategoryTableRowResultProps {
    values?: CategoryData[];
}
