import React from 'react';
import classNames from 'classnames';
import Icon from '../icon';

type TPrevNextButtonProps = {
    enabled: boolean;
    onClick: () => void;
    isNext: boolean;
};

const CFDCompareAccountsCarouselButton = (props: TPrevNextButtonProps) => {
    const { enabled, onClick, isNext } = props;

    return (
        <button
            className={classNames('cfd-compare-accounts-carousel__button', {
                'cfd-compare-accounts-carousel__button--prev': !isNext,
                'cfd-compare-accounts-carousel__button--next': isNext,
            })}
            onClick={onClick}
            disabled={!enabled}
        >
            <Icon
                icon={isNext ? 'IcChevronRightBold' : 'IcChevronLeftBold'}
                className='cfd-compare-accounts-carousel__button__svg'
            />
        </button>
    );
};
export default CFDCompareAccountsCarouselButton;
