import React, { ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { FieldArray, Formik, FormikHelpers,FormikProps } from 'formik';
import { Button, ButtonGroup, Col, Form, Row } from 'react-bootstrap';
import { HiChevronRight } from 'react-icons/hi';
import { CgFolderAdd } from 'react-icons/cg';
import { MdEdit } from 'react-icons/md';
import { TiTimes } from 'react-icons/ti';

import { productAPIInstance,categoryAPIInstance, AppLocalStorage } from '../../config';
import { PostProductRequest, PostProductRequestDTO } from '../../models';
import { axiosErrorHandler } from '../../hooks';
import { postProductSchema, changeAvatarSchema } from '../../schemas';
import { User } from '../../containers';
import "./index.css";

type ProductClassify = {
    name: string;
    types: string[];
    price: number;
    inventory: number;
}
interface FormValues{
    name: string;
    price: number;
    inventory: number;
    inPages: boolean;
    description: string;
    userPageId: number;
    files?: File[];
    categoryIds: SelectCategoryValues[];
    classifies: ProductClassify[]
}

// Form Display

interface PostProductState {
    loading: boolean;
    error: string;
    currentStep: number;
}

export const PostProduct = () => {
    const [state, setState] = React.useState<PostProductState>({
        loading: false,
        error: '',
        currentStep: 1, 
    });

    function prevStep(){
        setState(o =>({
            ...o,
            currentStep: o.currentStep > 1 ? o.currentStep - 1 : o.currentStep
        }));
    }
    function nextStep(){
        setState(o =>({
            ...o,
            currentStep: o.currentStep < 2 ? o.currentStep + 1 : o.currentStep
        }));
    }
    function sendProductForm(formData: PostProductRequest){
        AppLocalStorage.setPostProductForm(formData);

        // axiosErrorHandler(() =>{
        //     productAPIInstance.createNewProduct(formData,{

        //     }).then(response =>{

        //     })
        // })
    }

    React.useEffect(() =>{
        const cancelSource = axios.CancelToken.source();
        axiosErrorHandler(() => {
            
        });

        return () => {

        }
    },[]);

    return (
        <section style={{
            padding: '2.4rem'
        }}>
            <div style={{padding: '0 0 2.4rem'}}>
                <h2>Upload your new product</h2>
                <i>Please select the properties for your product</i>
            </div>

            <Formik 
                initialValues={{
                    name: '',
                    description: '',
                    inPages: true,
                    inventory: 0,
                    userPageId: 5,
                    price: 12000,
                    categoryIds: [],
                    classifies: []
                }}
                validationSchema={postProductSchema}
                onSubmit={(values:FormValues, formHelpers: FormikHelpers<FormValues>) =>{
                    formHelpers.setSubmitting(false);
                    
                    const productFormRequest = {
                        ...values,
                        categoryIds: values.categoryIds.map(c => c.id),
                        files: new Set<File>(values.files)
                    } as PostProductRequest;
    
                    sendProductForm(productFormRequest);
                }}
                >
                    {(props) =>{
                        const postProductFormSteps = [
                            {
                                key: 1,
                                element: <PostProductEntry formProps={props} onClick={nextStep}></PostProductEntry>
                            },
                            {
                                key: 2,
                                element: <PostProductDetail formProps={props} onCancel={prevStep}></PostProductDetail>
                            },
                        ]

                        
                        return (
                            <>
                                {postProductFormSteps.find(s => s.key === state.currentStep)?.element}
                            </>
                        )
                    }}
            </Formik>
        </section>
    )
}


// Second form
interface PostProductDetailProps{
    formProps: FormikProps<FormValues>;
    children?: React.ReactNode;
    onCancel?: () => void;
    onSaveAndHide?: () => void;
    onUpdate?: () => void;
}

const PostProductDetail = ({formProps, onCancel, onSaveAndHide, onUpdate}:PostProductDetailProps) =>{
    
    React.useEffect(() => {
        const beforeUnloadListener = (event: BeforeUnloadEvent) => {
            event.preventDefault();
            return event.returnValue = "Are you sure you want to exit?\nYour form submission will be eliminated";
        };

        if(formProps.values.name
            || formProps.values.description
            || formProps.values.categoryIds.length
            || formProps.values.files
        ) {
            window.addEventListener("beforeunload", beforeUnloadListener, {
                capture: true,
            });
        }
        else {
            window.removeEventListener("beforeunload", beforeUnloadListener, {
                capture:true
            })
        }

        return () =>{
            window.removeEventListener("beforeunload", beforeUnloadListener, {
                capture: true
            });
        }
    },[formProps.values])

    return (<Form onSubmit={formProps.handleSubmit}>
        <Form.Group controlId='postProductDetailBasic'>
            <h3>Product Basics</h3>
            <Form.Group controlId="productName">
                <Form.Label>Product Name </Form.Label>
                <Form.Control name={"name"} 
                    value={formProps.values.name}
                    isInvalid={formProps.touched.name && !!formProps.errors.name}
                    onChange={formProps.handleChange}
                    onBlur={formProps.handleBlur}
                ></Form.Control>
                <Form.Control.Feedback type="invalid">{formProps.errors.name}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="description">
                <Form.Label>Description</Form.Label>
                <Form.Control name={"description"} 
                    as="textarea"
                    rows={10}
                    value={formProps.values.description}
                    onChange={formProps.handleChange}></Form.Control>
            </Form.Group>

            <Form.Group controlId="categoryIds">
                <Form.Label>Categories</Form.Label>
                <Form.Control name={"categoryIds"} 
                    type="hidden"
                    onChange={formProps.handleChange}></Form.Control>
                    <div className="post-product__breadcrumb">
                        {!!formProps.values.categoryIds &&  formProps.values.categoryIds.map(c => c.name)?.join(" > ")}
                        <span className='post-product__breadcrumb--icon' onClick={onCancel}>
                            <MdEdit></MdEdit>
                        </span>
                    </div>
            </Form.Group>
            
            <Form.Group controlId="files">
                <MultipleFileUpload
                    name='files'
                    isInvalid={!!formProps.errors.files}
                    errors={formProps.errors.files}
                    formProps={formProps}
                    onChangeMultiple={(files) => {
                        formProps.setFieldValue("files", files);
                    }}
                ></MultipleFileUpload>
            </Form.Group>
        </Form.Group>

        <Form.Group controlId='postProductSpecification'>
            <h3>Product specification</h3>
            <Row className="md-4">
                <Form.Group as={Col} md={3} controlId="price">
                    <Form.Label>Price</Form.Label>
                    <Form.Control type={"number"} 
                        step={2000}
                        name={"price"} 
                        value={formProps.values.price}
                        onChange={formProps.handleChange}></Form.Control>
                </Form.Group>

                <Form.Group as={Col} md={3} controlId="inventory">
                    <Form.Label>Inventory</Form.Label>
                    <Form.Control name={"inventory"} 
                        value={formProps.values.inventory}
                        onChange={formProps.handleChange}></Form.Control>
                </Form.Group>
            </Row>
        </Form.Group>

        <Form.Group controlId='postProductSelling'>
            <h3>Product Selling</h3>
            <Form.Group controlId="productClassify">
                <FieldArray 
                    name="classifies"
                    render={(arrayHelpers) =>{
                        return <div>
                            {
                                formProps.values.classifies.map((classify,index) => {
                                    return <div key={index}>
                                        <ClassifyProductInput 
                                            formProps={formProps} 
                                            name={`classifies[${index}]`}
                                            index={index}
                                            value={classify.name}
                                        ></ClassifyProductInput>
                                        {formProps.values.classifies.length > 1 && <Button variant="primary"
                                            onClick={() =>{
                                                // const newClassifies = formProps.values.classifies.filter((_, indx)=> indx !== index);
                
                                                // formProps.setValues({
                                                //     ...formProps.values,
                                                //     classifies: newClassifies
                                                // });
                                                arrayHelpers.remove(index);
                                            }}>- Remove</Button>}
                                    </div>
                                })
                            }
                            {
                                formProps.values.classifies.length < 2 && <Button variant="success" 
                                    onClick={() =>{
                                        arrayHelpers.push({
                                            name: '',
                                            types: [""]
                                        })
                                    }}
                                >+ Add new classification</Button>
                            }
                        </div>
                    }}
                ></FieldArray>
            </Form.Group>

            <div>
                <ClassifyProductPreview data={formProps.values.classifies}></ClassifyProductPreview>
            </div>
        </Form.Group>

        <Form.Group controlId='postProductTransport'>
            <h3>Transport</h3>
            <Form.Label></Form.Label>
        </Form.Group>

        <Form.Group controlId='postOtherInformation'>
            <h3>Other information</h3>
            <Form.Label></Form.Label>
        </Form.Group>

        <ButtonGroup>
            <Button variant='primary' onClick={onCancel}>Cancel</Button>
            <Button variant="primary" type="submit" onClick={onSaveAndHide}>Save and cancel</Button>
            <Button variant="success" type="submit" onClick={onUpdate}>Save and display</Button>
        </ButtonGroup>
    </Form>)
}


// Upload file 
interface MultipleFileUploadProps{
    onChangeMultiple: (files: File[]) => void;
    isInvalid?: boolean;
    errors?: string;
    name: string,
    formProps?: FormikProps<FormValues>
}

type MultipleFileUploadState = {
    images: File[],
    currentIndex: number,
    showCrop: boolean
}

const MultipleFileUpload = ({formProps,...props}: MultipleFileUploadProps) =>{
    const [state, setState] = React.useState<MultipleFileUploadState>({
        images: [],
        currentIndex: 0,
        showCrop: true
    });
    const currentInput = React.useRef<HTMLInputElement>(null);
    const thumbElement = React.useRef<HTMLImageElement>(null);

    React.useEffect(()=> {
        props.onChangeMultiple(state.images);
    },[state.images])

    return <>
        <span className="multi-upload__thumb--wrapper">
            { 
                state.images.map((image,index) => <div className="multi-upload__thumb--card" key={index + 1}>
                    <span className="multi-upload__thumb--editBtn"
                        onClick={() => setState(o =>({
                            ...o,
                            currentIndex: index,
                            showCrop: true
                        }))}
                    >Edit</span>
                    <span className="multi-upload__thumb--delBtn" 
                        onClick={() => setState(o =>({
                            ...o,
                            images: o.images.filter((_,indx) => indx !== index),
                            currentIndex: index,
                            showCrop: true
                        }))}
                    >
                        <TiTimes></TiTimes>
                    </span>
                    <User.Thumb 
                        ref={thumbElement}
                        image={image} 
                        showCrop={state.showCrop && index === state.currentIndex}
                        styleCrop={{
                            position: 'fixed',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%,-50%)',
                            width: '300px',
                            height: '300px'
                        }}
                        setImage={(newImage) =>{
                            setState(o => {
                                return {
                                    ...o,
                                    images: o.images.map((i, idx) => idx === index ? newImage : i),
                                    showCrop: false
                                }
                            });
                        }}
                    ></User.Thumb>
                </div>)
            }
        
            <span className="multi-upload__input"
                onClick={() =>{
                    currentInput.current && currentInput.current.click();
                    setState(o => {
                        return {
                            ...o,
                            currentIndex: o.images.length
                        }
                    })
                }}>
                    <span>
                        <Form.Control 
                            style={{display: 'none'}}
                            type="file"
                            ref={currentInput}
                            accept="image/*"
                            aria-describedby='profileHelpBlock'
                            name={props.name + `[${state.currentIndex}]`}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                const image = e.currentTarget.files && e.currentTarget.files[0];
                                
                                if(image) {
                                    changeAvatarSchema.validate({file: image})
                                    .then(({file}) =>{
                                        setState(o => {
                                            return {
                                                ...o,
                                                images:[...o.images, file],
                                                currentIndex: o.images.length,
                                                showCrop: true
                                            }
                                        });
                                    }).catch(error =>{
                                        formProps && formProps.setErrors({
                                            files: error.message
                                        });
                                    });
                                }
                            }}
                        ></Form.Control>
                    </span>

                    <CgFolderAdd></CgFolderAdd>
            </span>
        </span>
        
        {!props.isInvalid && !!props.errors && <Form.Control.Feedback type="invalid">{
            props.errors
        }</Form.Control.Feedback>}
    </>
}


