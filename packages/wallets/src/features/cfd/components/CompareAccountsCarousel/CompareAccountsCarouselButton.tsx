import React from 'react';
import classNames from 'classnames';
import ArrowIcon from '../../../../public/images/ic-back-arrow.svg';

type TPrevNextButtonProps = {
    enabled: boolean;
    isNext: boolean;
    onClick: () => void;
};

const CFDCompareAccountsCarouselButton = (props: TPrevNextButtonProps) => {
    const { enabled, isNext, onClick } = props;

    return (
        <button
            className={classNames('wallets-compare-accounts-carousel__button', {
                'wallets-compare-accounts-carousel__button--next': isNext,
                'wallets-compare-accounts-carousel__button--prev': !isNext,
            })}
            disabled={!enabled}
            onClick={onClick}
        >
            <ArrowIcon
                className={classNames('wallets-compare-accounts-carousel__button__svg', {
                    'wallets-compare-accounts-carousel__button__svg--next': isNext,
                })}
            />
        </button>
    );
};
export default CFDCompareAccountsCarouselButton;
