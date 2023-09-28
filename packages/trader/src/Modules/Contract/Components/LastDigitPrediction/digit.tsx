import classNames from 'classnames';
import React from 'react';

type TDigit = {
    is_latest?: boolean;
    is_lost?: boolean;
    is_selected?: boolean;
    is_won?: boolean;
    percentage: number | null;
    value: number;
};

const Digit = ({ is_latest, is_lost, is_selected, is_won, percentage, value }: TDigit) => {
    const display_percentage = percentage && !isNaN(percentage) ? parseFloat(percentage.toFixed(1)) : null;
    return (
        <React.Fragment>
            <span
                className={classNames('digits__digit-value', {
                    'digits__digit-value--latest': is_latest,
                    'digits__digit-value--selected': is_selected,
                    'digits__digit-value--win': is_won && is_latest,
                    'digits__digit-value--loss': is_lost && is_latest,
                })}
            >
                <i
                    className={classNames('digits__digit-display-value', {
                        'digits__digit-display-value--no-stats': !display_percentage,
                    })}
                >
                    {value}
                </i>
                {!!display_percentage && <i className='digits__digit-display-percentage'>{display_percentage}%</i>}
            </span>
        </React.Fragment>
    );
};

export default Digit;
