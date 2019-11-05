import PropTypes         from 'prop-types';
import React             from 'react';
import { localize }      from 'App/i18n';
import Fieldset          from 'App/Components/Form/fieldset.jsx';
import InputWithCheckbox from 'App/Components/Form/InputField/input-with-checkbox.jsx';

const LimitOrderInput = ({
    currency,
    is_single_currency,
    label,
    name,
    onChange,
    validation_errors,
    value,
}) => {
    return (
        <Fieldset className='trade-container__fieldset center-text'>
            <InputWithCheckbox
                className='trade-container__amount'
                classNameInlinePrefix='trade-container__currency'
                classNameInput='trade-container__input'
                currency={currency}
                is_single_currency={is_single_currency}
                label={label}
                name={name}
                onChange={onChange}
                tooltip_label={localize('Close the deal when my loss reaches this amount.')}
                validation_errors={validation_errors}
                value={value}
            />
        </Fieldset>
    );
};

LimitOrderInput.propTypes = {
    currency          : PropTypes.string,
    is_single_currency: PropTypes.bool,
    label             : PropTypes.string,
    name              : PropTypes.string,
    onChange          : PropTypes.func,
    validation_errors : PropTypes.object,
    value             : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
};

export default LimitOrderInput;
