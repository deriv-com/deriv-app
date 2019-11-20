import PropTypes         from 'prop-types';
import React             from 'react';
import { localize }      from 'App/i18n';
import Fieldset          from 'App/Components/Form/fieldset.jsx';
import InputWithCheckbox from 'App/Components/Form/InputField/input-with-checkbox.jsx';

const LimitOrderInput = ({
    currency,
    defaultChecked,
    error_messages,
    is_single_currency,
    label,
    name,
    onChange,
    value,
}) => {
    return (
        <Fieldset className='trade-container__fieldset center-text'>
            <InputWithCheckbox
                className='trade-container__amount'
                classNameInlinePrefix='trade-container__currency'
                classNameInput='trade-container__input'
                currency={currency}
                defaultChecked={defaultChecked}
                error_messages={error_messages}
                is_single_currency={is_single_currency}
                is_negative_disabled={true}
                label={label}
                name={name}
                onChange={onChange}
                tooltip_label={localize('Close the deal when my loss reaches this amount.')}
                value={value}
            />
        </Fieldset>
    );
};

LimitOrderInput.propTypes = {
    currency          : PropTypes.string,
    error_messages    : PropTypes.array,
    is_single_currency: PropTypes.bool,
    label             : PropTypes.string,
    name              : PropTypes.string,
    onChange          : PropTypes.func,
    value             : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
};

export default LimitOrderInput;
