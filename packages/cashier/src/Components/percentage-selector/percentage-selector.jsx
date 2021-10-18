import React from 'react';
import PropTypes from 'prop-types';
import { Text } from '@deriv/components';
import { formatMoney, getCurrencyDisplayCode, getDecimalPlaces } from '@deriv/shared';
import { Localize } from '@deriv/translations';

const PercentageSelector = ({
    amount,
    currency,
    from_account,
    getCalculatedAmount,
    percentage,
    should_percentage_reset,
    to_account,
}) => {
    const [selected_percentage, setSelectedPercentage] = React.useState('0');

    React.useEffect(() => {
        if (should_percentage_reset) {
            for (let i = 1; i <= 4; i++) {
                document.getElementById(i).style.backgroundColor = 'var(--general-section-1)';
            }
        }
    }, [should_percentage_reset]);

    React.useEffect(() => {
        setSelectedPercentage(percentage || 0);
    }, [percentage]);

    React.useEffect(() => {
        calculateAmount({ target: { id: 0 } }, 0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [from_account, to_account]);

    const calculateAmount = (e, percent) => {
        let new_percentage = percent;
        const is_percentage_selected = percent > 0 && percent <= selected_percentage;
        if (is_percentage_selected) new_percentage -= 25;

        setSelectedPercentage(new_percentage || 0);
        getCalculatedAmount((amount * (new_percentage / 100)).toFixed(getDecimalPlaces(currency)));

        for (let i = 1; i <= 4; i++) {
            if (i < e.target.id || (i === +e.target.id && !is_percentage_selected)) {
                document.getElementById(i).style.backgroundColor = 'var(--status-success)';
            } else {
                document.getElementById(i).style.backgroundColor = 'var(--general-section-1)';
            }
        }
    };
    const format_amount = formatMoney(currency, amount, true);
    const currency__display_code = getCurrencyDisplayCode(currency);
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
                    i18n_default_text={`{{selected_percentage}}% of available balance ({{format_amount}} {{currency__display_code}})`}
                    values={{ selected_percentage, format_amount, currency__display_code }}
                />
            </Text>
        </React.Fragment>
    );
};

PercentageSelector.propTypes = {
    amount: PropTypes.number,
    currency: PropTypes.string,
    getCalculatedAmount: PropTypes.func,
    percentage: PropTypes.number,
    should_percentage_reset: PropTypes.bool,
};

export default PercentageSelector;
