import classNames from 'classnames';
import React from 'react';

type TTickSteps = {
    hover_value: number;
    max_value: number;
    min_value: number;
    onClick: (index: number) => void;
    onMouseEnter: (index: number) => void;
    onMouseLeave: (e: React.MouseEvent<HTMLSpanElement>) => void;
    value: number;
};

const TickSteps = ({ hover_value, max_value, min_value, onClick, onMouseEnter, onMouseLeave, value }: TTickSteps) => {
    if (!max_value || !min_value) return null;

    const arr_ticks = [...Array(max_value - min_value + 1).keys()];

    const isActive = (idx: number) => idx + min_value === value;
    const isMarked = (idx: number) => idx + min_value < value;
    const isMarkedOnHover = (idx: number) => (isMarked(idx) ? false : idx + min_value <= hover_value);

    return (
        <React.Fragment>
            {arr_ticks.map(idx => (
                <span
                    data-testid={`tick_step_${idx + min_value}`}
                    key={idx}
                    data-value={idx + min_value}
                    className={classNames('range-slider__ticks-step', {
                        'range-slider__ticks-step--active': isActive(idx),
                        'range-slider__ticks-step--marked': isMarked(idx),
                        'range-slider__ticks-step--marked-hover': isMarkedOnHover(idx),
                    })}
                    onClick={() => onClick(idx + min_value)}
                    onKeyDown={() => onClick(idx + min_value)}
                    onMouseEnter={() => onMouseEnter(idx + min_value)}
                    onMouseLeave={onMouseLeave}
                />
            ))}
        </React.Fragment>
    );
};

export default TickSteps;
