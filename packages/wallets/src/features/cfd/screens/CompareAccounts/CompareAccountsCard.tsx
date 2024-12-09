import React from 'react';
import { Localize } from '@deriv-com/translations';
import { Text } from '@deriv-com/ui';
import { THooks } from '../../../../types';
import { PRODUCT } from '../../constants';
import CompareAccountsDescription from './CompareAccountsDescription';
import CompareAccountsPlatformLabel from './CompareAccountsPlatformLabel';
import CompareAccountsTitleIcon from './CompareAccountsTitleIcon';
import InstrumentsLabelHighlighted from './InstrumentsLabelHighlighted';
import './CompareAccountsCard.scss';

type TCompareAccountsCard = {
    account:
        | NonNullable<THooks.CompareCFDAccounts['ctraderAccount']>
        | NonNullable<THooks.CompareCFDAccounts['dxtradeAccount']>
        | NonNullable<THooks.CompareCFDAccounts['mt5Accounts']>[number];
    isDemo: boolean;
    isEuRegion: boolean;
};

const CompareAccountsCard = ({ account, isDemo, isEuRegion }: TCompareAccountsCard) => {
    const product = account.platform === 'mt5' ? account.product : undefined;
    //@ts-expect-error needs backend type
    const productDetails = account.platform === 'mt5' ? account.product_details : undefined;
    //@ts-expect-error needs backend type
    const instruments = account.platform === 'mt5' ? account.instruments : undefined;

    return (
        <div>
            <div className='wallets-compare-accounts-card'>
                <CompareAccountsPlatformLabel platform={account.platform} />
                {product === PRODUCT.ZEROSPREAD && (
                    <div className='wallets-compare-accounts-card__banner'>
                        <Text color='white' size='xs' weight='bold'>
                            <Localize i18n_default_text='NEW' />
                        </Text>
                    </div>
                )}
                <CompareAccountsTitleIcon
                    isDemo={isDemo}
                    isEuRegion={isEuRegion}
                    platform={account.platform}
                    product={product}
                />
                <CompareAccountsDescription isEuRegion={isEuRegion} product={product} productDetails={productDetails} />
                <InstrumentsLabelHighlighted
                    instruments={instruments}
                    isEuRegion={isEuRegion}
                    platform={account.platform}
                />
                {isEuRegion && (
                    <div className='wallets-compare-accounts-card__eu-clients'>
                        <Text color='red' size='2xs' weight='bold'>
                            <Localize i18n_default_text='*Boom 300 and Crash 300 Index' />
                        </Text>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompareAccountsCard;
