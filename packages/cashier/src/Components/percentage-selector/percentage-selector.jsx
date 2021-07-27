import React from 'react';
import PropTypes from 'prop-types';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';

const PercentageBlock = ({ calculateAmount, percentage_number }) => {
    return (
        <div className='percentage-selector__block-container'>
            <Text color='prominent' size='xs'>
                {`${percentage_number.value}%`}
            </Text>
            <div
                id={percentage_number.id}
                className='percentage-selector-block'
                onClick={e => calculateAmount(e, percentage_number.value)}
            />
        </div>
    );
};

const PercentageSelector = ({ amount, currency, getCalculatedAmount }) => {
    const [percentage, setPercentage] = React.useState(0);
    const percentage_numbers = [
        { id: 1, value: 25 },
        { id: 2, value: 50 },
        { id: 3, value: 75 },
        { id: 4, value: 100 },
    ];

    const calculateAmount = (e, percent) => {
        setPercentage(percent);

        for (let i = 1; i <= 4; i++) {
            if (i <= e.target.id) {
                document.getElementById(i).style.backgroundColor = 'blue'; // TODO: Change color when design is updated
            } else {
                document.getElementById(i).style.backgroundColor = '#f2f3f4';
            }
        }

        if (typeof getCalculatedAmount === 'function') {
            getCalculatedAmount(amount * (percentage / 100));
        }
    };

    return (
        <React.Fragment>
            <div className='percentage-selector'>
                {percentage_numbers.map(percentage_number => {
                    return (
                        <PercentageBlock
                            key={percentage_number.id}
                            calculateAmount={calculateAmount}
                            percentage_number={percentage_number}
                        />
                    );
                })}
            </div>
            <Text color='less-prominent' size='s'>
                <Localize
                    i18n_default_text='{{percentage}}% of available balance ({{amount}} {{currency}})'
                    values={{ percentage, amount, currency }}
                />
            </Text>
        </React.Fragment>
    );
};

PercentageSelector.propTypes = {
    amount: PropTypes.number,
    currency: PropTypes.string,
    total_amount: PropTypes.number,
};

export default PercentageSelector;
