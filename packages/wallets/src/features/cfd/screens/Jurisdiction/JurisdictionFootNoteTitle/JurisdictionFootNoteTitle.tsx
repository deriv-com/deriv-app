import React, { FC } from 'react';
import { WalletText } from '../../../../../components/Base';
import { THooks } from '../../../../../types';
import { MarketTypeDetails } from '../../../constants';

type TJurisdictionFootNoteTitle = {
    marketType: keyof typeof MarketTypeDetails;
    selectedJurisdiction: THooks.AvailableMT5Accounts['shortcode'];
};

const JurisdictionFootNoteTitle: FC<TJurisdictionFootNoteTitle> = ({ marketType, selectedJurisdiction }) => {
    let footnoteText: string | undefined;

    switch (selectedJurisdiction) {
        case 'svg':
            footnoteText = `Add your Deriv MT5 ${MarketTypeDetails[marketType].title} account under Deriv (SVG) LLC (company no. 273 LLC 2020).`;
            break;
        case 'bvi':
            footnoteText = `Add your Deriv MT5 ${MarketTypeDetails[marketType].title} account under Deriv (BVI) Ltd, regulated by the British Virgin Islands Financial Services Commission (License no. SIBA/L/18/1114).`;
            break;
        case 'labuan':
            footnoteText = `Add your Deriv MT5 ${MarketTypeDetails[marketType].title} STP account under Deriv (FX) Ltd regulated by Labuan Financial Services Authority (License no. MB/18/0024).`;
            break;
        case 'vanuatu':
            footnoteText = `Add your Deriv MT5 ${MarketTypeDetails[marketType].title} account under Deriv (V) Ltd, regulated by the Vanuatu Financial Services Commission.`;
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
