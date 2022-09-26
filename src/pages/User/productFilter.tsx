import React from 'react'
import { FormSelect, Row, Col, Stack } from 'react-bootstrap';
import axios from 'axios';
import { To, useLocation, useSearchParams } from 'react-router-dom';
import { useTypedSelector, useActions } from '../../hooks';
import { AiOutlineRight } from 'react-icons/ai';
import { CustomLink, Input } from '../../components';
import { HiViewGrid, HiViewList } from 'react-icons/hi';
import { GetProductResponseDTO } from '../../models';
import { Product } from '../../containers';


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
            ].join(" > ")}
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
                <h2 style={{margin:'12px 0',padding: '12px 12px', background:"#fff", borderRadius: '2px', fontWeight:'700', fontStyle: 'italic'}}>
                  {window.location.hash.substring(1)}
                </h2>
                <div style={{
                  background: "var(--clr-logo)",
                  padding: '1.2rem 20px',
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
                <Row xs={1} sm={2} md={3} lg={4} xl={5}>
                  {products.map((product,index) =>{
                    return <Col key={index + 1}>
                        <Product.SingleProduct productItem={product} view='grid'></Product.SingleProduct>
                      </Col>
                  })}
                </Row> ||
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
    width: '320px',
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

    <FilterPanelCatalog title={"Brands"} filterValue={{
      type: FilterType.LIST_VIEW,
      values: [{
        title: 'Gucci',
        value: "0"
      }]
    }}></FilterPanelCatalog>
  </aside>
}

enum FilterType {
  LIST_VIEW,
  PRICE_RANGE
}

type FilterPanelCatalogProps = {
  title : string;
  filterValue: {
    type: FilterType.LIST_VIEW,
    values: FilterValue[]
  } | FilterPriceValue;
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

const FilterPanelCatalog = (props: FilterPanelCatalogProps) =>{

  return <div style={{
    borderTop: "1px solid #000",
    padding: '20px 12px 10px 12px'
  }}>
    <h3 style={{
      textTransform: 'uppercase'
    }}>{props.title}</h3>

    <article>
      {
        props.filterValue.type === FilterType.LIST_VIEW
        ? <Stack gap={3}>
          {props.filterValue.values.map((filter,index) =>{
            return <div key={index + 1} style={filter.style}>
              {!!filter.link ?
              <CustomLink to={filter.link}>
                <span>{filter.title}</span>
              </CustomLink>: 
              <span>{filter.title}</span>}
              {!!filter.subs?.length && <i style={{float:'right'}}><AiOutlineRight></AiOutlineRight></i>}
            </div>
          })}
        </Stack>
        : <Stack>
          <Input.MultiRangeSlider min={props.filterValue.min}
            max={props.filterValue.max}
            onChange={(min, max) =>{

            }}></Input.MultiRangeSlider>
        </Stack>
      }
    </article>
  </div>
}