// Product classifies
interface ClassifyProductInputProps {
    formProps: FormikProps<FormValues>;
    name: string;
    index: number;
    value: any;
}

const ClassifyProductInput = ({formProps,...props}: ClassifyProductInputProps) =>{

    return <>
        <div style={{
                    border: '1px solid #f1f1f1',
                    background: 'var(--clr-logo',
                    color: '#fff',
                    borderRadius: '2.4rem',
                    padding: '1.2rem 2.4rem'
                }}>
            <Row className="md-2">
                <Form.Group 
                    controlId={`classifyProduct${props.index}-name`}
                    as={Col} 
                    md={6}
                >
                    <Form.Control 
                        name={`classifies[${props.index}].name`}
                        onChange={formProps.handleChange}
                        onBlur={formProps.handleBlur}
                        placeholder="Classify Name"
                        value={props.value}
                    ></Form.Control>
                    <Form.Control.Feedback type="invalid"></Form.Control.Feedback>
                </Form.Group>

                <Form.Group 
                    controlId={`classifyProduct-types`}
                    as={Col}
                    md={6}
                >
                    <FieldArray
                        name={`${props.name}.types`}
                        render={arrayHelpers => {
                            const classifyLst = formProps.values.classifies[props.index].types;
                            return <div>
                                {classifyLst.map((type,index) =>(
                                    <div key={index + 1} style={{
                                        display: 'flex',
                                        gap: '10px',
                                        alignItems: 'center',
                                        paddingBottom: '1.2rem'
                                    }}>
                                        <ClassifyProductTypeInput 
                                            index={index}
                                            formProps={formProps}
                                            name={`${props.name}.types[${index}]`}
                                            value={type}
                                        ></ClassifyProductTypeInput>
                                        <span>
                                            {classifyLst.length > 1 && (
                                                <Button variant="danger" 
                                                    onClick={() =>{
                                                        arrayHelpers.remove(index);
                                                    }}
                                                >- Remove</Button>)
                                            }
                                        </span>
                                    </div>
                                ))}
                                <Button variant="warning" onClick={() =>{
                                    arrayHelpers.push("")
                                }}>+ Add new product classified type</Button>
                            </div>
                        }}
                    />
                </Form.Group>
            </Row>
        </div>
    </>
}

