import React from 'react'
import { FormSelect, Row, Col, Stack } from 'react-bootstrap';
import axios from 'axios';
import { To, useLocation, useSearchParams } from 'react-router-dom';
import { useTypedSelector, useActions } from '../../hooks';
import { AiOutlineRight } from 'react-icons/ai';
import { CustomLink, Input, Rating } from '../../components';
import { HiViewGrid, HiViewList } from 'react-icons/hi';
import { GetProductResponseDTO } from '../../models';
import { Product } from '../../containers';


export function ProductFilter() {
    const {data: {categoryList}, error: categoryError} = useTypedSelector(s => s.category);
    const {getCategoryList, getProductByCategory} = useActions();
    const location = useLocation();
    const locationState: LocationState = location.state as LocationState;
    const [searchParams] = useSearchParams();
    const [products, setProducts] = React.useState<GetProductResponseDTO[]>([]);
    const [view, setView] = React.useState<FilterView>(FilterView.GRID_VIEW);
    const [sortType, setSortType] = React.useState<SortType>(SortType.LATEST_ITEM);


    // Identify the ancestor of location
    React.useEffect(() => {
      const cancelToken = axios.CancelToken.source();

      const searchQuery = searchParams.get("category_id");

      if(searchQuery){
        const categoryId = parseInt(searchQuery);
        const foundCategory = categoryList.find(c => c.id === categoryId);
        const productList = foundCategory?.productList || [];
        
        if(foundCategory && (foundCategory.productAmount < 0 || productList.length < foundCategory?.productAmount)){
          getProductByCategory(categoryId, {
            page: foundCategory.page,
            take: foundCategory.take,
            categoryId: categoryId
          }, {
            cancelToken: cancelToken.token
          });
        }

        setProducts(productList);
      }

      return () =>{
        cancelToken.cancel();
      }
    }, [location,locationState, categoryList]);

    React.useEffect(() => {
      const cancelSource = axios.CancelToken.source();
      if(categoryList.length == 0 && !categoryError){
        getCategoryList({
          cancelToken: cancelSource.token
        });
      }
      return () => {
        cancelSource.cancel();
      }
    }, [categoryList]);

    React.useEffect(() => {
      sortProductList(sortType as SortType);
    },[sortType]);
    
    function sortProductList(type: SortType){
      setProducts(list =>{
        switch (type) {
          case SortType.BEST_SELLING:
            return list.sort((a,b) => a.soldQuantity - b.soldQuantity);

          case SortType.ALPHA_ASC:
            return list.sort((a,b) => {
              const nameA = a.name.toUpperCase(); // ignore upper and lowercase
              const nameB = b.name.toUpperCase(); // ignore upper and lowercase

              if (nameA < nameB) {
                return -1;
              }
              if (nameA > nameB) {
                return 1;
              }

              // names must be equal
              return 0;
            });

          case SortType.ALPHA_DES:
            return list.sort((a,b) => {
                const nameA = a.name.toUpperCase(); // ignore upper and lowercase
              const nameB = b.name.toUpperCase(); // ignore upper and lowercase

              if (nameA < nameB) {
                return 1;
              }
              if (nameA > nameB) {
                return -1;
              }

              // names must be equal
              return 0;
            });
        
          // case SortType.BY_REVIEW:
          //   return list.sort((a,b) => a.description - b.description);

          case SortType.PRICE_ASC:
            return list.sort((a,b) => a.price - b.price);

          case SortType.PRICE_DESC:
            return list.sort((a,b) => b.price - a.price);

          default:
            return list.sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        }
      });
    }

  return (
    <>
      <section>
        <header style={{
          width: '100%',
          height:'3rem',
          background: 'var(--clr-logo)',
          color:'#fff',
          fontWeight:'500',
          padding: '12px',
          display: "inline-block"
        }}>
          <p style={{color: 'inherit'}}>
            {[
              "Product", window.location.hash.substring(1)
            ].join("  ▶ ")}
          </p>
        </header>

        <article>
          <Row>
            <Col sm="auto" style={{
              padding: '12px 20px',
              background: "#fff"
            }}>
              <FilterPanel></FilterPanel>
            </Col>
            <Col>
              <article>
                <h4 className='py-3 px-2 my-2' style={{
                  background:"#fff", borderRadius: '2px', fontWeight:'700', fontStyle: 'italic', textTransform: 'uppercase'
                }}>
                  {window.location.hash.substring(1)}
                </h4>
                <div className='py-2 px-2 my-2' style={{
                  background: "var(--clr-logo)",
                  color: '#fff'
                }}>
                  <span>
                    <Row style={{justifyContent:'between', alignItems:'center'}}>
                      <Col>
                        <span>View as: </span>
                        <Stack direction="horizontal" gap={2} style={{display: 'inline-flex', marginLeft:"12px"}}>
                          <span 
                          onClick={() => setView(FilterView.GRID_VIEW)}
                          style={{
                            padding: '5px',
                            border:"1px solid #fff",
                            lineHeight: 1,
                            display: 'inline-block',
                            cursor: 'pointer'
                          }}>
                            <HiViewGrid></HiViewGrid>
                          </span>
                          <span 
                          onClick={() => setView(FilterView.STACK_VIEW)}
                          style={{
                            padding: '5px',
                            border:"1px solid #fff",
                            lineHeight: 1,
                            display: 'inline-block',
                            cursor: 'pointer'
                          }}>
                            <HiViewList></HiViewList>
                          </span>
                        </Stack>
                      </Col>
                      <Col>
                        <div style={{float: 'right'}}>
                          <span>Sort by:</span>
                          <FormSelect style={{display:"inline-block", width: '220px', marginLeft:'12px'}} 
                          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>{
                            setSortType(e.target.value as SortType);
                          }}>
                            <option value={SortType.LATEST_ITEM}>Newest Items</option>
                            <option value={SortType.BEST_SELLING}>Best Selling</option>
                            <option value={SortType.ALPHA_ASC}>A to Z</option>
                            <option value={SortType.ALPHA_DES}>Z to A</option>
                            <option value={SortType.BY_REVIEW}>By Review</option>
                            <option value={SortType.PRICE_ASC}>Price: Ascending</option>
                            <option value={SortType.PRICE_DESC}>Price: Descending</option>
                          </FormSelect>
                        </div>
                      </Col>
                    </Row>
                  </span>
                </div>
              </article>
              <div>
                {
                view === FilterView.GRID_VIEW &&
                <>
                  <Product.ProductList productList={products} 
                  rowProps={{
                    xs: '1',
                    sm: '2',
                    md: '2',
                    lg: '3',
                    xl: '4',
                    xxl: '4'
                  }}
                  colProps={{
                    xs: 'auto',
                    sm: 'auto'
                  }}
                  ></Product.ProductList>
                </> ||
                <Stack direction={'vertical'}>
                  {products.map((product,index) =>{
                    return <span key={index + 1}>
                        <Product.SingleProduct productItem={product} view="stack"></Product.SingleProduct>
                      </span>
                  })}
                </Stack>
                }
              </div>
            </Col>
          </Row>
        </article>
      </section>
    </>
  )
}

