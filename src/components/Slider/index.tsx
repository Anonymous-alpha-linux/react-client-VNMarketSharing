import React from 'react'
import { Col, Row } from 'react-bootstrap';
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';
import './index.css';
import { screenType, useResponsive } from '../../hooks';

enum SliderCartPosition {
    FIRST = "first",
    IN = "in",
    OUT_LEFT = "out left",
    OUT_RIGHT = "out right",
    LAST = "last"
}

export function Slider<ItemType>(props: SliderProps<ItemType>) {
    const [state, prev, next] = useSliderPaging(props);
    const [isClicked, setHasClicked] = React.useState<boolean>(false);
    const ref = React.useRef<(HTMLSpanElement | null)[]>([]);

    React.useEffect(() =>{
        let interval : NodeJS.Timer | null = null;
        let timeout: NodeJS.Timeout | null = null;
        
        if(interval){
            clearInterval(interval);
        }

        if(timeout){
            clearTimeout(timeout);
        }

        if(isClicked){
            timeout = setTimeout(() => {
                setHasClicked(false);
            }, 1000);
        }

        if(props.autoPlayTimeout && state.dataNumber && !isClicked){
            interval = setInterval(() => {
                next();
            }, props.autoPlayTimeout);
        }

        return () =>{
            if(timeout){
                clearTimeout(timeout);
            }
            if(interval){
                clearInterval(interval);
            }
        }
    },[props, isClicked]);

    React.useEffect(() =>{
        actionCatcher();
        
        return () =>{
            removeAction();
        }
    }, [])

    function actionCatcher() {
        ref.current?.forEach(element =>{
            element?.addEventListener("mousemove", () =>{
                setHasClicked(false);
            });
            element?.addEventListener("mouseleave", () => {
                setHasClicked(true);
            })
        })
    }

    function removeAction(){
        ref.current.forEach(element =>{
            if(element){
                let new_element = element?.cloneNode(true);
                element?.parentNode?.replaceChild(new_element, element);
            }
        });
    }
        
    return (
        <div className="product-slider__root">
            <div className="product-slider__container">
                <div className="product-slider__blur"></div>
                <Row xs={(props?.responsive?.xs?.itemAmountPerTime || props.itemAmountPerTime) % 12}
                    sm={(props?.responsive?.sm?.itemAmountPerTime || props?.responsive?.xs?.itemAmountPerTime || props.itemAmountPerTime) % 12} 
                    md={(props?.responsive?.md?.itemAmountPerTime || props?.responsive?.sm?.itemAmountPerTime || props?.responsive?.xs?.itemAmountPerTime || props.itemAmountPerTime) % 12}
                    lg={(props?.responsive?.lg?.itemAmountPerTime || props?.responsive?.md?.itemAmountPerTime || props?.responsive?.sm?.itemAmountPerTime || props?.responsive?.xs?.itemAmountPerTime || props.itemAmountPerTime) % 12}
                    xl={(props?.responsive?.xl?.itemAmountPerTime || props?.responsive?.lg?.itemAmountPerTime || props?.responsive?.md?.itemAmountPerTime || props?.responsive?.sm?.itemAmountPerTime || props?.responsive?.xs?.itemAmountPerTime || props.itemAmountPerTime) % 12}
                    xxl={(props?.responsive?.xxl?.itemAmountPerTime || props?.responsive?.xl?.itemAmountPerTime || props?.responsive?.lg?.itemAmountPerTime || props?.responsive?.md?.itemAmountPerTime || props?.responsive?.sm?.itemAmountPerTime || props?.responsive?.xs?.itemAmountPerTime || props.itemAmountPerTime) % 12}
                    className={'product-slider__showcase' + ` ${props.className}`}>
                    {
                        props.itemArray.map((item,index) =>{
                            let position : SliderCartPosition = index < state.firstSlideItemIndex - 1
                            ? SliderCartPosition.OUT_LEFT
                            : SliderCartPosition.OUT_RIGHT;
                            let redundant = props.itemArray.length % state.showPerPage; 

                            if(index >= state.firstSlideItemIndex && index <= state.lastSlideItemIndex){
                                position = index === state.firstSlideItemIndex 
                                ? SliderCartPosition.FIRST
                                : index === state.lastSlideItemIndex
                                ? SliderCartPosition.LAST
                                : SliderCartPosition.IN;

                                return <Col as={"span"} key={index + 1}
                                    // xs={12 / (props?.responsive?.xs?.itemAmountPerTime || props.itemAmountPerTime)} 
                                    // sm={12 / (props?.responsive?.sm?.itemAmountPerTime || props.itemAmountPerTime)} 
                                    // md={12 / (props?.responsive?.md?.itemAmountPerTime || props.itemAmountPerTime)}
                                    // lg={12 / (props?.responsive?.lg?.itemAmountPerTime || props.itemAmountPerTime)}
                                    // xl={12 / (props?.responsive?.xl?.itemAmountPerTime || props.itemAmountPerTime)}
                                    // xxl={12 / (props?.responsive?.xxl?.itemAmountPerTime || props.itemAmountPerTime)}
                                    className="product-slider__card" 
                                    ref={(e: HTMLSpanElement)=>{ref.current[index] = e}}
                                    data-position={position}
                                    style={{
                                        transform: `translateX(${state.step * 100 * -1 * props.loadNextItemAmount}%)`,
                                        zIndex: 1
                                    }}>
                                    {(props.cardNode as (item: ItemType, index: number) => React.ReactNode)(item, index)}
                                </Col>
                            }

                            else if(position === SliderCartPosition.OUT_LEFT){
                                return <Col as={"span"} key={index + 1} 
                                // xs={12 / (props?.responsive?.xs?.itemAmountPerTime || props.itemAmountPerTime)} 
                                // sm={12 / (props?.responsive?.sm?.itemAmountPerTime || props.itemAmountPerTime)} 
                                // md={12 / (props?.responsive?.md?.itemAmountPerTime || props.itemAmountPerTime)}
                                // lg={12 / (props?.responsive?.lg?.itemAmountPerTime || props.itemAmountPerTime)}
                                // xl={12 / (props?.responsive?.xl?.itemAmountPerTime || props.itemAmountPerTime)}
                                // xxl={12 / (props?.responsive?.xxl?.itemAmountPerTime || props.itemAmountPerTime)}
                                className="product-slider__card" 
                                ref={(e: HTMLSpanElement)=>{ref.current[index] = e}}
                                data-position={position}
                                style={{
                                    transform: `translateX(${(redundant + props.itemArray.length - state.lastSlideItemIndex) * 100}%)`
                                }}>
                                {
                                    (props.cardNode as (item: ItemType,index: number) => React.ReactNode)(item, index)
                                }
                                </Col>
                            }
                            
                            return <Col as={"span"} key={index + 1} 
                                // xs={12 / (props?.responsive?.xs?.itemAmountPerTime || props.itemAmountPerTime)} 
                                // sm={12 / (props?.responsive?.sm?.itemAmountPerTime || props.itemAmountPerTime)} 
                                // md={12 / (props?.responsive?.md?.itemAmountPerTime || props.itemAmountPerTime)}
                                // lg={12 / (props?.responsive?.lg?.itemAmountPerTime || props.itemAmountPerTime)}
                                // xl={12 / (props?.responsive?.xl?.itemAmountPerTime || props.itemAmountPerTime)}
                                // xxl={12 / (props?.responsive?.xxl?.itemAmountPerTime || props.itemAmountPerTime)}
                                className="product-slider__card" 
                                ref={(e: HTMLSpanElement)=>{ref.current[index] = e}}
                                data-position={position}
                                style={{
                                    transform: `translateX(${state.step * 100 * -1 * props.loadNextItemAmount}%)`
                                }}>
                                {
                                    (props.cardNode as (item: ItemType, index: number) => React.ReactNode)(item,index)
                                }
                            </Col>
                        })
                    }
                </Row>
            </div>
            { 
            !!props.dataNumber && <>
                <div className='product-slider__owl--left' onClick={() => {
                    prev(); 
                    setHasClicked(o => true);
                }}>
                    <HiOutlineChevronLeft></HiOutlineChevronLeft>
                </div>
                <div className='product-slider__owl--right' onClick={() => {
                    next();
                    setHasClicked(o => true);
                }}>
                    <HiOutlineChevronRight></HiOutlineChevronRight>
                </div>
            </>
            }
        </div>
    )
}