interface ClassifyProductTypeInputProps {
    formProps: FormikProps<FormValues>;
    name: string;
    index: number;
    value: any;
}

const ClassifyProductTypeInput = ({formProps,...props}:ClassifyProductTypeInputProps) =>{
    return <>
        <Form.Group controlId="classifyType">
            <Form.Control 
                name={`${props.name}`}
                onChange={formProps.handleChange}
                onBlur={formProps.handleBlur}
                value={props.value}
                placeholder={"Classify description" + ` ${props.index + 1}`}
            ></Form.Control>
        </Form.Group>
    </>
}

// Product classifies preview
interface ClassifyProductPreviewProps {
    data: ProductClassify[];
}
class Node {
    value: any;
    nodes: Node[] | null;

    constructor(value: any, tails: Node[] | null) {
        this.value = value;
        this.nodes = tails;
    }

    public countChildren(): number {
        const currentTailNodeLength = this.nodes?.length || 0;

        const nestedTailNodes = this.nodes ? this.nodes.reduce((p: number, n: Node) => p + n.countChildren() ,0) : 0;  

        return currentTailNodeLength + nestedTailNodes;
    }

    public countLastNodes(): number {
        if(this.nodes)
            return this.nodes.length * this.nodes[0].countLastNodes();
        return 1;
    }
}
type ClassifyProductPreviewListState = {
    rows?: Node[];
}

