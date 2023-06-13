import React from 'react';
import Icon from '../icon';

type PrevNextButtonProps = {
    enabled: boolean;
    onClick: () => void;
};

export const PrevButton: React.FC<PrevNextButtonProps> = props => {
    const { enabled, onClick } = props;

    return (
        <button className='embla__button embla__button--prev' onClick={onClick} disabled={!enabled}>
            <Icon icon='IcArrowLeftBold' className='embla__button__svg' />
        </button>
    );
};

export const NextButton: React.FC<PrevNextButtonProps> = props => {
    const { enabled, onClick } = props;

    return (
        <button className='embla__button embla__button--next' onClick={onClick} disabled={!enabled}>
            <Icon icon='IcArrowRightBold' className='embla__button__svg' />
        </button>
    );
};
