import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import { AMOUNT_MAX_LENGTH, getDecimalPlaces } from '@deriv/shared';
import { MobileWrapper } from '@deriv/components';
import { localize } from '@deriv/translations';
import LabeledQuantityInputMobile from '../../LabeledQuantityInputMobile';
import { observer, useStore } from '@deriv/stores';
import { useTraderStore } from 'Stores/useTraderStores';

const AccumulatorsAmountMobile = observer(({ is_nativepicker }) => {
    const { ui, client } = useStore();
    const { current_focus, setCurrentFocus } = ui;
    const { is_single_currency } = client;
    const { amount, currency, onChange } = useTraderStore();
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
});

AccumulatorsAmountMobile.propTypes = {
    is_nativepicker: PropTypes.bool,
};

export default AccumulatorsAmountMobile;
