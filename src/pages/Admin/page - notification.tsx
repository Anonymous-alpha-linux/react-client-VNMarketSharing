import { Col, Image, Row } from 'react-bootstrap'
import { timeDifferenceString } from '../../utils'
import moment from 'moment';

const data = [
        {
            title: 'Nguyen Van A',
            message: 'Posted a new product',
            date: moment().subtract(2, 'minutes').calendar(),
            avatar: 'https://khoinguonsangtao.vn/wp-content/uploads/2022/06/hinh-avatar-hai-khuon-mat-kho-do-cua-chu-meo.jpg'
        },
        {
            title: 'Nguyen Van A',
            message: 'Posted a new product',
            date: moment().subtract(2, 'days').calendar(),
            avatar: 'https://khoinguonsangtao.vn/wp-content/uploads/2022/06/hinh-avatar-hai-khuon-mat-kho-do-cua-chu-meo.jpg'
        },
        {
            title: 'Nguyen Van A',
            message: 'Posted a new product',
            date: moment().subtract(15, 'days').calendar(),
            avatar: 'https://khoinguonsangtao.vn/wp-content/uploads/2022/06/hinh-avatar-hai-khuon-mat-kho-do-cua-chu-meo.jpg'
        },
        {
            title: 'Nguyen Van A',
            message: 'Posted a new product',
            date: moment().subtract(15, 'days').calendar(),
            avatar: 'https://khoinguonsangtao.vn/wp-content/uploads/2022/06/hinh-avatar-hai-khuon-mat-kho-do-cua-chu-meo.jpg'
        },
        {
            title: 'Nguyen Van A',
            message: 'Posted a new product',
            date: moment().subtract(15, 'days').calendar(),
            avatar: 'https://khoinguonsangtao.vn/wp-content/uploads/2022/06/hinh-avatar-hai-khuon-mat-kho-do-cua-chu-meo.jpg'
        },
        {
            title: 'Nguyen Van A',
            message: 'Posted a new product',
            date: moment().subtract(15, 'days').calendar(),
            avatar: 'https://khoinguonsangtao.vn/wp-content/uploads/2022/06/hinh-avatar-hai-khuon-mat-kho-do-cua-chu-meo.jpg'
        },
        {
            title: 'Nguyen Van A',
            message: 'Posted a new product',
            date: moment().subtract(15, 'days').calendar(),
            avatar: 'https://khoinguonsangtao.vn/wp-content/uploads/2022/06/hinh-avatar-hai-khuon-mat-kho-do-cua-chu-meo.jpg'
        },
    ]

export function NotificationPage() {
  return (
    <section className='p-4'>
        <article>
            <h3>Notification List</h3>
        </article>
        <article>
            {data.map((sub,index) =>{
                return <div key={index}>
                    <Row className="ad-nav__submenu--item p-2" data-pointer xs={2} sm={2}>
                        <Col xs={"auto"} sm="auto">
                            <Image src={sub.avatar} style={{width: '40px'}} roundedCircle></Image>
                        </Col>
                        <Col>
                            <div className="ad-nav__submenu--line">
                                <span className="ad-nav__submenu--title">{sub.title}</span>
                                {" "}
                                <i className="ad-nav__submenu--message" title={sub.message}>{sub.message}</i>
                            </div>
                            <div>
                                <p>{timeDifferenceString(sub.date, new Date())}</p>
                            </div>
                        </Col>
                    </Row>
                </div>
            })}
        </article>
    </section>
  )
}