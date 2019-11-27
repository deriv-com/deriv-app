import PropTypes         from 'prop-types';
import React             from 'react';
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
    tooltip_label,
    value,
}) => {
    return (
        <Fieldset className='trade-container__fieldset'>
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
                tooltip_label={tooltip_label}
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
    tooltip_label     : PropTypes.string,
    value             : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
};

export default LimitOrderInput;
