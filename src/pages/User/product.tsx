import { Carousel, Button, Row, Col } from 'react-bootstrap';
import { useMediaQuery } from 'react-responsive';
import { Slider } from '../../components';
import { useTypedSelector } from '../../hooks';
import { Product } from '../../containers';
const defaultAvatar = 'https://cdn.sforum.vn/sforum/wp-content/uploads/2021/07/cute-astronaut-wallpaperize-amoled-clean-scaled.jpg';

export function ProductPage() {
    const {data: {productList}} = useTypedSelector(s => s.product);
    const {data: {categoryList}} = useTypedSelector(s => s.category);
    const headerImages = [
        'https://img.freepik.com/premium-vector/extra-discount-3d-sale-banner-template-design-background_416835-436.jpg?w=2000',
        'https://img.freepik.com/premium-vector/super-sale-extra-discount-banner-template-design-background_416835-461.jpg?w=2000',
        'https://img.freepik.com/premium-vector/extra-discount-3d-sale-banner-template-design-background_416835-543.jpg?w=2000',
    ]


    return <section style={{
        width: '100%',
        maxWidth: '2320px',
        margin: '0 auto'
    }}>
        {/* Hero */}
        <section>
            <Carousel>
                {headerImages.map((image,index) =>{
                    return <Carousel.Item key={index}>
                        <div style={{
                            background: `url(${image}) center / cover no-repeat`,
                            width: '100%',
                            height: '900px',
                            maxHeight: '920px'
                        }}></div>
                        <Carousel.Caption>
                            <Button>Shop now</Button>
                        </Carousel.Caption>
                    </Carousel.Item>  
                })}
            </Carousel>
        </section>

        {/* Category Trending */}
        <section className='p-5' id={"categoryTrending"}>
            <Row xs={1} sm={2} md={3}>
                {categoryList.slice(0, 3).map((category, index) =>{
                    return <Col key={index + 1} className="mb-3" style={{overflow:"hidden"}}>
                        <div className="productPage__card" 
                            style={{
                            background: `url(${defaultAvatar}) center / 100% no-repeat`,
                            
                        }}>
                            {category.name}
                        </div>
                    </Col>
                })}
            </Row>
        </section>

        {/* Product show */}
        <section className='py-3 px-5' id={"productShowcase"}>
            <article style={{textAlign: 'center',padding:'3rem', borderTop: '1px solid #f1f1f1'}}>
                <h2>Just arrived</h2>
                <i>We bring some mysterious stuff for you, let try it!</i>
            </article>
            <article className='mb-3'>
                <Slider dataNumber={productList.length} 
                    itemAmountPerTime={3}
                    loadNextItemAmount={1}
                    autoPlayTimeout={3000}
                    itemArray={productList}
                    className="row row-cols-sm-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4"
                    cardNode={(item) => <>
                        <Product.SingleProduct productItem={item}></Product.SingleProduct>
                    </>}
                ></Slider>
            </article>
            <article id={"productShowcase__unique"}>
                <Row xs={1} sm={2}>
                    {["", ""].map((_,index)=>{
                        return <Col>
                            <div style={{textAlign: 'center'}}>
                                <div className="home__best" style={{
                                    background: `url(${defaultAvatar}) center / 100% no-repeat`,
                                    width: '100%',
                                    height: '320px',
                                    position: 'relative'
                                }}>
                                    <div className="caption" style={{
                                        background: '#f1f1f1',
                                        boxShadow: '0 0 12px 12px #f1f1f1',
                                        display: 'inline-block',
                                        padding: '0 12px',
                                        width: 'auto',
                                        margin: '0 auto',
                                        textAlign: 'center',
                                        fontWeight: 900,
                                        border: '1px solid black',
                                        position: 'absolute',
                                        left: '50%',
                                        transform: 'translate(-50%)',
                                        bottom: '12px'
                                    }}>#TREND: MILACEOUS</div>
                                </div>
                                <p style={{ color: '#000', fontWeight:'500' }}>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nihil delectus quae vitae eveniet iure eos cupiditate fugit error? Natus officiis harum beatae perspiciatis perferendis nobis facilis consectetur blanditiis in delectus.</p>
                                <Button> SHOP NOW</Button>
                            </div>
                        </Col>
                    })}
                </Row>
            </article>
        </section>

        {/* Product offer */}
        <section className='py-3'>
            <article style={{textAlign: 'center', padding:'3rem', borderTop: '1px solid #f1f1f1'}}>
                <h2>Offer for you</h2>
                <i>Quickly get your opportunity</i>
            </article>
            <article className="p-5">
                <Row>
                    {Array.from(Array(5).keys()).map((_, index) =>{
                        return <Col key={index + 1}>
                            <div>
                                <h4>Offer {index + 1}</h4>
                                <i>Decrease 40%</i>
                                <p style={{
                                    cursor:'pointer'
                                }}>
                                    Shop
                                </p>
                                <div>
                                    
                                </div>
                            </div>
                        </Col>
                    })}
                </Row>
            </article>
        </section>

        {/* Top Category List */}
        <section className='py-3'>
            <article style={{textAlign: 'center', padding:'3rem', borderTop: '1px solid #f1f1f1'}}>
                <h2>Top Rating Category</h2>
                <i>Let enjoy our smoothly things</i>
            </article>
            <article>
                <Row className="px-5">
                    {categoryList.filter(c => c.level === 0).map(c =>{
                        return <Col>
                            <span style={{textAlign: 'center', 
                                display: 'inline-block', 
                                width:"100%", 
                                borderRadius:"4px", 
                                boxShadow:'1px 1px 1px 1px #000, -1px 2px 3px #000', 
                                padding: '1rem 1.2rem', 
                                fontWeight: '600',
                                cursor:'pointer'
                            }}>
                                {c.name}
                            </span>
                        </Col>
                    })}
                </Row>
            </article>
        </section>

        <section className='py-3'>
            <article style={{textAlign: 'center', padding:'3rem', borderTop: '1px solid #f1f1f1'}}>
                <h2>Shop Our Top Brands</h2>
            </article>
            <article className='px-5'>
                <Row>
                    <Col>Gucci</Col>
                    <Col>Channel</Col>
                    <Col>Channel</Col>
                </Row>
            </article>
        </section>

        <section className='py-3'>
            <article style={{textAlign: 'center', padding:'3rem', borderTop: '1px solid #f1f1f1'}}>
                <h2>Proposal Products</h2>
                <i>Our product maybe bring your experimental</i>
            </article>
            <article>
                <Product.ProductList productList={productList.slice(0,30)}></Product.ProductList>
            </article>
        </section>
    </section>
}