import { Badge, Col, Row } from 'react-bootstrap';
import { MenuBarProvider } from './context - menubar';
import './index.css';

export function MenuBar<Values extends MenuBarValues>(props: MenuBarProps<Values>) {
    return (
        <MenuBarProvider {...props}>
            {(values) =>{
                let top = values.location[values.currentIndex]?.top + (values.menu[values.currentIndex]?.additionalBottom || 0) || 0;
                return <section style={{height: '100%', display: 'inline-block'}}>
                    <article className="menu-bar__flex">
                        {
                            values.menu.map((i, index) =>{
                                return (
                                    <div className='menu-bar__item'
                                        key={index}
                                        onMouseLeave={(e) => {
                                            setTimeout(() =>{
                                                values.closeSubmenu(e, index)
                                            }, 100);
                                        }}>
                                        <span className="menu-bar__item--inner"
                                            onClick={(e) =>{
                                                if(props.clickedAction){
                                                    values.displaySub ? values.closeSubmenu(e, index) : values.openSubmenu(e, index);
                                                }
                                            }}
                                            onMouseOver={(e) => {
                                                if(!props?.clickedAction){
                                                    values.openSubmenu(e , index);
                                                }
                                            }}>
                                            <div className='menu-bar__trigger' data-pointer>
                                                {i.trigger}
                                            </div>
                                            <div className="menu-bar__badge">
                                                {props.badge}
                                            </div>
                                            {i.title && <p className='menu-bar__title'>{i.title}</p>}
                                        </span>
                                        <article className='submenu__root' data-show={values.displaySub} style={{
                                            // display: values.displaySub ? 'block' : 'none',
                                            paddingTop: top,
                                            left: values.location[values.currentIndex]?.center + 20 || 0,
                                            transform: `translateX(${values?.position === 'center' ? "-50%" :
                                                                        values?.position === 'left' ? "0" :
                                                                    "-100%"})`,
                                            maxHeight: `${props?.maxHeight || 920}px`,
                                        }}>    
                                            <div className='submenu__inner' 
                                            data-show={values.displaySub}
                                            style={{
                                                // left: values.location[values.currentIndex]?.center || 0,
                                                // transform: `translateX(${values?.position === 'center' ? "-50%" :
                                                //                         values?.position === 'left' ? "0" :
                                                //                     "-100%"})`,
                                                overflowY: props?.overflowScrolled ? "scroll" : 'hidden',
                                            }}>
                                                {props?.children?.(values) || (
                                                    <SubMenu 
                                                        show={true}
                                                        center={values.location[values.currentIndex]?.center || 0}
                                                        top={values.location[values.currentIndex]?.top + (values.menu[values.currentIndex]?.additionalBottom || 0) || 0}
                                                        subs={values.menu[values.currentIndex].subs}></SubMenu>
                                                )}
                                            </div>
                                        </article>
                                    </div>
                                )
                            })
                        }
                    </article>
                </section>
            }}
        </MenuBarProvider>
    )
}

function SubMenu(props: MenuBarLocation & {subs: MenuBarValues[]; show: boolean; }){
    return <div style={{
        left: props.center,
        position: 'absolute'
    }}>
        <Row className="submenu__line" xs={2} sm={2} md={3}>
            {props.subs.map(sub =>{
                return typeof sub === 'object' ? 
                (<Col>
                    <span>
                        {sub.title}
                    </span>
                </Col>) : 
                (<Col>
                    <span>{sub}</span>
                </Col>)
            })}
        </Row>
    </div>
}