const FilterPanel = () => {
  const {data: {categoryList}} = useTypedSelector(s => s.category); 
  return <aside style={{
    width: "20%",
    minWidth: "260px",
    display: 'inline-block'
  }}>
    <FilterPanelCatalog title={"Categories"} 
      filterValue={{
        type: FilterType.LIST_VIEW,
        values: categoryList.filter(c => c.level === 0).map(c => ({
          title: c.name,
          value: c.id.toString(),
          link: {
              pathname: "/product",
              search: `?category_id=${c.id}`,
              hash: `#${c.name}`,
          },
          subs: categoryList.filter(c => c.parentId === c.id).map(sc1 => {
            return {
              title: sc1.name,
              value: sc1.id.toString(),
            }
          }),
        }))
      }}></FilterPanelCatalog>

    <FilterPanelCatalog title={"Shop By Price"} filterValue={{
      type: FilterType.PRICE_RANGE,
      min: 1000,
      max: 12000,
      default: 10000
    }}></FilterPanelCatalog>

    <FilterPanelCatalog title={"Reviews"} filterValue={{
      type: FilterType.RATE
    }}></FilterPanelCatalog>

    {/* <FilterPanelCatalog title={"Purchased"} filterValue={{
      type: FilterType.RATE
    }}></FilterPanelCatalog> */}

    <div className='p-2 my-3' data-text-align="middle" data-pointer style={{background: 'var(--clr-logo)', color: "#fff", borderRadius: '2px'}}>
      <>Apply</>
    </div>
    {/* <FilterPanelCatalog title={"Brands"} filterValue={{
      type: FilterType.LIST_VIEW,
      values: [{
        title: 'Gucci',
        value: "0"
      }]
    }}></FilterPanelCatalog> */}
  </aside>
}

