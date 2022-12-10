import { Stack, Row, Col } from "react-bootstrap"
import { AiOutlineCreditCard, AiOutlineShoppingCart } from "react-icons/ai"
import { FaUsers } from "react-icons/fa"
import { MdOutlineLocalAtm } from "react-icons/md"
import { TbDiscount } from "react-icons/tb"

export const UserDashboard = () =>{
    return (<>
        <Stack direction={"vertical"} 
            className="col-md-7 p-5 mx-auto align-items-md-center"
            style={{background: "#fff"}}
            gap={3}>
                <div className="p-3 w-100" data-text-align="center">
                    <h3>Dashboard</h3>
                    <i>Check our familiar</i>
                </div>
                <Row className="w-100">
                    <Col xs="6" sm="6" md="5" lg="6">
                        <span className="me-2"style={{verticalAlign: 'text-bottom'}}><AiOutlineShoppingCart></AiOutlineShoppingCart></span>
                        <h4 style={{textAlign: 'right', display:'inline-block', float: 'right'}}>
                            Order Total
                        </h4>
                    </Col>
                    <Col>
                        34
                    </Col>
                </Row>

                <Row className="w-100">
                    <Col xs="6" sm="6" md="5" lg="6">
                        <span className="me-2"style={{verticalAlign: 'text-bottom'}}><AiOutlineCreditCard></AiOutlineCreditCard></span>
                        <h4 style={{textAlign: 'right', display:'inline-block', float: 'right'}}>
                            Credit Total
                        </h4>
                    </Col>
                    <Col>
                    {Number(60000).toLocaleString("en-US")}
                    </Col>
                </Row>

                <Row className="w-100">
                    <Col xs="6" sm="6" md="5" lg="6">
                        <span className="me-2"style={{verticalAlign: 'text-bottom'}}><FaUsers></FaUsers></span>
                        <h4 style={{textAlign: 'right', display:'inline-block', float: 'right'}}>
                            Reputation
                        </h4>
                    </Col>
                    <Col>
                        80 / 100
                    </Col>
                </Row>

                <Row className="w-100">
                    <Col xs="6" sm="6" md="5" lg="6">
                        <span className="me-2" style={{verticalAlign: 'text-bottom'}}><MdOutlineLocalAtm></MdOutlineLocalAtm></span>
                        <h4 style={{textAlign: 'right', display:'inline-block', float: 'right'}}>
                            Purchased Expense
                        </h4>
                    </Col>
                    <Col>
                        {Number(329900000).toLocaleString("en-US")} VND
                    </Col>
                </Row>

                <Row className="w-100">
                    <Col xs="6" sm="6" md="5" lg="6">
                        <span className="me-2"style={{verticalAlign: 'text-bottom'}}><TbDiscount></TbDiscount></span>
                        <h4 style={{textAlign: 'right', display:'inline-block', float: 'right'}}>
                            Coupon Number
                        </h4>
                    </Col>
                    <Col>
                        {339}
                    </Col>
                </Row>
            </Stack>
    </>)
}