import React, { ChangeEvent, FormEvent } from 'react';
import axios from 'axios';

import { FieldArray, Formik, FormikErrors, FormikHelpers,FormikProps, useFormikContext } from 'formik';
import { Button, ButtonGroup, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { HiChevronRight } from 'react-icons/hi';
import { CgFolderAdd } from 'react-icons/cg';
import { MdEdit } from 'react-icons/md';
import { TiTimes } from 'react-icons/ti';
import { FaTimes } from 'react-icons/fa';
import { BiMinus, BiPlusCircle } from 'react-icons/bi';
import { BsPlusCircleFill } from 'react-icons/bs';

import { productAPIInstance,categoryAPIInstance } from '../../config';
import { PostProductRequestDTO } from '../../models';
import { axiosErrorHandler, useActions, useDebouncedInput, useTypedSelector } from '../../hooks';
import { postProductSchema, changeAvatarSchema } from '../../schemas';
import { User } from '../../containers';
import { getPhoto, transformImagetoString } from '../../utils';

import "./index.css";
import './postProduct.css';
import { toast } from 'react-toastify';

// Main form
export const PostProductForm = () => {
    const [state, setState] = React.useState<PostProductState>({
        loading: false,
        error: '',
        currentStep: 1, 
    });
    const {data: {id}} = useTypedSelector(p => p.seller);
    const {postNewProduct} = useActions();
    const functions = {
        prevStep(){
            setState(o =>({
                ...o,
                currentStep: o.currentStep > 1 ? o.currentStep - 1 : o.currentStep
            }));
        },
        nextStep(){
            setState(o =>({
                ...o,
                currentStep: o.currentStep < 2 ? o.currentStep + 1 : o.currentStep
            }));
        },
        async sendProductForm(request: PostProductRequestDTO){
            // const { files, productDetails, ...rest } = request;
            
            // const encoding64BaseImages = await Promise.all(Array.from(files).map((file) => transformImagetoString(file)));
    
            // const encoding64BaseDetailImages = await Promise.all(Array.from(productDetails).map((detail) => {
            //         return new Promise((resolve) => {
            //             Promise.resolve(
            //                 transformImagetoString(detail.image)
            //             ).then((image) => {
            //                 resolve({
            //                     ...detail,
            //                     image,
            //                 });
            //             });
            //         });
            //     })
            // );
    
    
            // AppLocalStorage.setPostProductForm({
            //     ...rest,
            //     files: encoding64BaseImages,
            //     productDetails: encoding64BaseDetailImages,
            // });
    
            // window.dispatchEvent(new Event('storage'));
            postNewProduct(request, {
                onSuccess: () =>{
                    toast.success("Created product. Waiting for inspect");
                },
                onError: (error) =>{
                    toast.error(error?.response?.data as string || "Failed");
                }
            });
        }
    }

    React.useEffect(() =>{
        const cancelSource = axios.CancelToken.source();
        axiosErrorHandler(() => {
            
        });

        return () => {
            cancelSource.cancel();
        }
    },[]);

    return (
        <section className="p-5">
            <div className="pb-5">
                <h2>Upload your new product</h2>
                <i>Please select the properties for your product</i>
            </div>

            <Formik 
                initialValues={{
                    name: '',
                    description: '',
                    inPages: true,
                    inventory: 1,
                    userPageId: id || 0,
                    price: 12000,
                    categoryIds: [],
                    reserve: true,
                    itemStatus: 0,
                    classifies: [],
                    classifyDetails: []
                }}
                validationSchema={postProductSchema}
                onSubmit={(values:FormValues, formHelpers: FormikHelpers<FormValues>) =>{
                    formHelpers.setSubmitting(false);
                    const { categoryIds, classifies, classifyDetails, files, ...props} = values;

                    const productFormRequest = {
                        ...props,
                        categoryIds: categoryIds.map(c => c.id),
                        productClassifies: classifies.map(c => {
                            return {
                                name: c.name,
                                classifyTypes: c.types
                            }
                        }),
                        productDetails: classifyDetails.map(d => {
                            return {
                                price: d.price,
                                inventory: d.inventory,
                                classifyIndexes: d.tierIndex,
                                image: d.image
                            }
                        }),
                        files: new Set<File>(files)    
                    } as PostProductRequestDTO;

                    functions.sendProductForm(productFormRequest);
                }}
                >
                    {(formProps) =>{
                        const postProductFormSteps = [
                            {
                                key: 1,
                                element: <PostProductEntry 
                                            formProps={formProps} 
                                            onClick={functions.nextStep}></PostProductEntry>
                            },
                            {
                                key: 2,
                                element: <PostProductDetail 
                                    formProps={formProps}
                                    onSaveAndHide={formProps.handleSubmit}
                                    onUpdate={formProps.handleSubmit}
                                    onCancel={functions.prevStep}></PostProductDetail>
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


// Step 1 form

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

        <Form.Group controlId="productCategorySelect">
            <Form.Label>Selected categories: </Form.Label>
            
            <span>
                {formProps.values.categoryIds?.map(c => c.name).join(" > ")}
            </span>

            <Form.Control
                type="hidden"
                name="categoryIds"
                isInvalid={!state.isValid && !!formProps.errors.categoryIds}
            ></Form.Control>

            <Form.Control.Feedback type="invalid">{
                formProps.errors.categoryIds &&
                typeof formProps.errors.categoryIds === 'string'
                ? formProps.errors.categoryIds as string
                : Array.isArray(formProps.errors.categoryIds)
                    ? (formProps.errors.categoryIds as Array<string>).at(0)
                    : ""            
            }</Form.Control.Feedback>
        </Form.Group>
    </section>
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
                background: '#fff',
                color: `${isActive? "var(--clr-logo)" : "inherit"}`,
                fontWeight: `${isActive? "800" : "600"}`,
                border: '1px solid black'
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

// Second form

const PostProductDetail = ({formProps, onCancel, onSaveAndHide, onUpdate}:PostProductDetailProps) =>{
    const [state, setState] = React.useState<PostProductDetailState>({
        priceTemp: 0,
        inventoryTemp: 0
    });

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
            <Form.Group controlId="productName" className="py-3">
                <Form.Label>Product Name </Form.Label>
                <Form.Control name={"name"} 
                    value={formProps.values.name}
                    isInvalid={formProps.touched.name && !!formProps.errors.name}
                    onChange={formProps.handleChange}
                    onBlur={formProps.handleBlur}
                ></Form.Control>
                <Form.Control.Feedback type="invalid">{formProps.errors.name}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="description" className="py-3">
                <Form.Label>Description</Form.Label>
                <Form.Control name={"description"} 
                    as="textarea"
                    rows={10}
                    value={formProps.values.description}
                    isInvalid={formProps.touched.description && !!formProps.errors.description}
                    onBlur={formProps.handleBlur}
                    onChange={formProps.handleChange}></Form.Control>
                <Form.Control.Feedback type="invalid">{formProps.errors.description}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="categoryIds" className="py-3">
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
            
            <Form.Group controlId="files" className="py-3">
                <MultipleFileUpload
                    name='files'
                    initialFiles={formProps.values.files || []}
                    isInvalid={formProps.touched.files && !!formProps.errors.files}
                    errors={formProps.errors.files}
                    formProps={formProps}
                    onChangeMultiple={(files) => {
                        formProps.setFieldValue("files", files);
                    }}
                ></MultipleFileUpload>
            </Form.Group>
        </Form.Group>

        <Form.Group controlId='postProductSelling' className="py-3">
            <h3>Product Selling</h3>
            {!formProps.values.classifies.length && <Form.Group controlId='productDetail'>
                <Row className="md-4" style={{
                    padding: '1.2rem 0'
                }}>
                    <Form.Group as={Col} md={3} controlId="price">
                        <Form.Label>Price</Form.Label>
                        <Form.Control type={"number"} 
                            step={2000}
                            name={"price"} 
                            value={formProps.values.price}
                            isInvalid={formProps.touched.price && !!formProps.errors.price}
                            onBlur={formProps.handleBlur}
                            onChange={formProps.handleChange}></Form.Control>
                            <Form.Control.Feedback type="invalid">{formProps.errors.price}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group as={Col} md={3} controlId="inventory">
                        <Form.Label>Inventory</Form.Label>
                        <Form.Control name={"inventory"} 
                            type="number"
                            value={formProps.values.inventory}
                            isInvalid={formProps.touched.inventory && !!formProps.errors.inventory}
                            onBlur={formProps.handleBlur}
                            onChange={formProps.handleChange}></Form.Control>
                        <Form.Control.Feedback type="invalid">{formProps.errors.inventory}</Form.Control.Feedback>
                    </Form.Group>
                </Row>
            </Form.Group>}

            <Form.Group controlId="productClassify">
                <FieldArray 
                    name="classifies"
                    render={(arrayHelpers) =>{
                        return <div style={{
                            margin: '0 0 1.2rem',
                        }}>
                            {
                                formProps.values.classifies.map((classify,index) => {
                                    return <div key={index} style={{
                                        position: 'relative',
                                        margin: '0 0 1.2rem',
                                    }}>
                                        <ClassifyProductInput 
                                            formProps={formProps} 
                                            name={`classifies[${index}]`}
                                            index={index}
                                            value={classify.name}
                                        ></ClassifyProductInput>
                                        <Button
                                            style={{
                                                color:"#000",
                                                position: 'absolute',
                                                right: '0.1rem',
                                                top: '0.2rem',
                                                fontSize: '1.5rem',
                                                background: 'transparent',
                                                border: 'none',
                                                lineHeight: '1'
                                            }}
                                            onClick={() =>{
                                                arrayHelpers.remove(index);
                                                
                                            }}>
                                                <BiMinus></BiMinus>
                                        </Button>
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
                                >
                                    <BsPlusCircleFill></BsPlusCircleFill> 
                                    <span style={{
                                        verticalAlign: 'middle',
                                        display: 'inline-block',
                                        textIndent: '0.5rem',
                                    }}>
                                        Add new classification
                                    </span>
                                </Button>
                            }
                        </div>
                    }}
                ></FieldArray>
            </Form.Group>

            {!!formProps.values.classifies.length && <Form.Group controlId="productClassifyDetails" className="p-3" style={{margin: '0 0 1.2rem', background:'#fff'}}>
                <FieldArray
                    name={"classifyDetails"}
                    render={(arrayHelpers) =>{
                        return <>
                            <Form.Group as={Row} 
                                md={3}
                                controlId="quickTyping">
                                <Form.Label column 
                                    style={{textAlign: 'right'}}
                                    md={2}
                                    lg={1}
                                    >Quick complete</Form.Label>
                                <Col md={10} lg={6}>
                                    <InputGroup className="mb-3">
                                        <Form.Control 
                                            type="number"
                                            placeholder="price"
                                            value={Number(state.priceTemp).toString()}
                                            min={0}
                                            step={2000}
                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>{
                                                const leadingNumber = parseInt(event.currentTarget.value.replace(/^0+/, ''), 10);
                                                setState(o => ({
                                                    ...o,
                                                    priceTemp: leadingNumber || 0
                                                }));
                                            }}
                                        ></Form.Control>
                                        <Form.Control 
                                            type="number"
                                            placeholder="inventory"
                                            value={Number(state.inventoryTemp).toString()}
                                            min={0}
                                            step={2000}
                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>{
                                                const leadingNumber = parseInt(event.currentTarget.value.replace(/^0+/, ''), 10);
                                                setState(o => ({
                                                    ...o,
                                                    inventoryTemp: leadingNumber || 0
                                                }));
                                            }}
                                        ></Form.Control>
                                        <Button variant="success" onClick={()=>{
                                            formProps.setValues((values) =>({
                                                ...values,
                                                classifyDetails: values.classifyDetails.map(d =>{
                                                    return {
                                                        ...d,
                                                        price: state.priceTemp || d.price,
                                                        inventory: state.inventoryTemp || d.inventory
                                                    }
                                                })
                                            }));
                                        }}>
                                            Apply
                                        </Button>
                                    </InputGroup>
                                </Col>
                            </Form.Group>

                            <ClassifyProductPreview 
                                data={formProps.values.classifies}
                                detailData={formProps.values.classifyDetails}
                                fieldName={"classifyDetails"}
                                onChange={(event) => {
                                    formProps.handleChange(event);
                                }}
                                onChangeClassifyType={(classifyDetails: ProductClassifyDetail[]) => {
                                    formProps.setFieldValue("classifyDetails",classifyDetails);
                                }}
                            ></ClassifyProductPreview>
                        </>
                    }}
                ></FieldArray>
            </Form.Group>}

        </Form.Group>

        <Form.Group controlId='postOtherInformation' className="py-3">
            <h3 className="py-3">Other information</h3>
            <Form.Group as={Row} controlId="reverseOptions">
                <Form.Label as={Col}>Reverse</Form.Label>
                <Row>
                    <Col xs={'auto'} sm="auto">
                        <Form.Check type="radio" inline name="reserve" label="No" onChange={() => formProps.setFieldValue("reserve", false)} checked/>
                    </Col>
                    <Col xs={'auto'} sm="auto">
                        <Form.Check type="radio" inline name="reserve" label="Yes" onChange={() => formProps.setFieldValue("reserve", true)}/>
                    </Col>
                </Row>
            </Form.Group>
            <Form.Group controlId="itemStatus">
                <Form.Label>Item status</Form.Label>
                <Form.Select name="itemStatus" onChange={formProps.handleChange}>
                    <option value={0} defaultChecked>New</option>
                    <option value={1} >Second hand</option>
                </Form.Select>
            </Form.Group>
        </Form.Group>

        <ButtonGroup className="me-2" aria-label="First group">
            <Button variant='primary' onClick={onCancel}>Cancel</Button>
            <Button variant="primary" type="submit" id="submitAndCancel" onClick={onSaveAndHide}>Save and cancel</Button>
            <Button variant="success" type="submit" id="submitAndDisplay" onClick={onUpdate}>Save and display</Button>
        </ButtonGroup>
    </Form>)
}

// Upload file 

const MultipleFileUpload = ({formProps,...props}: MultipleFileUploadProps) =>{
    const [state, setState] = React.useState<MultipleFileUploadState>({
        images: [],
        currentIndex: 0,
        showCrop: true,
        error: null
    });
    const thumbElement = React.useRef<HTMLImageElement>(null);
    const currentInput = React.useRef<HTMLInputElement>(null);

    // Update the callback with result of images
    React.useEffect(() => {
        Promise.all(state.images.map(image => {
            if(typeof image === "string") return getPhoto(image);
            else if(image instanceof File){
                return image;
            }
            return null;
        }))
        .then(images =>{
            props.onChangeMultiple(images);
        });      
    },[state.images]);

    function hasDuplicateImage(image : File | string, checkArray: File[]) {
        const _img = typeof image === "string"? getPhoto(image) : image;

        return checkArray.some(file => {
            return file.type === _img.type && file.name === _img.name || file.size === _img.size;
        });
    }

    function NonNullValue<T>(v: T | null | undefined): v is T{
        return v !== null && v !== undefined;
    }

    return <>
        <span className="multi-upload__thumb--wrapper">
            { 
                state.images.map((image,index) => <div className="multi-upload__thumb--card" key={index}>
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
                    <span className="multi-upload__thumb--cropper">
                        <User.Thumb 
                            ref={thumbElement}
                            image={image} 
                            showCrop={state.showCrop && index === state.currentIndex}
                            styleCrop={{
                                position: 'fixed',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%,-50%)',
                                minWidth: '300px',
                                maxWidth: '80vw',
                                width: '50vw',
                                zIndex:'1000',
                                background: "white",
                                boxShadow: '2px -2px 2px black inset, 0 0 10px 20px var(--clr-logo)',
                            }}
                            styleThumb={{
                                width:'120px',
                                height: '120px'
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
                    </span>
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
                    <span style={{display:'none'}}>
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
                                        const validatedImages = state.images.map(item => {
                                            if(typeof item === "string"){
                                                return getPhoto(item);
                                            }
                                            return item;
                                        }).filter(NonNullValue);

                                        if(hasDuplicateImage(image, validatedImages)){
                                            throw new Error("Your file has been existed");
                                        }

                                        setState(o => {
                                            return {
                                                ...o,
                                                images:[...o.images, file],
                                                currentIndex: o.images.length,
                                                showCrop: true,
                                                error: null
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
        <p>{state.images.map(img => typeof img === "string"
                            ? getPhoto(img) 
                            : img)
                        .reduce((t,f) =>{
                            return !!f 
                            ? t + (f.size / 1024 / 1024)  
                            : t;
                            }, 0).toFixed(2)} / 3 MB</p>
        
        {!!state.error || !!props.errors && <p style={{
            color: props.isInvalid? "var(--bs-danger)": "#000",
            fontStyle: 'italic'
        }}>{
            state.error || props.errors
        }</p>}
    </>
}



const SingleFileUpload = ({initialImage,onChange, ...props}: SingleFileUploadProp) =>{
    const [state, setState] = React.useState<SingleFileUploadState>({
        error: ''
    });
    const thumbElement = React.useRef<HTMLImageElement>(null);
    const currentInput = React.useRef<HTMLInputElement>(null);
    
    // Update the callback with result of images
    React.useEffect(() => {
        if(state?.imageUrl && onChange){
            if(typeof state.imageUrl === 'string'){
                onChange(getPhoto(state.imageUrl));
            }
            else if(state.imageUrl instanceof File){
                onChange(state.imageUrl);
            }
            else{
                onChange(null);
            }
        }
    },[state?.imageUrl]);

    React.useEffect(() => {
        if(initialImage instanceof File){
            transformImagetoString(initialImage).then(imgUrl =>{
                setState(o => ({
                    ...o,
                    imageUrl: imgUrl
                }));
            });
        }
    },[initialImage]);

    React.useEffect(() =>{
        props.onError && props.onError(state.error);
    },[state.error]);

    return <>
        <span className="multi-upload__thumb--wrapper" data-flex-direction={"vertical"}>
            { 
                state.imageUrl
                && 
                <>
                    <div className="multi-upload__thumb--card">
                        <span className="multi-upload__thumb--editBtn"
                            onClick={() => setState(o =>({
                                ...o,
                                showCrop: true
                            }))}
                        >Edit</span>
                        <span className="multi-upload__thumb--delBtn" 
                            onClick={() => setState(o =>({
                                ...o,
                                imageUrl: undefined,
                                showCrop: false
                            }))}
                        >
                            <TiTimes></TiTimes>
                        </span>
                        <span className="multi-upload__thumb--cropper">
                            <User.Thumb 
                                ref={thumbElement}
                                image={state?.imageUrl || ""} 
                                showCrop={state?.showCrop}
                                styleCrop={{
                                    position: 'fixed',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%,-50%)',
                                    minWidth: '300px',
                                    maxWidth: '80vw',
                                    width: '50vw',
                                    zIndex:'1000',
                                    background: "white",
                                    boxShadow: '2px -2px 2px black inset, 0 0 10px 20px var(--clr-logo)',
                                }}
                                setImage={(newImage) =>{
                                    setState(o => {
                                        return {
                                            ...o,
                                            imageUrl: newImage,
                                            showCrop: false
                                        }
                                    });
                                }}
                            ></User.Thumb>
                        </span>
                    </div>
                </>
                ||
                <>
                    <span className="multi-upload__input"
                        onClick={() =>{
                            currentInput.current && currentInput.current.click();
                        }}>
                            <CgFolderAdd></CgFolderAdd>
                    </span>
                </>
            }
            <span className="multi-upload__hiddenInput">
                <Form.Control 
                    style={{display: 'none'}}
                    type="file"
                    ref={currentInput}
                    accept="image/*"
                    aria-describedby='profileHelpBlock'
                    name={props.name}
                    isInvalid={props.isInvalid || !!state.error}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        const image = e.currentTarget.files && e.currentTarget.files[0];
                        
                        if(image) {
                            changeAvatarSchema.validate({file: image})
                            .then(({_}) =>{
                                setState(old =>{
                                    return {
                                        ...old,
                                        error: '',
                                        imageUrl: image
                                    }
                                });
                            }).catch(error =>{
                                setState(o => ({
                                    ...o,
                                    error: error.message
                                }))
                            });
                        }
                    }}
                ></Form.Control>
                <Form.Control.Feedback type="invalid">{state.error || props.errors}</Form.Control.Feedback>
            </span>
        </span>
    </>
}

// Product classifies

const ClassifyProductInput = ({formProps,...props}: ClassifyProductInputProps) =>{
    const [input, setInput] = useDebouncedInput<string>(props.value,{
        debouncedCallback(_, event?) {
            event && formProps.handleChange(event)
        },
    });
    
    React.useEffect(() => {
        setInput(props.value);
    },[props.value])
    return <>
        <div className="product-classify__input">
            <Row className="md-1 sm-1" lg={2}>
                <Form.Group controlId={`classifyProduct${props.index}-name`}
                    as={Col} 
                    md={5}
                >
                    <Row sm={2}>
                        <Form.Label 
                            column 
                            sm={2}
                            xl={3}
                            style={{textAlign: 'right'}}>
                            {`Classify name`}
                        </Form.Label>
                        <Col sm={10} xl={9}>
                            <Form.Control 
                                name={`classifies[${props.index}].name`}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                    setInput(event.currentTarget.value, event);
                                }}
                                isInvalid={
                                    formProps.touched.classifies?.at(props.index)?.name &&
                                    !!(formProps.errors.classifies?.at(props.index) as ProductClassify)?.name}
                                onBlur={formProps.handleBlur}
                                placeholder="Classify Name"
                                value={input}
                            ></Form.Control>
                            <Form.Control.Feedback type="invalid">{(formProps.errors.classifies?.at(props.index) as ProductClassify)?.name}</Form.Control.Feedback>
                        </Col>
                    </Row>
                </Form.Group>

                <Form.Group controlId={`classifyProduct-types`}
                    as={Col}
                    md={7}
                >
                    <FieldArray
                        name={`${props.name}.types`}
                        render={arrayHelpers => {
                            const classifyLst = formProps.values.classifies[props.index].types;
                            return <div>
                                {classifyLst.map((type,index) =>{
                                    const classifyError = (formProps.errors?.classifies?.at(props.index) as ProductClassify)?.types?.at(index);
                                    const classifyTouched = formProps.touched?.classifies?.at(props.index)?.types;
                                    return <div key={index + 1} style={{position: 'relative'}}>
                                        <ClassifyProductTypeInput 
                                            formProps={formProps}
                                            index={index}
                                            name={`${props.name}.types[${index}]`}
                                            value={type}
                                            showRemoveBtn={classifyLst.length > 1}
                                            handleRemoveBtn={() =>{
                                                arrayHelpers.remove(index);
                                            }}
                                            error={classifyError}
                                            touched={classifyTouched}
                                        ></ClassifyProductTypeInput>
                                    </div>
                                })}
                                <Button variant="warning" 
                                    style={{
                                        float: 'right',
                                        color: '#fff',
                                        fontWeight: '600'
                                    }}
                                    onClick={() =>{
                                        arrayHelpers.push("")
                                    }}
                                >
                                    <BiPlusCircle></BiPlusCircle> 
                                    <span style={{verticalAlign: 'middle', textIndent: '0.5rem',display:'inline-block'}}>Add new product classified type</span>
                                </Button>
                            </div>
                        }}
                    />
                </Form.Group>
            </Row>
        </div>
    </>
}

const ClassifyProductTypeInput = ({formProps,...props}:ClassifyProductTypeInputProps) =>{
    const [input, setInput] = useDebouncedInput<string>(
        props.value,
        {
            debouncedCallback:(_, event?)=> {
                event && formProps.handleChange(event)
            },
        });
    React.useEffect(() =>{
        setInput(props.value);
    },[props.value]);
    return <>
        <Form.Group as={Row} 
            className="mb-3 align-items-start" controlId="classifyType">
            <Form.Label column sm='2' style={{textAlign:'right'}}>
                {`Classify type`}
            </Form.Label>
            <Col sm="8">
                <Form.Control 
                    name={`${props.name}`}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>{
                        setInput(event.currentTarget.value, event);
                    }}
                    onBlur={formProps.handleBlur}
                    value={input}
                    isInvalid={props.touched && !!props.error}
                    placeholder={"Classify description" + ` ${props.index + 1}`}
                ></Form.Control>
                <Form.Control.Feedback type="invalid">
                    {props.error}
                </Form.Control.Feedback>
            </Col>
            <Col sm="1">
                {
                props.showRemoveBtn && (
                    <Button variant="danger" 
                        onClick={props.handleRemoveBtn}
                    >
                        <FaTimes></FaTimes>
                    </Button>)
                }
            </Col>
        </Form.Group>
    </>
}

// Product classifies preview

const ClassifyProductPreview = (props: ClassifyProductPreviewProps) =>{
    const [state, setState] = React.useState<ClassifyProductPreviewListState>({
        details: []
    });
    const _isMounted = React.useRef<boolean>(false);
    function transformClassifyListToNodeList(classifyList: string[][], startIndx: number,  prevItemAddress?: number[]): Node[] | null {
        if(!classifyList[startIndx]){
            return null;
        }
        return classifyList[startIndx].map((classify,index) =>{
            const nodeAddress = !!prevItemAddress? [...prevItemAddress, index] : [index];
            const nextNodeList = transformClassifyListToNodeList(classifyList, startIndx + 1, nodeAddress);
        
            const node = new Node(classify, nextNodeList,nodeAddress);
            return node;
        });
    }

    React.useEffect(() =>{
        
        const bodyData = props.data.map(item => item.types);
        _isMounted.current = true;
        if(_isMounted.current){
            setState(o =>{
                const rows = transformClassifyListToNodeList(bodyData, 0) || [];
                const details = rows.reduce((pre: ProductClassifyDetail[], row) => {

                    const detailCollection = row.getLastElementAddresses().map((addressCouple) => { 
                        const updateDetail = props.detailData.find(d => d.tierIndex.every((i,idx) => i === addressCouple[idx]));

                        if(!updateDetail)
                            return {
                                inventory: 0,
                                price: 0,
                                tierIndex: addressCouple
                            } as ProductClassifyDetail;

                        return {
                            ...updateDetail,
                            tierIndex: addressCouple
                        };
                    }) as ProductClassifyDetail[];


                    return [...pre, ...detailCollection];
                }, []) as ProductClassifyDetail[];

                props.onChangeClassifyType && props.onChangeClassifyType(details);

                return {
                    ...o,
                    rows: rows,
                    details: details
                }
            });
        }

        return () =>{
            _isMounted.current = false;
        }
    },[props.data]);

    return <>
        <Row sm={2}>
            <Form.Label column 
                sm={2}
                lg={1}
                style={{
                    textAlign:'right'
                }}
            >Classify details</Form.Label>
            <Col sm={10} style={{
                overflow: 'scroll',
                maxHeight: '50rem',
            }}>
                <table className='classify-product-preview__table' style={{
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
                            <th>image</th>
                        </tr>
                    </thead>
                    <tbody className="classify-product-preview__body">
                        <ClassifyProductPreviewList 
                            fieldName={props.fieldName}
                            rows={state.rows}
                            details={state.details}
                            isNested={false}
                            onChange={props.onChange}
                        ></ClassifyProductPreviewList>
                    </tbody>
                </table>
            </Col>
        </Row>
    </>
}

const ClassifyProductPreviewList = (props: {
    fieldName: string,
    details: ProductClassifyDetail[],
    rows?: Node[],
    rootIndex?: number,
    isNested?: boolean,
    onChange?: (event: React.ChangeEvent<any>) => void;
}) =>{

    if(!props.rows) return null;
    // if(!!props.rows?.[0] && !props.rows[0].nodes){
    //     return <React.Fragment>
    //         {   
    //             props.rows.map((row,index) =>{
    //                 return <tr key={index + 1}>
    //                     <ClassifyProductPreviewCell
    //                         node={row}
    //                         index={index}
    //                         onChange={props.onChange}
    //                     ></ClassifyProductPreviewCell>
    //                 </tr>
    //             })
    //         }
    //     </React.Fragment> 
    // }
    return <React.Fragment>
    {
        props.rows.map((row,index) =>{
            return <ClassifyProductPreviewRow
                    key={index}
                    node={row}
                    details={props.details}
                    index={
                        props.rows?.length
                        ? props.isNested && props.rootIndex !== undefined
                            ?  props.rootIndex + index + 1
                            : row?.nodes?.length
                                ? index * row.nodes.length
                                : index
                        : index
                    }
                    fieldName={`${props.fieldName}`}
                    onChange={props.onChange}
                ></ClassifyProductPreviewRow>
        })
    }
    </React.Fragment>
}

const ClassifyProductPreviewRow = (props: {
    node: Node;
    details: ProductClassifyDetail[],
    index: number;
    fieldName: string;
    onChange?: (event: React.ChangeEvent<any>) => void;
}) =>{
    const {values, errors, touched, handleBlur, setFieldValue} = useFormikContext<FormValues>();
    const [price, setPrice, setOriginalPrice] = useDebouncedInput<number, React.ChangeEvent<HTMLInputElement>>(
        props.details[props.index].price, 
        {
            debouncedCallback(_, event){
                event && props.onChange && props.onChange(event);
            },
        }
    );
    const [inventory, setInventory,setOriginalInventory] = useDebouncedInput<number,React.ChangeEvent<HTMLInputElement>>(
        props.details[props.index].inventory, {
            debouncedCallback(_, event){
                event && props.onChange && props.onChange(event);
            }
    });

    React.useEffect(() =>{
        setOriginalPrice(values.classifyDetails?.[props.index]?.price || 0);
        setOriginalInventory(values.classifyDetails?.[props.index]?.inventory || 0);
    },[values.classifyDetails[props.index]]);

    return <>
        <tr>
            <ClassifyProductPreviewCell
                node={props.node}
                index={props.index}
            ></ClassifyProductPreviewCell>
            <td className="classify-product-preview__cell--input">
                <Form.Control type='number' 
                    name={`${props.fieldName}.${props.index}.price`}
                    value={Number(price).toString()}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        const leadingNumber = parseInt(event.currentTarget.value.replace(/^0+/, ''), 10);
                        setPrice(leadingNumber || 0, event)
                    }}
                    onBlur={handleBlur}
                    placeholder='Price'
                    isInvalid={
                        touched.classifyDetails
                        && touched.classifyDetails?.at(props.index)?.price
                        && errors.classifyDetails 
                        && errors.classifyDetails.at(props.index)
                        && !!(errors.classifyDetails.at(props.index) as FormikErrors<ProductClassifyDetail>).price
                        || false
                    }
                    min={0}
                ></Form.Control>
                <Form.Control.Feedback type="invalid">{
                    errors.classifyDetails && errors.classifyDetails.at(props.index)
                    ? (errors.classifyDetails.at(props.index) as FormikErrors<ProductClassifyDetail>).price
                    : ""
                }</Form.Control.Feedback>
            </td>
            <td className="classify-product-preview__cell--input">
                <Form.Control type='number'
                    name={`${props.fieldName}.${props.index}.inventory`}
                    value={Number(inventory).toString()}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        const leadingNumber = parseInt(event.currentTarget.value.replace(/^0+/, ''), 10);
                        setInventory(leadingNumber || 0, event)
                    }}
                    onBlur={handleBlur}
                    placeholder='Inventory'
                    min={0}
                    isInvalid={
                        touched.classifyDetails
                        && touched.classifyDetails?.at(props.index)?.inventory
                        && errors.classifyDetails 
                        && !!errors.classifyDetails.at(props.index)
                        && !!(errors.classifyDetails.at(props.index) as FormikErrors<ProductClassifyDetail>).inventory
                        || false
                    }
                ></Form.Control>
                <Form.Control.Feedback type="invalid">{
                    errors.classifyDetails && errors.classifyDetails.at(props.index)
                    ? (errors.classifyDetails.at(props.index) as FormikErrors<ProductClassifyDetail>).inventory
                    : ""
                }</Form.Control.Feedback>
            </td>
            <td className="classify-product-preview__cell--input">
                <SingleFileUpload
                    name={`${props.fieldName}.${props.index}.image`}
                    errors={
                        errors.classifyDetails && errors.classifyDetails.at(props.index)
                        ? (errors.classifyDetails.at(props.index) as FormikErrors<ProductClassifyDetail>).image
                        : ""
                    }
                    onChange={(file: File | null) =>{
                        setFieldValue(`${props.fieldName}.${props.index}.image`, file);
                    }}
                ></SingleFileUpload>
            </td>
        </tr>
        {
            <ClassifyProductPreviewList
                rows={props.node?.nodes?.filter((_,index) => !!index)}
                fieldName={props.fieldName}
                rootIndex={props.index}
                isNested={true}
                details={props.details}
                onChange={props.onChange}
            ></ClassifyProductPreviewList>
        }
    </>
}

const ClassifyProductPreviewCell = (props: {
    node?: Node;
    index: number;
}) =>{

    if(!props.node) return <td className="classify-product-preview__cell">Name</td>;

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
                index={props.index + 1}
            ></ClassifyProductPreviewCell> 
        }
    </>
}


class Node {
    value: any;
    nodes: Node[] | null;
    address: number[];

    constructor(value: any, tails: Node[] | null, address: number[]) {
        this.value = value;
        this.nodes = tails;
        this.address = address;
    }

    public countChildren(): number {
        const currentTailNodeLength = this.nodes?.length || 0;

        const nestedTailNodes = this.nodes
            ? this.nodes.reduce(
                  (p: number, n: Node) => p + n.countChildren(),
                  0
              )
            : 0;

        return currentTailNodeLength + nestedTailNodes;
    }

    public countLastNodes(): number {
        if (this.nodes)
            return this.nodes.length * this.nodes[0].countLastNodes();
        return 1;
    }

    public getLastElementAddresses(): number[][] {
        if (!this.nodes) {
            return [this.address];
        }
        return this.nodes.reduce((prev: number[][], node) => {
            return [...prev, ...node.getLastElementAddresses()];
        }, []);
    }
}

type ProductClassify = {
    name: string;
    types: string[];
};

type ProductClassifyDetail = {
    image: File;
    tierIndex: number[];
    price: number;
    inventory: number;
};

interface FormValues {
    name: string;
    price: number;
    inventory: number;
    inPages: boolean;
    description: string;
    userPageId: number;
    files?: File[];
    categoryIds: SelectCategoryValues[];
    classifies: ProductClassify[];
    classifyDetails: ProductClassifyDetail[];
    reserve: boolean;
    itemStatus: 0 | 1;
}

// Form Display
interface PostProductState {
    loading: boolean;
    error: string;
    currentStep: number;
}

interface PostProductEntryProps {
    formProps: FormikProps<FormValues>;
    children?: React.ReactNode;
    onClick?: () => void;
}

interface SelectCategoryInputProps {
    formProps: FormikProps<FormValues>;
    children?: React.ReactNode;
    isValid?: (isValid: boolean) => void;
}

type SelectCategoryValues = {
    id: number;
    name: string;
    level: string;
    parentId: number;
    subCategoryCount: number;
    subCategories?: SelectCategoryValues[];
};

type SelectCategoryListProps = {
    originalData: SelectCategoryValues[];
    categories: SelectCategoryValues[];
    level: number;
    selectedCategories: Map<number, SelectCategoryValues>;
    fetchSubCategories: (
        parentId: number,
        level: number,
        array: SelectCategoryValues[]
    ) => Promise<Array<SelectCategoryValues>>;
    getSelectedCategories: (
        selectedItems: Map<number, SelectCategoryValues>,
        permitNext: boolean
    ) => void;
};

type SelectCategoryListState = {
    data: SelectCategoryValues[];
    selectedCategory: SelectCategoryValues | null;
    selectedCategories: Map<number, SelectCategoryValues> | null;
};

interface PostProductDetailProps {
    formProps: FormikProps<FormValues>;
    children?: React.ReactNode;
    onCancel?: () => void;
    onSaveAndHide?: () => void;
    onUpdate?: () => void;
}

type PostProductDetailState = {
    priceTemp: number;
    inventoryTemp: number;
};

interface MultipleFileUploadProps {
    name: string;
    initialFiles: File[] | string[];
    onChangeMultiple: (files: (File | null)[]) => void;
    isInvalid?: boolean;
    errors?: string;
    formProps?: FormikProps<FormValues>;
}

type MultipleFileUploadState = {
    images: (File | string | null)[];
    currentIndex: number;
    showCrop: boolean;
    error?: string | null;
};

interface SingleFileUploadProp {
    initialImage?: string | File;
    name: string;
    isInvalid?: boolean;
    errors?: any;
    onChange?: (image: File | null) => void;
    onError?: (error: string) => void;
}

type SingleFileUploadState = {
    imageUrl?: string | File;
    showCrop?: boolean;
    error: string;
};

interface ClassifyProductInputProps {
    formProps: FormikProps<FormValues>;
    name: string;
    index: number;
    value: any;
}

interface ClassifyProductTypeInputProps {
    formProps: FormikProps<FormValues>;
    touched?: boolean;
    error?: string;
    showRemoveBtn?: boolean;
    handleRemoveBtn: () => void;
    name: string;
    index: number;
    value: any;
}

interface ClassifyProductPreviewProps {
    data: ProductClassify[];
    detailData: ProductClassifyDetail[];
    fieldName: string;
    onChange?: (event: React.ChangeEvent<any>) => void;
    onChangeClassifyType?: (values: ProductClassifyDetail[]) => void;
}

type ClassifyProductPreviewListState = {
    rows?: Node[];
    details: ProductClassifyDetail[];
};