const ClassifyProductPreview = (props: ClassifyProductPreviewProps) =>{
    const [state, setState] = React.useState<ClassifyProductPreviewListState>({
    });
    
    function transformClassifyListToNodeList(classifyList: string[][], startIndx: number): Node[] | null {
        if(!classifyList[startIndx]){
            return null;
        }
        return classifyList[startIndx].map(classify =>{
            const node = new Node(classify, transformClassifyListToNodeList(classifyList, startIndx + 1));
            return node;
        });
    }

    React.useEffect(() =>{
        const bodyData = props.data.map(item => item.types);

        setState(o =>{
            const rows = transformClassifyListToNodeList(bodyData,0) || [];
            return {
                ...o,
                rows: rows
            }
        });
    },[props.data]);

    return <>
        <table className='productClassify__preview--table' style={{
            border: '1px solid #f1f1f1',
            borderCollapse: 'collapse'
        }}>
            <thead className="classify-product-preview__header">
                <tr>
                    {
                        props.data.map((key,index) =>{
                            return <th key={index}>
                                {key.name || "Classify Name"} 
                            </th>
                        }) 
                    }
                    <th>price</th>
                    <th>inventory</th>
                </tr>
            </thead>
            <tbody className="classify-product-preview__body">
                <ClassifyProductPreviewList 
                    rows={state.rows}
                ></ClassifyProductPreviewList>
            </tbody>
        </table>
    </>
}

