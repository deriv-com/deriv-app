import React from 'react';
import classNames from 'classnames';
import { IconButton } from '../../../../components/Base';
import LeftArrow from '../../../../public/images/left-arrow.svg';
import RightArrow from '../../../../public/images/right-arrow.svg';
import './CompareAccountsCarouselButton.scss';

type TPrevNextButtonProps = {
    enabled: boolean;
    isNext: boolean;
    onClick: () => void;
};

const CFDCompareAccountsCarouselButton = (props: TPrevNextButtonProps) => {
    const { enabled, isNext, onClick } = props;

    return (
        <IconButton
            className={classNames('wallets-compare-accounts-carousel-button', {
                'wallets-compare-accounts-carousel-button--next': isNext,
                'wallets-compare-accounts-carousel-button--prev': !isNext,
            })}
            color='white'
            disabled={!enabled}
            icon={isNext ? <RightArrow /> : <LeftArrow />}
            isRound
            onClick={onClick}
            size='md'
        />
    );
};
export default CFDCompareAccountsCarouselButton;
