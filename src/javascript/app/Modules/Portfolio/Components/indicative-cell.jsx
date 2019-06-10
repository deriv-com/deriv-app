import PropTypes    from 'prop-types';
import React        from 'react';
import { localize } from 'App/i18n';
import Money        from 'App/Components/Elements/money.jsx';

const IndicativeCell = ({ amount, currency, status }) => {
    const status_class_name = status
        ? `indicative--${status}`
        : undefined;

    return (
        <div className={status_class_name}>
            <Money amount={amount} currency={currency} />

            {status === 'no-resale' &&
                <div className='indicative__no-resale-msg'>
                    {localize('Resale not offered')}
                </div>
            }
        </div>
    );
};

IndicativeCell.propTypes = {
    amount  : PropTypes.number,
    currency: PropTypes.string,
    status  : PropTypes.string,
};

export default IndicativeCell;