const ClassifyProductPreviewList = (props: {
    rows?: Node[],
}) =>{

    if(!props.rows) return null;
    if(!!props.rows?.[0] && !props.rows[0].nodes){
        return <React.Fragment>
            {   
                props.rows.map((row,index) =>{
                    return <tr key={index + 1}>
                        <ClassifyProductPreviewCell
                            node={row}
                        ></ClassifyProductPreviewCell>
                    </tr>
                })
            }
        </React.Fragment> 
    }
    return <React.Fragment>
    {
        props.rows.map((row,index) =>{
            return <ClassifyProductPreviewRow
                    key={index}
                    node={row}
                ></ClassifyProductPreviewRow>
        })
    }
    </React.Fragment>
}

const ClassifyProductPreviewRow = (props: {
    node: Node
}) =>{

    return <>
        <tr>
            <ClassifyProductPreviewCell
                node={props.node}
            ></ClassifyProductPreviewCell>
        </tr>
        {
            <ClassifyProductPreviewList
                rows={props.node?.nodes?.filter((_,index) => !!index)}
            ></ClassifyProductPreviewList>
        }
    </>
}

const ClassifyProductPreviewCell = (props: {
    node?: Node;
}) =>{

    if(!props.node) return <td classify-product-preview__cell>Name</td>;

    return <>
        <td 
            rowSpan={props.node.countLastNodes()}
            className="classify-product-preview__cell"
            style={{
                color: `rgba(0,0,0,${props.node.value? 1: 0.5})`,
            }}
        >{props.node.value || "Name"}</td>
        {
            props.node?.nodes?.at(0) 
            && <ClassifyProductPreviewCell
                node={props.node.nodes[0]}
            ></ClassifyProductPreviewCell> 
            || <>
                <td className="classify-product-preview__cell--input">
                    <Form.Control type='number' 
                    name={`classifies[]`}
                    placeholder='price'></Form.Control>
                </td>
                <td className="classify-product-preview__cell--input">
                    <Form.Control type='number' placeholder='inventory'></Form.Control>
                </td>
            </>
        }

    </>
}


// Step 1 form
interface PostProductEntryProps{
    formProps: FormikProps<FormValues>;
    children?: React.ReactNode;
    onClick?: () => void;
}

const PostProductEntry = ({formProps, onClick}: PostProductEntryProps) =>{

    React.useEffect(() => {
        const beforeUnloadListener = (event: BeforeUnloadEvent) => {
            event.preventDefault();
            return event.returnValue = "Are you sure you want to exit?\nYour form submission will be eliminated";
        };

        if(formProps.values.name
            || formProps.values.description
            || formProps.values.categoryIds.length
            || formProps.values.files
        ) {
            window.addEventListener("beforeunload", beforeUnloadListener, {
                capture: true,
            });
        }

        return () =>{
            window.removeEventListener("beforeunload", beforeUnloadListener, {
                capture: true
            });
        }
    },[formProps.values])

    return (
        <>
            <Form.Group controlId='postProductName'>
                <Form.Label>Product Name: </Form.Label>
                <Form.Control name="name"
                    onChange={formProps.handleChange}
                    onBlur={formProps.handleBlur}
                    isInvalid={formProps.touched.name && !!formProps.errors.name}
                    value={formProps.values.name}></Form.Control>
                <Form.Control.Feedback type="invalid">{formProps.errors.name}</Form.Control.Feedback>
            </Form.Group>            

            <SelectCategoryInput 
                formProps={formProps}
                isValid={(isValid) => {
                    formProps.setErrors({
                        ...formProps.errors,
                        categoryIds: !isValid? ["Select your category"]: undefined 
                    });

                }}
            ></SelectCategoryInput>


            <Button 
                onClick={onClick} 
                variant='success'
                disabled={
                    !!formProps.errors.categoryIds 
                    || !!formProps.errors.name}
            >Next</Button>
        </>
    )
}

