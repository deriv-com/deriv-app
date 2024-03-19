//TODO: Below component to replaced with progress bar from deriv-com/ui
import React from 'react';
import { TStep } from 'types';

type TAdProgressBar = {
    currentStep: number;
    steps: TStep[];
};

const AdProgressBar = ({ currentStep, steps }: TAdProgressBar) => {
    const radius = 28;
    const circumference = 2 * Math.PI * radius;
    const percentage = ((currentStep + 1) / steps.length) * 100;
    const offset = ((100 - percentage) * circumference) / 100;

    return (
        <svg height={72} width={72}>
            <g transform='rotate(-90 36 100)'>
                <circle
                    cx={100}
                    cy={100}
                    fill='transparent'
                    r={radius}
                    stroke='#d6d6d6'
                    strokeDasharray={circumference}
                    strokeDashoffset='0'
                    strokeWidth='0.5rem'
                />
                <circle
                    cx={100}
                    cy={100}
                    fill='transparent'
                    r={radius}
                    stroke='#ff444f'
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeWidth='0.5rem'
                />
            </g>
            <text dominantBaseline='central' fontSize='1.4rem' fontWeight='bold' textAnchor='middle' x='50%' y='50%'>
                {currentStep + 1} / {steps.length}
            </text>
        </svg>
    );
};

export default AdProgressBar;
