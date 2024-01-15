import React from 'react';
import { Text } from '@deriv/quill-design';
import { THooks } from '../../../../../types';
import { MarketTypeDetails } from '../../../constants';

type TJurisdictionFootNoteTitle = {
    marketType: Exclude<THooks.SortedMT5Accounts['market_type'], undefined>;
    selectedJurisdiction: THooks.AvailableMT5Accounts['shortcode'];
};

const JurisdictionFootNoteTitle = ({ marketType, selectedJurisdiction }: TJurisdictionFootNoteTitle) => {
    let footnoteText: string | undefined;

    const marketTypeDetails = MarketTypeDetails(false);

    const title = marketTypeDetails[marketType]?.title;

    switch (selectedJurisdiction) {
        case 'svg':
            footnoteText = `Add your Deriv MT5 ${title} account under Deriv (SVG) LLC (company no. 273 LLC 2020).`;
            break;
        case 'bvi':
            footnoteText = `Add your Deriv MT5 ${title} account under Deriv (BVI) Ltd, regulated by the British Virgin Islands Financial Services Commission (License no. SIBA/L/18/1114).`;
            break;
        case 'labuan':
            footnoteText = `Add your Deriv MT5 ${title} STP account under Deriv (FX) Ltd regulated by Labuan Financial Services Authority (License no. MB/18/0024).`;
            break;
        case 'vanuatu':
            footnoteText = `Add your Deriv MT5 ${title} account under Deriv (V) Ltd, regulated by the Vanuatu Financial Services Commission.`;
            break;
        default:
            footnoteText = undefined;
            break;
    }

    if (!footnoteText) {
        return null;
    }

    return (
        <Text bold size='sm'>
            {footnoteText}
        </Text>
    );
};

export default JurisdictionFootNoteTitle;
