import React from 'react';
import classNames from 'classnames';
import { LabelPairedChevronLeftLgFillIcon, LabelPairedChevronRightLgFillIcon } from '@deriv/quill-icons';
import { IconButton } from '../../../../components/Base';
import './CompareAccountsCarouselButton.scss';

type TPrevNextButtonProps = {
    enabled: boolean;
    isNext: boolean;
    isRtl?: boolean;
    onClick: () => void;
};

const CompareAccountsCarouselButton = ({ enabled, isNext, isRtl, onClick }: TPrevNextButtonProps) => {
    const nextButton = isRtl ? (
        <LabelPairedChevronLeftLgFillIcon data-testid='dt_compare_accounts_carousel_next_rtl_icon' fill='#333333' />
    ) : (
        <LabelPairedChevronRightLgFillIcon data-testid='dt_compare_accounts_carousel_next_ltr_icon' fill='#333333' />
    );
    const prevButton = isRtl ? (
        <LabelPairedChevronRightLgFillIcon data-testid='dt_compare_accounts_carousel_prev_rtl_icon' fill='#333333' />
    ) : (
        <LabelPairedChevronLeftLgFillIcon data-testid='dt_compare_accounts_carousel_prev_ltr_icon' fill='#333333' />
    );

    return (
        <IconButton
            className={classNames('wallets-compare-accounts-carousel-button', {
                'wallets-compare-accounts-carousel-button--next': isNext,
                'wallets-compare-accounts-carousel-button--prev': !isNext,
            })}
            color='white'
            disabled={!enabled}
            icon={isNext ? nextButton : prevButton}
            isRound
            onClick={onClick}
            size='md'
        />
    );
};

export default CompareAccountsCarouselButton;
