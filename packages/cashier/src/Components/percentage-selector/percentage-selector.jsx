import React from 'react';
import PropTypes from 'prop-types';
import { Text } from '@deriv/components';
import { formatMoney, getDecimalPlaces } from '@deriv/shared';
import { Localize } from '@deriv/translations';

const PercentageSelector = ({ amount, currency, getCalculatedAmount, percentage, should_percentage_reset }) => {
    const [percente, setPercente] = React.useState('0');

    React.useEffect(() => {
        if (should_percentage_reset) {
            for (let i = 1; i <= 4; i++) {
                document.getElementById(i).style.backgroundColor = 'var(--general-section-1)';
            }
        }
    }, [should_percentage_reset]);

    React.useEffect(() => {
        setPercente(percentage);
    }, [percentage]);

    // React.useEffect(() => {
    //     calculateAmount(
    //         { target: { id: 0 } },
    //         0
    //     );
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [from_account, to_account]);

    const calculateAmount = (e, percent) => {
        setPercente(percent);
        getCalculatedAmount((amount * (percent / 100)).toFixed(getDecimalPlaces(currency)));

        for (let i = 1; i <= 4; i++) {
            if (i <= e.target.id) {
                document.getElementById(i).style.backgroundColor = 'var(--status-success)';
            } else {
                document.getElementById(i).style.backgroundColor = 'var(--general-section-1)';
            }
        }
    };
    const format_amount = formatMoney(currency, amount, true);
    return (
        <React.Fragment>
            <div className='percentage-selector'>
                <div className='percentage-selector__block-container'>
                    <Text color='prominent' size='xs'>
                        {'25%'}
                    </Text>
                    <div id='1' className='percentage-selector-block' onClick={e => calculateAmount(e, 25)} />
                </div>
                <div className='percentage-selector__block-container'>
                    <Text color='prominent' size='xs'>
                        {'50%'}
                    </Text>
                    <div id='2' className='percentage-selector-block' onClick={e => calculateAmount(e, 50)} />
                </div>
                <div className='percentage-selector__block-container'>
                    <Text color='prominent' size='xs'>
                        {'75%'}
                    </Text>
                    <div id='3' className='percentage-selector-block' onClick={e => calculateAmount(e, 75)} />
                </div>
                <div className='percentage-selector__block-container'>
                    <Text color='prominent' size='xs'>
                        <Localize i18n_default_text='All' />
                    </Text>
                    <div id='4' className='percentage-selector-block' onClick={e => calculateAmount(e, 100)} />
                </div>
            </div>
            <Text color='less-prominent' size='xxs' line_height='l'>
                <Localize
                    i18n_default_text={`{{percente}}% of available balance ({{format_amount}} {{currency}})`}
                    values={{ percente, format_amount, currency }}
                />
            </Text>
        </React.Fragment>
    );
};

PercentageSelector.propTypes = {
    amount: PropTypes.number,
    currency: PropTypes.string,
    getCalculatedAmount: PropTypes.func,
    should_percentage_reset: PropTypes.bool,
};

export default PercentageSelector;
