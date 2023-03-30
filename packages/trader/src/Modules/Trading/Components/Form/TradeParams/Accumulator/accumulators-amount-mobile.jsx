import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import { AMOUNT_MAX_LENGTH, getDecimalPlaces } from '@deriv/shared';
import { MobileWrapper } from '@deriv/components';
import { connect } from 'Stores/connect';
import { localize } from '@deriv/translations';
import LabeledQuantityInputMobile from '../../LabeledQuantityInputMobile';

const AccumulatorsAmountMobile = ({
    amount,
    currency,
    current_focus,
    is_nativepicker,
    is_single_currency,
    onChange,
    setCurrentFocus,
}) => {
    return (
        <>
            <MobileWrapper>
                <LabeledQuantityInputMobile
                    input_label={localize('Stake')}
                    className={classNames('trade-container__amount', 'trade-container__amount--accumulator')}
                    classNameInlinePrefix='trade-container__currency'
                    classNameInput={classNames('trade-container__input', 'trade-container__input--accumulator')}
                    currency={currency}
                    current_focus={current_focus}
                    fractional_digits={getDecimalPlaces(currency)}
                    id='dt_amount_input'
                    inline_prefix={is_single_currency ? currency : null}
                    is_autocomplete_disabled
                    is_float
                    is_hj_whitelisted
                    is_incrementable
                    is_nativepicker={is_nativepicker}
                    is_negative_disabled
                    max_length={AMOUNT_MAX_LENGTH}
                    name='amount'
                    onChange={onChange}
                    type='tel'
                    value={amount}
                    ariaLabel={localize('Amount')}
                    setCurrentFocus={setCurrentFocus}
                />
            </MobileWrapper>
        </>
    );
};

AccumulatorsAmountMobile.propTypes = {
    amount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    currency: PropTypes.string,
    current_focus: PropTypes.string,
    is_nativepicker: PropTypes.bool,
    is_single_currency: PropTypes.bool,
    onChange: PropTypes.func,
    setCurrentFocus: PropTypes.func,
};

export default connect(({ modules, client, ui }) => ({
    amount: modules.trade.amount,
    currency: modules.trade.currency,
    current_focus: ui.current_focus,
    is_single_currency: client.is_single_currency,
    onChange: modules.trade.onChange,
    setCurrentFocus: ui.setCurrentFocus,
}))(AccumulatorsAmountMobile);
