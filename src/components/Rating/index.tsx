import React from 'react'
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import "./index.css";

type StarProps = {
    percentage: number;
}
type StarState = {
    selectedStar: number;
}

export function Star(props: StarProps) {
    const [state, setState] = React.useState<StarState>({
        selectedStar: 0
    });

    return (
        <div className="start__root">
            <div className="star__icons">
                <i>
                    <AiFillStar></AiFillStar>
                </i>
                <i>
                    <AiFillStar></AiFillStar>
                </i>
                <i>
                    <AiFillStar></AiFillStar>
                </i>
                <i>
                    <AiFillStar></AiFillStar>
                </i>
                <i>
                    <AiFillStar></AiFillStar>
                </i>
                

                <div className="star__trackers" style={{width: `${props.percentage > 1 ? props.percentage : props.percentage * 100}%`}}>
                    <i>
                        <AiFillStar></AiFillStar>
                    </i>
                    <i>
                        <AiFillStar></AiFillStar>
                    </i>
                    <i>
                        <AiFillStar></AiFillStar>
                    </i>
                    <i>
                        <AiFillStar></AiFillStar>
                    </i>
                    <i>
                        <AiFillStar></AiFillStar>
                    </i>
                </div>
            </div>
        </div>
    )
}
