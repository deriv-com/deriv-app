import React from 'react';
import classNames from 'classnames';
import { LabelPairedChevronLeftLgFillIcon, LabelPairedChevronRightLgFillIcon } from '@deriv/quill-icons';
import { IconButton } from '../../../../components/Base';
import './CompareAccountsCarouselButton.scss';

type TPrevNextButtonProps = {
    enabled: boolean;
    isNext: boolean;
    onClick: () => void;
};

const CFDCompareAccountsCarouselButton = ({ enabled, isNext, onClick }: TPrevNextButtonProps) => (
    <IconButton
        className={classNames('wallets-compare-accounts-carousel-button', {
            'wallets-compare-accounts-carousel-button--next': isNext,
            'wallets-compare-accounts-carousel-button--prev': !isNext,
        })}
        color='white'
        disabled={!enabled}
        icon={
            isNext ? (
                <LabelPairedChevronRightLgFillIcon fill='#333333' />
            ) : (
                <LabelPairedChevronLeftLgFillIcon fill='#333333' />
            )
        }
        isRound
        onClick={onClick}
        size='md'
    />
);

export default CFDCompareAccountsCarouselButton;
