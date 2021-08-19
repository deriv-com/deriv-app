import React from 'react';
import PropTypes from 'prop-types';
import { Text } from '@deriv/components';
import { getDecimalPlaces, validNumber } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import { useFormikContext} from 'formik';

const PercentageSelector = ({ amount, currency, getCalculatedAmount }) => {
    const { errors, setFieldValue, setFieldTouched, setFieldError, validateField } = useFormikContext();
    const [percentage, setPercentage] = React.useState('0');

    React.useEffect(() => {
        calculateAmount(
            { target: { id: 0 } },
            0
        );
    }, [amount]); 

    const calculateAmount = (e, percent) => {
        setPercentage(percent);

        for (let i = 1; i <= 4; i++) {
            if (i <= e.target.id) {
                document.getElementById(i).style.backgroundColor = 'var(--status-success)';
            } else {
                document.getElementById(i).style.backgroundColor = 'var(--general-section-1)';
            }
        }
        
        getCalculatedAmount((amount * (percent / 100)).toFixed(getDecimalPlaces(currency)));
    };

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
            <Text color='less-prominent' size='xxs'>
                <Localize
                    i18n_default_text={`{{percentage}}% of available balance ({{amount}} {{currency}})`}
                    values={{ percentage, amount, currency }}
                />
            </Text>
        </React.Fragment>
    );
};

PercentageSelector.propTypes = {
    amount: PropTypes.number,
    currency: PropTypes.string,
    getCalculatedAmount: PropTypes.func,
};

export default PercentageSelector;
