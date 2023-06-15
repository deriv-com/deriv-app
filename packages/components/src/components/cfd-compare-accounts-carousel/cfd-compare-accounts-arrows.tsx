import React from 'react';
import Icon from '../icon';

type TPrevNextButtonProps = {
    enabled: boolean;
    onClick: () => void;
};

export const PrevButton: React.FC<TPrevNextButtonProps> = props => {
    const { enabled, onClick } = props;

    return (
        <button
            className='cfd-compare-accounts-carousel__button cfd-compare-accounts-carousel__button--prev'
            onClick={onClick}
            disabled={!enabled}
        >
            <Icon icon='IcChevronLeftBold' className='cfd-compare-accounts-carousel__button__svg' />
        </button>
    );
};

export const NextButton: React.FC<TPrevNextButtonProps> = props => {
    const { enabled, onClick } = props;

    return (
        <button
            className='cfd-compare-accounts-carousel__button cfd-compare-accounts-carousel__button--next'
            onClick={onClick}
            disabled={!enabled}
        >
            <Icon icon='IcChevronRightBold' className='cfd-compare-accounts-carousel__button__svg' />
        </button>
    );
};