function useSliderPaging<ItemType>(props: SliderProps<ItemType>)
: [state: SliderState, prev: () => void, next: () => void] {
    const screen = useResponsive();                    
    const [state, setState] = React.useState<SliderState>({
        dataNumber: props.dataNumber,
        showPerPage: props.itemAmountPerTime,
        firstSlideItemIndex: 0,
        lastSlideItemIndex: props.itemAmountPerTime - 1,
        runnerTime: Math.ceil((props.dataNumber - props.itemAmountPerTime) / props.loadNextItemAmount),
        minStep: 0,
        maxStep: Math.ceil((props.dataNumber - props.itemAmountPerTime) / props.loadNextItemAmount),
        step: 0
    });
    const functions = {
        changeItemAmount(newValue: number){
            console.log(newValue);
            setState(o => ({
                ...o,
                showPerPage: newValue,
                firstSlideItemIndex: 0,
                lastSlideItemIndex: newValue - 1,
                runnerTime: Math.ceil((props.dataNumber - newValue) / props.loadNextItemAmount),
                maxStep: Math.ceil((props.dataNumber - newValue) / props.loadNextItemAmount),
                step: 0,
                minStep: 0
            }));
        },
        getItemAmountPerTimeByResponsive(){
            if(props?.responsive){
                let itemAmountPerTime;
                switch (screen) {
                    case screenType['small mobile']:
                        itemAmountPerTime = props?.responsive?.xs?.itemAmountPerTime;
                        break;

                    case screenType['mobile']:
                        itemAmountPerTime = props?.responsive?.sm?.itemAmountPerTime;
                        break;

                    case screenType['medium']:
                        itemAmountPerTime = props?.responsive?.md?.itemAmountPerTime || props?.responsive?.sm?.itemAmountPerTime;
                        break;

                    case screenType['large']:
                        itemAmountPerTime = props?.responsive?.lg?.itemAmountPerTime || props?.responsive?.md?.itemAmountPerTime || props?.responsive?.sm?.itemAmountPerTime;
                        break;
                    
                    case screenType['extraLarge']:
                        itemAmountPerTime = props?.responsive?.xl?.itemAmountPerTime || props?.responsive?.lg?.itemAmountPerTime || props?.responsive?.md?.itemAmountPerTime || props?.responsive?.sm?.itemAmountPerTime;
                        break;

                    case screenType['extremeLarge']:
                        itemAmountPerTime = props?.responsive?.xxl?.itemAmountPerTime || props?.responsive?.xl?.itemAmountPerTime || props?.responsive?.lg?.itemAmountPerTime || props?.responsive?.md?.itemAmountPerTime || props?.responsive?.sm?.itemAmountPerTime;
                        break;

                    case screenType['superLarge']:
                        itemAmountPerTime = props?.responsive?.xxl?.itemAmountPerTime || props?.responsive?.xl?.itemAmountPerTime || props?.responsive?.lg?.itemAmountPerTime || props?.responsive?.md?.itemAmountPerTime || props?.responsive?.sm?.itemAmountPerTime;
                        break;

                    default:
                        itemAmountPerTime = props.itemAmountPerTime;
                        break;
                }
                this.changeItemAmount(itemAmountPerTime || props.itemAmountPerTime);
            }
        }
    }

    React.useEffect(() =>{
        init();
    }, [props.dataNumber]);

    React.useEffect(() =>{
        setState(o =>({
            ...o,
            data: props.itemArray
        }))
    }, [props.itemArray]);

    React.useEffect(() =>{
        functions.getItemAmountPerTimeByResponsive();
    },[screen])

    function init(){
        setState(o=>({
            ...o,
            dataNumber: props.dataNumber,
            showPerPage: props.itemAmountPerTime,
            firstSlideItemIndex: 0,
            lastSlideItemIndex: props.itemAmountPerTime - 1,
            runnerTime: Math.ceil((props.dataNumber - props.itemAmountPerTime) / props.loadNextItemAmount),
            minStep: 0,
            maxStep: Math.ceil((props.dataNumber - props.itemAmountPerTime) / props.loadNextItemAmount)
        }));
    }

    function prev() {
        setState(o => {
            if(o.runnerTime < o.maxStep){
                let remainingDataNumber = o.firstSlideItemIndex + 1;
                if(remainingDataNumber < props.loadNextItemAmount){
                    return {
                        ...o,
                        firstSlideItemIndex: o.firstSlideItemIndex - remainingDataNumber - 1,
                        lastSlideItemIndex: o.lastSlideItemIndex - remainingDataNumber - 1,
                        runnerTime: o.runnerTime + 1,
                        step: o.step - 1,
                    }
                }
    
                return {
                    ...o,
                    firstSlideItemIndex: o.firstSlideItemIndex - props.loadNextItemAmount,
                    lastSlideItemIndex: o.lastSlideItemIndex - props.loadNextItemAmount,
                    runnerTime: o.runnerTime + 1,
                    step: o.step - 1
                }
            }
            return {
                ...o,
                firstSlideItemIndex: o.dataNumber - o.showPerPage,
                lastSlideItemIndex: o.dataNumber - 1,
                runnerTime: o.minStep,
                step: o.maxStep
            };
        });
    }

    function next() {
        setState(o => {
            let remainingDataNumber = o.dataNumber - o.lastSlideItemIndex;
            if(o.runnerTime > o.minStep){
                if(remainingDataNumber < props.loadNextItemAmount){
                    return {
                        ...o,
                        firstSlideItemIndex: o.firstSlideItemIndex + remainingDataNumber - 1,
                        // lastSlideItemIndex: o.lastSlideItemIndex + remainingDataNumber - 1,
                        lastSlideItemIndex: o.showPerPage - remainingDataNumber,
                        runnerTime: o.runnerTime - 1,
                        step: o.step + 1
                    }
                }
    
                return {
                    ...o,
                    firstSlideItemIndex: o.firstSlideItemIndex + props.loadNextItemAmount,
                    lastSlideItemIndex: o.lastSlideItemIndex + props.loadNextItemAmount,
                    runnerTime: o.runnerTime - 1,
                    step: o.step + 1
                }
            }
            return {
                ...o,
                firstSlideItemIndex: 0,
                lastSlideItemIndex: o.showPerPage - 1,
                runnerTime: o.maxStep,
                step: o.minStep
            };
            
        });
    }

    return [state, prev ,next];
}