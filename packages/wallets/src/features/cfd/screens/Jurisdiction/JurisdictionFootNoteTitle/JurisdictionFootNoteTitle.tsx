import React, { FC } from 'react';
import { localize } from '@deriv-com/translations';
import { WalletText } from '../../../../../components/Base';
import { THooks } from '../../../../../types';
import { getMarketTypeDetails } from '../../../constants';

type TJurisdictionFootNoteTitle = {
    marketType: keyof ReturnType<typeof getMarketTypeDetails>;
    selectedJurisdiction: THooks.AvailableMT5Accounts['shortcode'];
};

const JurisdictionFootNoteTitle: FC<TJurisdictionFootNoteTitle> = ({ marketType, selectedJurisdiction }) => {
    let footnoteText: string | undefined;

    switch (selectedJurisdiction) {
        case 'svg':
            footnoteText = localize(
                'Add your Deriv MT5 {{marketTitle}} account under Deriv (SVG) LLC (company no. 273 LLC 2020).',
                {
                    marketTitle: getMarketTypeDetails()[marketType].title,
                }
            );
            break;
        case 'bvi':
            footnoteText = localize(
                'Add your Deriv MT5 {{marketTitle}} account under Deriv (BVI) Ltd, regulated by the British Virgin Islands Financial Services Commission (License no. SIBA/L/18/1114).',
                {
                    marketTitle: getMarketTypeDetails()[marketType].title,
                }
            );
            break;
        case 'labuan':
            footnoteText = localize(
                'Add your Deriv MT5 {{marketTitle}} STP account under Deriv (FX) Ltd regulated by Labuan Financial Services Authority (License no. MB/18/0024).',
                {
                    marketTitle: getMarketTypeDetails()[marketType].title,
                }
            );
            break;
        case 'vanuatu':
            footnoteText = localize(
                'Add your Deriv MT5 {{marketTitle}} account under Deriv (V) Ltd, regulated by the Vanuatu Financial Services Commission.',
                {
                    marketTitle: getMarketTypeDetails()[marketType].title,
                }
            );
            break;
        default:
            footnoteText = undefined;
            break;
    }

    if (!footnoteText) {
        return null;
    }

    return (
        <WalletText align='center' size='sm' weight='bold'>
            {footnoteText}
        </WalletText>
    );
};

export default JurisdictionFootNoteTitle;
