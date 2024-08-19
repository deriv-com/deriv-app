import { TTranslations } from '../../../../../types';

export const getAccountOpeningReasonList = (localize: TTranslations['localize']) => [
    {
        text: localize('Hedging'),
        value: 'Hedging',
    },
    {
        text: localize('Income Earning'),
        value: 'Income Earning',
    },
    {
        text: localize('Speculative'),
        value: 'Speculative',
    },
    {
        text: localize('Peer-to-peer exchange'),
        value: 'Peer-to-peer exchange',
    },
];