interface SelectCategoryInputProps {
    formProps: FormikProps<FormValues>;
    children?: React.ReactNode;
    isValid?: (isValid: boolean) => void;   
}

const SelectCategoryInput = ({formProps,...props}: SelectCategoryInputProps) => {
    const [state, setState] = React.useState<{
        categories: Array<SelectCategoryValues>;
        selectedCategories: Map<number, SelectCategoryValues>;
        displayCategories: Array<SelectCategoryValues>,
        isValid: boolean
    }>({
        categories: [],
        selectedCategories: formProps.values.categoryIds.reduce((map,c) => {
            map.set(parseInt(c.level), c)
            return map;
        } , new Map<number, SelectCategoryValues>()),
        displayCategories: [],
        isValid: false
    }); 

    function fetchCategories() : Promise<Array<SelectCategoryValues>>
    {
        return new Promise(resolve => {
            categoryAPIInstance.getAllCategories()
            .then(({data}) => {
                let convertedData = data as SelectCategoryValues[];

                resolve(convertedData);
            })
        });
    }

    function searchCategories(pattern: string): void{
        setState(o => {

            function getParentCategory(currentCategory: SelectCategoryValues, level: number): SelectCategoryValues{
                if(parseInt(currentCategory.level) === level){
                    return currentCategory;
                }
                const nextCategory = o.categories.find(c => c.id === currentCategory.parentId);

                if(!nextCategory){
                    return currentCategory;
                }

                return getParentCategory(nextCategory, level);
            }
            
            const matchCategories = o.categories.filter(c => {
                const matchRegExp = new RegExp(`(${pattern})+`, "i");
                const patternResults = matchRegExp.test(c.name);
        
                return patternResults;
            }).map(mc => {
                return getParentCategory(mc, 0);
            }).reduce((p,c) => {
                p.set(c.id, c);
                return p;
            }, new Map<number, SelectCategoryValues>());

            return {
                ...o,
                displayCategories: Array.from(matchCategories, ([_, value]) => value)
            }
        })
    }

    React.useEffect(() => {
        fetchCategories().then(data => {
            setState(o => ({
                ...o,
                categories: data,
                displayCategories: data.filter(c => parseInt(c.level) === 0)
            }));
        });
    },[]);

    React.useEffect(() => {
        if(state.selectedCategories.size){
            formProps.setValues(o => ({
                ...o,
                categoryIds: Array.from(state.selectedCategories.values())
            }));
        }
        props.isValid && props.isValid(state.isValid);
    },[state.selectedCategories, state.isValid]);

    return <section style={{
        margin: '1.2rem 0'
    }}>
        <input placeholder="search categories" 
            onChange={(e: FormEvent<HTMLInputElement>) => {
                searchCategories(e.currentTarget.value);
            }}
            style={{
            borderRadius: '1.2rem',
            padding: '0.5rem 1rem',
            border: '1px solid #f1f1f1'
        }}></input>

        <span style={{marginLeft: '1.2rem'}}>Select your correct categories</span>

        <div 
            style={{
                display:'grid',
                gridTemplateColumns: "1fr 1fr 1fr",
                padding: '1.2rem 1.2rem 1rem 0'
            }}>
            <SelectCategoryList 
                originalData={state.categories}
                categories={state.displayCategories}
                level={0}
                selectedCategories={new Map<number, SelectCategoryValues>()}
                fetchSubCategories={(parentId, level, arrayData) => {
                    return new Promise<Array<SelectCategoryValues>>((resolve) => {
                        const data = arrayData.filter(c => c.parentId === parentId && parseInt(c.level) === level);
                        resolve(data);
                    });
                }}
                getSelectedCategories={(selectedCategories, permitNext) => {

                    setState(o => ({
                        ...o,
                        selectedCategories: selectedCategories,
                        isValid: permitNext
                    }));
                }}
            ></SelectCategoryList>
        </div>

        <Form.Group>
            <Form.Label>Selected categories: </Form.Label>
            
            <Form.Control
                type="hidden"
                name="categoryIds"
                isInvalid={!state.isValid && !!formProps.errors.categoryIds}
            ></Form.Control>

            <span>
                {formProps.values.categoryIds?.map(c => c.name).join(" > ")}
            </span>

            <Form.Control.Feedback type="invalid">{
                typeof formProps.errors.categoryIds === "string"
                ? formProps.errors.categoryIds
                : formProps.errors.categoryIds?.join(" , ")
            }</Form.Control.Feedback>
        </Form.Group>
    </section>
}

