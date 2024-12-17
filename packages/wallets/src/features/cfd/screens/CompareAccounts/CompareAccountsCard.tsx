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
    //@ts-expect-error need update api-types
    const productDetails = account.platform === 'mt5' ? account.product_details : undefined;
    //@ts-expect-error need update api-types
    const instruments = account.platform === 'mt5' ? account.instruments : undefined;
    //@ts-expect-error need update api-types
    const isNewBadgeVisible = product === PRODUCT.ZEROSPREAD || product === PRODUCT.GOLD;

    return (
        <div>
            <div className='wallets-compare-accounts-card'>
                <CompareAccountsPlatformLabel platform={account.platform} />
                {isNewBadgeVisible && (
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
            </div>
        </div>
    );
};

export default CompareAccountsCard;
