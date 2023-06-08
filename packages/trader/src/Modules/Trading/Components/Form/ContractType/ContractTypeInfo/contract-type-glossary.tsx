import React from 'react';
import { Text } from '@deriv/components';
import { localize } from '@deriv/translations';

const ContractTypeGlossary = ({ category }: { category: string }) => {
    let content;
    if (category) {
        switch (category) {
            case 'accumulator':
                content = [
                    { type: 'heading', text: localize('Growth rate') },
                    {
                        type: 'paragraph',
                        text: localize('You can choose a growth rate with values of 1%, 2%, 3%, 4%, and 5%.'),
                    },
                    { type: 'heading', text: localize('Payout') },
                    {
                        type: 'paragraph',
                        text: localize('Payout is the sum of your initial stake and profit.'),
                    },
                    { type: 'heading', text: localize('Range') },
                    {
                        type: 'paragraph',
                        text: localize(
                            'It is a percentage of the previous spot price. The percentage rate is based on your choice of the index and the growth rate.'
                        ),
                    },
                    { type: 'heading', text: localize('Previous spot price') },
                    {
                        type: 'paragraph',
                        text: localize('Spot price on the previous tick.'),
                    },
                    { type: 'heading', text: localize('Slippage risk') },
                    {
                        type: 'paragraph',
                        text: localize(
                            'The spot price may change by the time your order reaches our servers. When this happens, your payout maybe affected.'
                        ),
                    },
                ];
                // ContractTypeGlossaryTemplate = (
                //     <React.Fragment>
                //         <Text as='h2' weight='bold' className='contract-type-info__content-glossary--heading'>
                //             {localize('Growth rate')}
                //         </Text>
                //         <Text as='p'>
                //             {localize('You can choose a growth rate with values of 1%, 2%, 3%, 4%, and 5%.')}
                //         </Text>
                //         <Text as='h2' weight='bold' className='contract-type-info__content-glossary--heading'>
                //             {localize('Payout')}
                //         </Text>
                //         <Text as='p'>{localize('Payout is the sum of your initial stake and profit.')}</Text>
                //         <Text as='h2' weight='bold' className='contract-type-info__content-glossary--heading'>
                //             {localize('Range')}
                //         </Text>
                //         <Text as='p'>
                //             {localize(
                //                 'It is a percentage of the previous spot price. The percentage rate is based on your choice of the index and the growth rate.'
                //             )}
                //         </Text>
                //         <Text as='h2' weight='bold' className='contract-type-info__content-glossary--heading'>
                //             {localize('Previous spot price')}
                //         </Text>
                //         <Text as='p'>{localize('Spot price on the previous tick.')}</Text>
                //         <Text as='h2' weight='bold' className='contract-type-info__content-glossary--heading'>
                //             {localize('Slippage risk')}
                //         </Text>
                //         <Text as='p'>
                //             {localize(
                //                 'The spot price may change by the time your order reaches our servers. When this happens, your payout maybe affected.'
                //             )}
                //         </Text>
                //     </React.Fragment>
                // );
                break;
            case 'vanilla':
                content = [
                    { type: 'heading', text: localize('Payout') },
                    {
                        type: 'paragraph',
                        text: localize(
                            'Your payout is equal to the payout per point multiplied by the difference between the final price and the strike price.'
                        ),
                    },
                    { type: 'heading', text: localize('Final price') },
                    {
                        type: 'paragraph',
                        text: localize('This is the spot price of the last tick at expiry.'),
                    },
                    { type: 'heading', text: localize('Strike price') },
                    {
                        type: 'paragraph',
                        text: localize('You must select the strike price before entering the contract.'),
                    },
                    {
                        type: 'list',
                        text: [
                            localize(
                                'If you select "Call", you’ll earn a payout if the final price is above the strike price at expiry. Otherwise, you won’t receive a payout.'
                            ),
                            localize(
                                'If you select "Put", you’ll earn a payout if the final price is below the strike price at expiry. Otherwise, you won’t receive a payout.'
                            ),
                        ],
                    },
                    { type: 'heading', text: localize('Expiry') },
                    {
                        type: 'paragraph',
                        text: localize(
                            'This is when your contract will expire based on the Duration or End time you’ve selected.'
                        ),
                    },
                    {
                        type: 'list',
                        text: [
                            localize(
                                'If the duration is more than 24 hours, the Cut-off time and Expiry date will apply instead.'
                            ),
                        ],
                    },
                    { type: 'heading', text: localize('Payout per point') },
                    {
                        type: 'paragraph',
                        text: localize('We calculate this based on the strike price and duration you’ve selected.'),
                    },
                    { type: 'heading', text: localize('Contract value') },
                    {
                        type: 'paragraph',
                        text: localize(
                            'We’ll offer to buy your contract at this price should you choose to sell it before its expiry. This is based on several factors, such as the current spot price, duration, etc. However, we won’t offer a contract value if the remaining duration is below 60 seconds.'
                        ),
                    },
                    { type: 'heading', text: localize('Cut-off time') },
                    {
                        type: 'paragraph',
                        text: localize('Contracts will expire at exactly 23:59:59 GMT on your selected expiry date.'),
                    },
                    { type: 'heading', text: localize('Expiry date') },
                    {
                        type: 'paragraph',
                        text: localize(
                            'Your contract will expire on this date (in GMT), based on the End time you’ve selected.'
                        ),
                    },
                ];
                // ContractTypeGlossaryTemplate = (
                //     <React.Fragment>
                //         <Text as='h2' weight='bold' className='contract-type-info__content-glossary--heading'>
                //             {localize('Payout')}
                //         </Text>
                //         <Text as='p'>
                //             {localize(
                //                 'Your payout is equal to the payout per point multiplied by the difference between the final price and the strike price.'
                //             )}
                //         </Text>
                //         <Text as='h2' weight='bold' className='contract-type-info__content-glossary--heading'>
                //             {localize('Final price')}
                //         </Text>
                //         <Text as='p'>{localize('This is the spot price of the last tick at expiry.')}</Text>
                //         <Text as='h2' weight='bold' className='contract-type-info__content-glossary--heading'>
                //             {localize('Strike price')}
                //         </Text>
                //         <Text as='p'>{localize('You must select the strike price before entering the contract.')}</Text>
                //         <ul>
                //             <li>
                //                 {localize(
                //                     'If you select "Call", you’ll earn a payout if the final price is above the strike price at expiry. Otherwise, you won’t receive a payout.'
                //                 )}
                //             </li>
                //             <li>
                //                 {localize(
                //                     'If you select "Put", you’ll earn a payout if the final price is below the strike price at expiry. Otherwise, you won’t receive a payout.'
                //                 )}
                //             </li>
                //         </ul>
                //         <Text as='h2' weight='bold' className='contract-type-info__content-glossary--heading'>
                //             {localize('Expiry')}
                //         </Text>
                //         <Text as='p'>
                //             {localize(
                //                 'This is when your contract will expire based on the Duration or End time you’ve selected.'
                //             )}
                //         </Text>
                //         <ul>
                //             <li>
                //                 {localize(
                //                     'If the duration is more than 24 hours, the Cut-off time and Expiry date will apply instead.'
                //                 )}
                //             </li>
                //         </ul>
                //         <Text as='h2' weight='bold' className='contract-type-info__content-glossary--heading'>
                //             {localize('Payout per point')}
                //         </Text>
                //         <Text as='p'>
                //             {localize('We calculate this based on the strike price and duration you’ve selected.')}
                //         </Text>
                //         <Text as='h2' weight='bold' className='contract-type-info__content-glossary--heading'>
                //             {localize('Contract value')}
                //         </Text>
                //         <Text as='p'>
                //             {localize(
                //                 'We’ll offer to buy your contract at this price should you choose to sell it before its expiry. This is based on several factors, such as the current spot price, duration, etc. However, we won’t offer a contract value if the remaining duration is below 60 seconds.'
                //             )}
                //         </Text>
                //         <Text as='h2' weight='bold' className='contract-type-info__content-glossary--heading'>
                //             {localize('Cut-off time')}
                //         </Text>
                //         <Text as='p'>
                //             {localize('Contracts will expire at exactly 23:59:59 GMT on your selected expiry date.')}
                //         </Text>
                //         <Text as='h2' weight='bold' className='contract-type-info__content-glossary--heading'>
                //             {localize('Expiry date')}
                //         </Text>
                //         <Text as='p'>
                //             {localize(
                //                 'Your contract will expire on this date (in GMT), based on the End time you’ve selected.'
                //             )}
                //         </Text>
                //     </React.Fragment>
                // );
                break;
            default:
                content = [];
                break;
        }
    }
    return (
        <React.Fragment>
            {content?.map(({ type, text }: { type: string; text: string | string[] }) => {
                if (type === 'heading' && typeof text === 'string') {
                    return (
                        <Text
                            as='h2'
                            key={text.substring(0, 10)}
                            weight='bold'
                            className='contract-type-info__content-glossary--heading'
                        >
                            {text}
                        </Text>
                    );
                }
                if (type === 'paragraph' && typeof text === 'string') {
                    return (
                        <Text as='p' key={text.substring(0, 10)}>
                            {text}
                        </Text>
                    );
                }
                if (type === 'list' && typeof text !== 'string') {
                    return (
                        <ul key={text[0].substring(0, 15)}>
                            {text.map(list_item_text => (
                                <li key={list_item_text.substring(0, 20)}>{list_item_text}</li>
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
