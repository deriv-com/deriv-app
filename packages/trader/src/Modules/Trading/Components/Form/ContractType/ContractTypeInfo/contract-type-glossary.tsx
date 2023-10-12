import React from 'react';
import { Text } from '@deriv/components';
import { VANILLALONG, TURBOS } from '@deriv/shared';
import { Localize } from '@deriv/translations';

const ContractTypeGlossary = ({ category }: { category: string }) => {
    let content;
    if (category) {
        switch (category) {
            case 'accumulator':
                content = [
                    { type: 'heading', text: <Localize i18n_default_text='Growth rate' /> },
                    {
                        type: 'paragraph',
                        text: (
                            <Localize i18n_default_text='You can choose a growth rate with values of 1%, 2%, 3%, 4%, and 5%.' />
                        ),
                    },
                    { type: 'heading', text: <Localize i18n_default_text='Payout' /> },
                    {
                        type: 'paragraph',
                        text: <Localize i18n_default_text='Payout is the sum of your initial stake and profit.' />,
                    },
                    { type: 'heading', text: <Localize i18n_default_text='Range' /> },
                    {
                        type: 'paragraph',
                        text: (
                            <Localize i18n_default_text='It is a percentage of the previous spot price. The percentage rate is based on your choice of the index and the growth rate.' />
                        ),
                    },
                    { type: 'heading', text: <Localize i18n_default_text='Previous spot price' /> },
                    {
                        type: 'paragraph',
                        text: <Localize i18n_default_text='Spot price on the previous tick.' />,
                    },
                    { type: 'heading', text: <Localize i18n_default_text='Slippage risk' /> },
                    {
                        type: 'paragraph',
                        text: (
                            <Localize i18n_default_text='The spot price may change by the time your order reaches our servers. When this happens, your payout may be affected.' />
                        ),
                    },
                ];
                break;
            case TURBOS.LONG:
            case TURBOS.SHORT:
                content = [
                    { type: 'heading', text: <Localize i18n_default_text='Payout' /> },
                    {
                        type: 'paragraph',
                        text: (
                            <Localize i18n_default_text='Your payout is equal to the payout per point multiplied by the difference between the final price and barrier.' />
                        ),
                    },
                    { type: 'heading', text: <Localize i18n_default_text='Expiry' /> },
                    {
                        type: 'paragraph',
                        text: (
                            <Localize i18n_default_text='This is when your contract will expire based on the duration or end time you’ve selected. If the duration is more than 24 hours, the cut-off time and expiry date will apply instead.' />
                        ),
                    },
                    { type: 'heading', text: <Localize i18n_default_text='Barrier' /> },
                    {
                        type: 'paragraph',
                        text: (
                            <Localize i18n_default_text='This is a price level that you choose. If this barrier is ever crossed, your contract would be terminated.' />
                        ),
                    },
                    { type: 'heading', text: <Localize i18n_default_text='Payout per point' /> },
                    {
                        type: 'paragraph',
                        text: <Localize i18n_default_text='We calculate this based on the barrier you’ve selected.' />,
                    },
                    { type: 'heading', text: <Localize i18n_default_text='Final price' /> },
                    {
                        type: 'paragraph',
                        text: <Localize i18n_default_text='This is the spot price of the last tick at expiry.' />,
                    },
                    { type: 'heading', text: <Localize i18n_default_text='Contract value' /> },
                    {
                        type: 'paragraph',
                        text: (
                            <Localize i18n_default_text='We’ll offer to buy your contract at this price should you choose to sell it before its expiry. This is based on several factors, such as the current spot price. We won’t offer a contract value if the remaining duration is below 15 seconds or if the contract duration is in ticks.' />
                        ),
                    },
                    { type: 'heading', text: <Localize i18n_default_text='Cut-off time' /> },
                    {
                        type: 'paragraph',
                        text: (
                            <Localize i18n_default_text='Your contract will expire at exactly 23:59:59 GMT +0 on your selected expiry date.' />
                        ),
                    },
                    { type: 'heading', text: <Localize i18n_default_text='Expiry date' /> },
                    {
                        type: 'paragraph',
                        text: (
                            <Localize i18n_default_text='Your contract will expire on this date (in GMT), based on the end time you’ve selected.' />
                        ),
                    },
                ];
                break;
            case VANILLALONG.CALL:
            case VANILLALONG.PUT:
                content = [
                    { type: 'heading', text: <Localize i18n_default_text='Payout' /> },
                    {
                        type: 'paragraph',
                        text: (
                            <Localize i18n_default_text='Your payout is equal to the payout per point multiplied by the difference between the final price and the strike price.' />
                        ),
                    },
                    { type: 'heading', text: <Localize i18n_default_text='Final price' /> },
                    {
                        type: 'paragraph',
                        text: <Localize i18n_default_text='This is the spot price of the last tick at expiry.' />,
                    },
                    { type: 'heading', text: <Localize i18n_default_text='Strike price' /> },
                    {
                        type: 'paragraph',
                        text: (
                            <Localize i18n_default_text='You must select the strike price before entering the contract.' />
                        ),
                    },
                    {
                        type: 'list',
                        text: [
                            <Localize
                                i18n_default_text='If you select "Call", you’ll earn a payout if the final price is above the strike price at expiry. Otherwise, you won’t receive a payout.'
                                key='0'
                            />,
                            <Localize
                                i18n_default_text='If you select "Put", you’ll earn a payout if the final price is below the strike price at expiry. Otherwise, you won’t receive a payout.'
                                key='1'
                            />,
                        ],
                    },
                    { type: 'heading', text: <Localize i18n_default_text='Expiry' /> },
                    {
                        type: 'paragraph',
                        text: (
                            <Localize i18n_default_text='This is when your contract will expire based on the Duration or End time you’ve selected.' />
                        ),
                    },
                    {
                        type: 'list',
                        text: [
                            <Localize
                                i18n_default_text='If the duration is more than 24 hours, the Cut-off time and Expiry date will apply instead.'
                                key='0'
                            />,
                        ],
                    },
                    { type: 'heading', text: <Localize i18n_default_text='Payout per point' /> },
                    {
                        type: 'paragraph',
                        text: (
                            <Localize i18n_default_text='We calculate this based on the strike price and duration you’ve selected.' />
                        ),
                    },
                    { type: 'heading', text: <Localize i18n_default_text='Contract value' /> },
                    {
                        type: 'paragraph',
                        text: (
                            <Localize i18n_default_text='We’ll offer to buy your contract at this price should you choose to sell it before its expiry. This is based on several factors, such as the current spot price, duration, etc. However, we won’t offer a contract value if the remaining duration is below 60 seconds.' />
                        ),
                    },
                    { type: 'heading', text: <Localize i18n_default_text='Cut-off time' /> },
                    {
                        type: 'paragraph',
                        text: (
                            <Localize i18n_default_text='Contracts will expire at exactly 23:59:59 GMT on your selected expiry date.' />
                        ),
                    },
                    { type: 'heading', text: <Localize i18n_default_text='Expiry date' /> },
                    {
                        type: 'paragraph',
                        text: (
                            <Localize i18n_default_text='Your contract will expire on this date (in GMT), based on the End time you’ve selected.' />
                        ),
                    },
                ];
                break;
            default:
                content = [];
                break;
        }
    }
    return (
        <React.Fragment>
            {content?.map(({ type, text }: { type: string; text: JSX.Element | JSX.Element[] }) => {
                if (type === 'heading' && !Array.isArray(text)) {
                    return (
                        <Text
                            as='h2'
                            key={text.props.i18n_default_text}
                            weight='bold'
                            className='contract-type-info__content-glossary--heading'
                        >
                            {text}
                        </Text>
                    );
                }
                if (type === 'paragraph' && !Array.isArray(text)) {
                    return (
                        <Text as='p' key={text.props.i18n_default_text}>
                            {text}
                        </Text>
                    );
                }
                if (type === 'list' && Array.isArray(text)) {
                    return (
                        <ul key={text[0].props.i18n_default_text}>
                            {text.map(list_item_text => (
                                <li key={list_item_text.props.i18n_default_text}>{list_item_text}</li>
                            ))}
                        </ul>
                    );
                }
                return null;
            })}
        </React.Fragment>
    );
};

export default ContractTypeGlossary;
