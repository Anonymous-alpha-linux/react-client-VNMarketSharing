import React from 'react'
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';
import './index.css';


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
            }, 5000);
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
    return (
        <div className="product-slider__root">
            <div className="product-slider__container">
                <div className="product-slider__blur"></div>
                <div className={'product-slider__showcase' + ` ${props.className}`}>
                    {
                        props.itemArray.map((item,index) =>{
                            
                            let position : string = index < state.firstSlideItemIndex 
                            ? SliderCartPosition.OUT_LEFT
                            : SliderCartPosition.OUT_RIGHT;

                            if(index >= state.firstSlideItemIndex && index <= state.lastSlideItemIndex){
                                position = index === state.firstSlideItemIndex 
                                ? SliderCartPosition.FIRST
                                : index === state.lastSlideItemIndex
                                ? SliderCartPosition.LAST
                                : SliderCartPosition.IN;
                                return <span key={index + 1} 
                                    className="product-slider__card" 
                                    data-position={position}
                                    style={{
                                        transform: `translateX(${state.step * 100 * -1 * props.loadNextItemAmount}%)`
                                    }}>
                                    {(props.cardNode as (item: ItemType) => React.ReactNode)(item)}
                                </span>
                            }
                            
                            return <span key={index + 1} 
                                className="product-slider__card" 
                                data-position={position}
                                style={{
                                    transform: `translateX(${state.step * 100 * -1 * props.loadNextItemAmount}%)`
                                }}>
                                {
                                    (props.cardNode as (item: ItemType) => React.ReactNode)(item)
                                }
                            </span>
                        })
                    }
                </div>
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

    React.useEffect(() =>{
        init();
    }, [props.dataNumber]);

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
            let remainingDataNumber = o.dataNumber - o.lastSlideItemIndex + 1;
            if(o.runnerTime > o.minStep){
                if(remainingDataNumber < props.loadNextItemAmount){
                    return {
                        ...o,
                        firstSlideItemIndex: o.firstSlideItemIndex + remainingDataNumber - 1,
                        lastSlideItemIndex: o.lastSlideItemIndex + remainingDataNumber - 1,
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