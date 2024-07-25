type TCountryName = string;
type TCountryCode = string;
export type TCountryList = [{ text: TCountryName; value: TCountryCode }];

export const accountOpeningReasonList = [
    {
        text: 'Hedging',
        value: 'Hedging',
    },
    {
        text: 'Income Earning',
        value: 'Income Earning',
    },
    {
        text: 'Speculative',
        value: 'Speculative',
    },
    {
        text: 'Peer-to-peer exchange',
        value: 'Peer-to-peer exchange',
    },
];