export type SelectCategoryValues = {
    id: number;
    name: string;
    level: string;
    parentId: number;
    subCategoryCount: number;
    subCategories?: SelectCategoryValues[],
}

type SelectCategoryListProps = {
    originalData: SelectCategoryValues[];
    categories: SelectCategoryValues[];
    level: number;
    selectedCategories: Map<number, SelectCategoryValues>,
    fetchSubCategories: (parentId: number, level: number, array: SelectCategoryValues[]) => Promise<Array<SelectCategoryValues>>,
    getSelectedCategories: (selectedItems: Map<number,SelectCategoryValues>, permitNext: boolean) => void;
}

type SelectCategoryListState = {
    data: SelectCategoryValues[],
    selectedCategory: SelectCategoryValues | null,
    selectedCategories: Map<number,SelectCategoryValues> | null,
}

const SelectCategoryList = (props: SelectCategoryListProps) =>{
    const [state, setState] = React.useState<SelectCategoryListState>({
        data: [],
        selectedCategories: new Map<number, SelectCategoryValues>(),
        selectedCategory: null
    });
    const isMounting = React.useRef<boolean>(true);

    React.useEffect(() => {
        if(isMounting.current){
            const categoryLst = props.categories as SelectCategoryValues[];
            setState(o => {
                return {
                    ...o,
                    data: categoryLst,
                    selectedCategory: null,
                    selectedCategories: new Map<number, SelectCategoryValues>()
                }
            });
        }
    },[props.categories]);

    function handleClickSingleItem(item: SelectCategoryValues) {
        const selectedItemMap = new Map<number, SelectCategoryValues>();
        selectedItemMap.set(parseInt(item.level), item);
        const newSelectedCategories = new Map<number, SelectCategoryValues>([
            ...Array.from(props.selectedCategories.entries()),
            ...Array.from(selectedItemMap.entries())
        ]);
        
        if(!item.subCategories && item.subCategoryCount){
            props.fetchSubCategories(item.id, parseInt(item.level) + 1, props.originalData)
            .then(data => {
                setState(o => {
                    return {
                        ...o,
                        selectedCategory: {
                            ...item,
                            subCategories: data
                        },
                        selectedCategories: newSelectedCategories
                    }
                })
            })
        }
        else{
            setState(o => {
                return {
                    ...o,
                    selectedCategory: item,
                    selectedCategories: newSelectedCategories
                }
            });
        }

        props.getSelectedCategories(newSelectedCategories, !item.subCategoryCount);
    }

    return <>
        <div style={{
            width:'100%',
            border: '1px solid #000'
        }}>
            {
                state.data.map(category => {
                    return (
                        <SelectCategoryItem key={category.id}
                            isActive={!!state.selectedCategory && state.selectedCategory.id === category.id}
                            item={category}
                            onClick={handleClickSingleItem}
                        ></SelectCategoryItem>
                    )
                })
            }
        </div>

        {!!state.selectedCategory?.subCategories && <SelectCategoryList 
            originalData={props.originalData}
            categories={state.selectedCategory.subCategories}
            selectedCategories={state.selectedCategories || new Map<number, SelectCategoryValues>()}
            level={props.level + 1}
            fetchSubCategories={props.fetchSubCategories}
            getSelectedCategories={props.getSelectedCategories}
        ></SelectCategoryList>}
    </>
}

const SelectCategoryItem = (
    {item,isActive, ...props}: {
    item: SelectCategoryValues,
    isActive?: boolean,
    onClick?: (item: SelectCategoryValues) => void,
}) =>{
    
    return (
        <>
            <div onClick={() => {
                props.onClick && props.onClick(item);
            }}
            style={{
                padding: '1.2rem 1.2rem 1.2rem 1.2rem',
                minWidth:'3rem',
                width: '100%',
                cursor: 'pointer',
                color: `${isActive? "var(--clr-logo)" : "inherit"}`
            }}>
                {item.name}
                {!!item.subCategoryCount && <span style={{
                    float: 'right'
                }}>
                    <HiChevronRight></HiChevronRight>
                </span>}
            </div>
        </>
    )
}