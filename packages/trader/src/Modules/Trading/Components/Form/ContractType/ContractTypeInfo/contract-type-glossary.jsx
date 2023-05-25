import PropTypes from 'prop-types';
import React from 'react';
import { Text } from '@deriv/components';
import { localize } from '@deriv/translations';

const ContractTypeGlossary = ({ category }) => {
    let ContractTypeGlossaryTemplate;
    if (category) {
        switch (category) {
            case 'accumulator':
                ContractTypeGlossaryTemplate = (
                    <React.Fragment>
                        <Text as='h2' weight='bold' className='contract-type-info__content--glossary-heading'>
                            {localize('Growth rate')}
                        </Text>
                        <Text as='p'>
                            {localize('You can choose a growth rate with values of 1%, 2%, 3%, 4% and 5%.')}
                        </Text>
                        <Text as='h2' weight='bold' className='contract-type-info__content--glossary-heading'>
                            {localize('Range')}
                        </Text>
                        <Text as='p'>
                            {localize(
                                'It is a percentage of the previous spot price. The percentage rate is based on your choice of the index and the growth rate.'
                            )}
                        </Text>
                        <Text as='h2' weight='bold' className='contract-type-info__content--glossary-heading'>
                            {localize('Previous spot price')}
                        </Text>
                        <Text as='p'>{localize('Spot price on the previous tick.')}</Text>
                        <Text as='h2' weight='bold' className='contract-type-info__content--glossary-heading'>
                            {localize('Payout')}
                        </Text>
                        <Text as='p'>{localize('Payout is the sum of your initial stake and profit.')}</Text>
                        <Text as='h2' weight='bold' className='contract-type-info__content--glossary-heading'>
                            {localize('Slippage risk')}
                        </Text>
                        <Text as='p'>
                            {localize(
                                'Occurs when the index spot price changes by the time the order is received by our servers.'
                            )}
                        </Text>
                    </React.Fragment>
                );
                break;
            case 'vanilla':
                ContractTypeGlossaryTemplate = (
                    <React.Fragment>
                        <Text as='h2' weight='bold' className='contract-type-info__content--glossary-heading'>
                            {localize('Expiry')}
                        </Text>
                        <Text as='p'>
                            {localize(
                                'Exact time and date at which a contract will expire, based on your input of "Duration" or "End Time". For any contract duration above 24 hours, this will correspond to the cut-off time on the expiry date.'
                            )}
                        </Text>
                        <Text as='h2' weight='bold' className='contract-type-info__content--glossary-heading'>
                            {localize('Final price')}
                        </Text>
                        <Text as='p'>{localize('Spot price of the last tick upon reaching expiry.')}</Text>
                        <Text as='h2' weight='bold' className='contract-type-info__content--glossary-heading'>
                            {localize('Strike price')}
                        </Text>
                        <Text as='p'>{localize('You must select the strike price before entering the contract.')}</Text>
                        <ul>
                            <li>
                                {localize(
                                    'If you buy a "Call" option, you receive a payout at expiry if the final price is above the strike price. Otherwise, your "Call" option will expire worthless.'
                                )}
                            </li>
                            <li>
                                localize
                                {
                                    'If you buy a "Put" option, you receive a payout at expiry if the final price is below the strike price. Otherwise, your "Put" option will expire worthless.'
                                }
                            </li>
                        </ul>
                        <Text as='h2' weight='bold' className='contract-type-info__content--glossary-heading'>
                            {localize('Payout')}
                        </Text>
                        <Text as='p'>
                            {localize(
                                'This is equal to the payout per point multiplied by the difference between the final price and the strike price.'
                            )}
                        </Text>
                        <Text as='h2' weight='bold' className='contract-type-info__content--glossary-heading'>
                            {localize('Payout per point')}
                        </Text>
                        <Text as='p'>
                            {localize(
                                'This is calculated by Deriv which depends on the strike price and the expiry selected by the client.'
                            )}
                        </Text>
                        <Text as='h2' weight='bold' className='contract-type-info__content--glossary-heading'>
                            {localize('Contract value')}
                        </Text>
                        <Text as='p'>
                            {localize(
                                'Price offered by Deriv to buy back the previously purchased contract, which depends, among others, on the current spot price and the remaining duration.'
                            )}
                        </Text>
                        <Text as='h2' weight='bold' className='contract-type-info__content--glossary-heading'>
                            {localize('Cut-off time')}
                        </Text>
                        <Text as='p'>
                            {localize(
                                'Exact time at which the contract will expire, which falls at 23:59:59 GMT +0 on the expiry date.'
                            )}
                        </Text>
                        <Text as='h2' weight='bold' className='contract-type-info__content--glossary-heading'>
                            {localize('Expiry date')}
                        </Text>
                        <Text as='p'>
                            {localize(
                                'This is the day chose as "End Time" by the client. However, if the client selects a duration above 24 hours, the starting day is based on the date in GMT.'
                            )}
                        </Text>
                    </React.Fragment>
                );
                break;
            default:
                ContractTypeGlossaryTemplate = <Text as='p'>{localize('Glossary not found.')}</Text>;
                break;
        }
    }
    return <React.Fragment>{ContractTypeGlossaryTemplate}</React.Fragment>;
};

ContractTypeGlossary.propTypes = {
    category: PropTypes.string,
};

export default ContractTypeGlossary;
