import React from 'react';
import { useTranslations } from '@deriv-com/translations';
import { Text, Tooltip, useDevice } from '@deriv-com/ui';
import InfoIcon from '../../../../public/images/ic-info-outline.svg';
import { THooks, TProductDetails } from '../../../../types';
import { MT5_PRODUCT } from './constants';
import './CompareAccountsDescription.scss';

type TCompareAccountsDescription = {
    isEuRegion: boolean;
    product?: THooks.AvailableMT5Accounts['product'];
    productDetails?: TProductDetails;
};

const CompareAccountsDescription = ({ isEuRegion, product, productDetails }: TCompareAccountsDescription) => {
    const { localize } = useTranslations();
    const { isTablet } = useDevice();

    const leverage = localize('Up to {{leverage}}', { leverage: productDetails?.max_leverage ?? '1:1000' });
    const spread = localize('{{spread}} pips', { spread: productDetails?.min_spread ?? '0.5' });

    return (
        <div className='wallets-compare-accounts-text-container'>
            <div className='wallets-compare-accounts-text-container__separator'>
                <Text align='center' as='h1' size={isTablet ? 'md' : 'xl'} weight='bold'>
                    {leverage}
                </Text>
                <Text align='center' as='p' size='2xs'>
                    {!isEuRegion ? localize('Maximum leverage') : localize('Leverage')}
                </Text>
            </div>
            {!isEuRegion && (
                <div className='wallets-compare-accounts-text-container__separator'>
                    <div className='wallets-compare-accounts-title__separator'>
                        <Text align='center' as='h1' size={isTablet ? 'md' : 'xl'} weight='bold'>
                            {spread}
                        </Text>
                        {product === MT5_PRODUCT.ZERO_SPREAD && (
                            <Tooltip
                                as='div'
                                data-testid='wallets-compare-accounts-text-container__tooltip'
                                tooltipContent={localize('Commissions apply')}
                                tooltipOffset={20}
                                tooltipPosition='top'
                            >
                                <InfoIcon />
                            </Tooltip>
                        )}
                    </div>
                    <Text align='center' as='p' size='2xs'>
                        {localize('Spreads from')}
                    </Text>
                </div>
            )}
        </div>
    );
};

export default CompareAccountsDescription;
