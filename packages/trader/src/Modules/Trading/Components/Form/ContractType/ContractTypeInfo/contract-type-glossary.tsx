import React from 'react';
import { Text } from '@deriv/components';
import { localize } from '@deriv/translations';

const ContractTypeGlossary = ({ category }: { category: string }) => {
    let ContractTypeGlossaryTemplate;
    if (category) {
        switch (category) {
            case 'accumulator':
                ContractTypeGlossaryTemplate = (
                    <React.Fragment>
                        <Text as='h2' weight='bold' className='contract-type-info__content-glossary--heading'>
                            {localize('Growth rate')}
                        </Text>
                        <Text as='p'>
                            {localize('You can choose a growth rate with values of 1%, 2%, 3%, 4%, and 5%.')}
                        </Text>
                        <Text as='h2' weight='bold' className='contract-type-info__content-glossary--heading'>
                            {localize('Payout')}
                        </Text>
                        <Text as='p'>{localize('Payout is the sum of your initial stake and profit.')}</Text>
                        <Text as='h2' weight='bold' className='contract-type-info__content-glossary--heading'>
                            {localize('Range')}
                        </Text>
                        <Text as='p'>
                            {localize(
                                'It is a percentage of the previous spot price. The percentage rate is based on your choice of the index and the growth rate.'
                            )}
                        </Text>
                        <Text as='h2' weight='bold' className='contract-type-info__content-glossary--heading'>
                            {localize('Previous spot price')}
                        </Text>
                        <Text as='p'>{localize('Spot price on the previous tick.')}</Text>
                        <Text as='h2' weight='bold' className='contract-type-info__content-glossary--heading'>
                            {localize('Slippage risk')}
                        </Text>
                        <Text as='p'>
                            {localize(
                                'The spot price may change by the time your order reaches our servers. When this happens, your payout maybe affected.'
                            )}
                        </Text>
                    </React.Fragment>
                );
                break;
            case 'vanilla':
                ContractTypeGlossaryTemplate = (
                    <React.Fragment>
                        <Text as='h2' weight='bold' className='contract-type-info__content-glossary--heading'>
                            {localize('Payout')}
                        </Text>
                        <Text as='p'>
                            {localize(
                                'Your payout is equal to the payout per point multiplied by the difference between the final price and the strike price.'
                            )}
                        </Text>
                        <Text as='h2' weight='bold' className='contract-type-info__content-glossary--heading'>
                            {localize('Final price')}
                        </Text>
                        <Text as='p'>{localize('This is the spot price of the last tick at expiry.')}</Text>
                        <Text as='h2' weight='bold' className='contract-type-info__content-glossary--heading'>
                            {localize('Strike price')}
                        </Text>
                        <Text as='p'>{localize('You must select the strike price before entering the contract.')}</Text>
                        <ul>
                            <li>
                                {localize(
                                    'If you select "Call", you’ll earn a payout if the final price is above the strike price at expiry. Otherwise, you won’t receive a payout.'
                                )}
                            </li>
                            <li>
                                {localize(
                                    'If you select "Put", you’ll earn a payout if the final price is below the strike price at expiry. Otherwise, you won’t receive a payout.'
                                )}
                            </li>
                        </ul>
                        <Text as='h2' weight='bold' className='contract-type-info__content-glossary--heading'>
                            {localize('Expiry')}
                        </Text>
                        <Text as='p'>
                            {localize(
                                'This is when your contract will expire based on the Duration or End time you’ve selected.'
                            )}
                        </Text>
                        <ul>
                            <li>
                                {localize(
                                    'If the duration is more than 24 hours, the Cut-off time and Expiry date will apply instead.'
                                )}
                            </li>
                        </ul>
                        <Text as='h2' weight='bold' className='contract-type-info__content-glossary--heading'>
                            {localize('Payout per point')}
                        </Text>
                        <Text as='p'>
                            {localize('We calculate this based on the strike price and duration you’ve selected.')}
                        </Text>
                        <Text as='h2' weight='bold' className='contract-type-info__content-glossary--heading'>
                            {localize('Contract value')}
                        </Text>
                        <Text as='p'>
                            {localize(
                                'We’ll offer to buy your contract at this price should you choose to sell it before its expiry. This is based on several factors, such as the current spot price, duration, etc. However, we won’t offer a contract value if the remaining duration is below 60 seconds.'
                            )}
                        </Text>
                        <Text as='h2' weight='bold' className='contract-type-info__content-glossary--heading'>
                            {localize('Cut-off time')}
                        </Text>
                        <Text as='p'>
                            {localize('Contracts will expire at exactly 23:59:59 GMT on your selected expiry date.')}
                        </Text>
                        <Text as='h2' weight='bold' className='contract-type-info__content-glossary--heading'>
                            {localize('Expiry date')}
                        </Text>
                        <Text as='p'>
                            {localize(
                                'Your contract will expire on this date (in GMT), based on the End time you’ve selected.'
                            )}
                        </Text>
                    </React.Fragment>
                );
                break;
            default:
                ContractTypeGlossaryTemplate = <React.Fragment />;
                break;
        }
    }
    return <React.Fragment>{ContractTypeGlossaryTemplate}</React.Fragment>;
};

export default ContractTypeGlossary;
