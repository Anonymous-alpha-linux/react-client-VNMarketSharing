import React,{ useCallback, useEffect, useState, useRef } from 'react';
import { Col, Row, FormControlProps, Form } from 'react-bootstrap';
import "./multi-range-slider.css";

interface MultiRangeSliderProps{
    min: number;
    max: number;
    onChange: (min: number, max: number) => void;
}

type MultiRangeSliderState = {
  minVal: number;
  maxVal: number;
}

export const MultiRangeSlider = ({ min, max, onChange }: MultiRangeSliderProps) => {
  const [state, setState] = useState<MultiRangeSliderState>({
    minVal: min,
    maxVal: max
  });

  const minValRef = useRef(min);
  const maxValRef = useRef(max);
  const range = useRef<HTMLInputElement>(null);

  // Convert to percentage
  const getPercent = useCallback(
    (value:number) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  // Set width of the range to decrease from the left side
  useEffect(() => {
    const minPercent = getPercent(state.minVal);
    const maxPercent = getPercent(maxValRef.current);

    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [state.minVal]);

  // Set width of the range to decrease from the right side
  useEffect(() => {
    const minPercent = getPercent(minValRef.current);
    const maxPercent = getPercent(state.maxVal);

    if (range.current) {
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [state.maxVal]);

  return (
    <div className="slider__container">
      <input
        type="range"
        min={min}
        max={max}
        value={state.minVal}
        onChange={(event) => {
          const value = Math.min(parseInt(event.target.value), state.maxVal - 1);
          setState(o => ({
            ...o,
            minVal: value
          }));
          minValRef.current = value;
          onChange(value, state.maxVal);
        }}
        className="thumb thumb--left"
        style={{ zIndex: state.minVal > max - 100 && "5" || "4" }}
      />
      <input
        type="range"
        min={min}
        max={max}
        value={state.maxVal}
        onChange={(event) => {
          const value = Math.max(parseInt(event.target.value), state.minVal + 1);
          setState(o => ({
            ...o,
            maxVal: value
          }));
          maxValRef.current = value;
          onChange(state.minVal, value);
        }}
        className="thumb thumb--right"
      />

      <div className="slider">
        <div className="slider__track" />
        <div ref={range} className="slider__range" />
        <div className="slider__left-value">{state.minVal}</div>
        <div className="slider__right-value">{state.maxVal}</div>
      </div>
    </div>
  );
};

type NumberInputProps = FormControlProps & {
  style?: React.CSSProperties
};

export const NumberInput = (props: NumberInputProps) => {
  const [value, setValue] = React.useState<number>(props.value as number || 0);

  function decreaseNumber(){
    setValue(o => {
      const i = props['aria-valuemin'] as number;
      console.log(i);
      if(!i && o > i)
        return o - 1;
      if(!i){
        return o - 1; 
      }
      
      return o;
    })
  }
  function increaseNumber(){
    setValue(o => {
      const i = props['aria-valuemax'] as number;
      if(i && o < i)
        return o + 1;
      return o;
    })
  }

  React.useEffect(() => console.log(value), [value]);

  return <>
    <Row>
      <Col sm="auto" onClick={decreaseNumber}>
        <span>-</span>
      </Col>
      <Col>
        <Form.Control type={"number"} {...props} value={value} style={props.style} disabled></Form.Control>
      </Col>
      <Col sm="auto" onClick={increaseNumber}>
        <span>+</span>
      </Col>
    </Row>
  </>
}