const FilterPanelCatalog = (props: FilterPanelCatalogProps) =>{

  return <div className='py-2' style={{
    borderTop: "1px solid #000",
  }}>
    <h4 style={{
      textTransform: 'uppercase'
    }} className="p-2">{props.title}</h4>

    <article className='px-3'>
      {
        // props.filterValue.type === FilterType.LIST_VIEW
        props.filterValue.type === FilterType.LIST_VIEW ? 
        (<Stack gap={3}>
          {props.filterValue.values.map((filter,index) =>{
            return <div key={index + 1} style={filter.style}>
              {!!filter.link ?
              <CustomLink to={filter.link}>
                <span style={{fontSize:'0.8rem'}}>{filter.title}</span>
              </CustomLink>: 
              <span style={{fontSize:'0.8rem'}}>{filter.title}</span>}
              {!!filter.subs?.length && <i style={{float:'right'}}><AiOutlineRight></AiOutlineRight></i>}
            </div>
          })}
        </Stack>)
        : props.filterValue.type === FilterType.PRICE_RANGE ? 
        (<Stack className="py-2">
          <Input.MultiRangeSlider min={props.filterValue.min}
            max={props.filterValue.max}
            onChange={(min, max) =>{
            }}></Input.MultiRangeSlider>
        </Stack>)
        : (<Stack className="py-2">
          {Array.from(Array(5).keys()).map(value => {
            return (<Row>
              <Col>
                <Rating.Star percentage={(5 - value) * 20}></Rating.Star>
              </Col>
              <Col>
                <span className="ms-2">{value + 1}</span>
              </Col>
            </Row>)
          })}
        </Stack>)
      }
    </article>
  </div>
}

type LocationState = {
  from: string;
} | {
  fromNavigation: boolean;
  categoryId: number;
};

enum FilterView {
  GRID_VIEW = 'grid',
  STACK_VIEW = "stack"
}

enum SortType {
  LATEST_ITEM = 'Newest Items',
  BEST_SELLING = "Best Selling",
  ALPHA_ASC = "A to Z",
  ALPHA_DES = "Z to A",
  BY_REVIEW = "By Review",
  PRICE_ASC = "Price: Ascending",
  PRICE_DESC = "Price: Descending"
}


enum FilterType {
  LIST_VIEW,
  PRICE_RANGE,
  RATE
}

type FilterPanelCatalogProps = {
  title : string;
  filterValue: {
    type: FilterType.LIST_VIEW,
    values: FilterValue[];
  } | FilterPriceValue | FilterRateValue;
}

type FilterValue = {
  title: string;
  value: string;
  link?: To | string;
  style?: React.CSSProperties;
  subs?: FilterValue[];
}

type FilterPriceValue = {
  type: FilterType.PRICE_RANGE;
  min: number;
  max: number;
  default?: number;
}

type FilterRateValue = {
  type: FilterType.RATE,
  // value?: number
}

