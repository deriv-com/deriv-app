import React from 'react';
import { Icon } from '@deriv/components';

type PrevNextButtonProps = {
    enabled: boolean;
    onClick: () => void;
};

export const PrevButton: React.FC<PrevNextButtonProps> = props => {
    const { enabled, onClick } = props;

    return (
        <button className='carousel-btn carousel-btn__prev' onClick={onClick} disabled={!enabled}>
            <Icon icon='IcChevronLeftBold' className='carousel-btn__icon' />
        </button>
    );
};

export const NextButton: React.FC<PrevNextButtonProps> = props => {
    const { enabled, onClick } = props;

    return (
        <button className='carousel-btn carousel-btn__next' onClick={onClick} disabled={!enabled}>
            <Icon icon='IcChevronRightBold' className='carousel-btn__icon' />
        </button>
    );
};
