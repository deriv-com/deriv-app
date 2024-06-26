import React from 'react';
import classNames from 'classnames';
import Icon from '../icon';

type TPrevNextButtonProps = {
    enabled: boolean;
    onClick: () => void;
    isNext?: boolean;
    isRtl?: boolean;
};

const CFDCompareAccountsCarouselButton = (props: TPrevNextButtonProps) => {
    const { enabled, onClick, isNext = false, isRtl = false } = props;

    const nextButtonName = isRtl ? 'IcChevronLeftBold' : 'IcChevronRightBold';
    const prevButtonName = isRtl ? 'IcChevronRightBold' : 'IcChevronLeftBold';

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
                icon={isNext ? nextButtonName : prevButtonName}
                className='cfd-compare-accounts-carousel__button__svg'
            />
        </button>
    );
};
export default CFDCompareAccountsCarouselButton;
