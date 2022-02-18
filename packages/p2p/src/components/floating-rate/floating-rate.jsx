import React from 'react';
import { useStores } from 'Stores';
// import { connect } from 'Stores/connect';
import { InputField, IncrementButtons, Input, Text } from '@deriv/components';
import { isDesktop } from '@deriv/shared';
import './floating-rate.scss';
// import IncrementButtons from '@deriv/components/src/components/input-field/increment-buttons';

const FloatingRate = () => {
    const { general_store } = useStores();
    const [floating_rate, setFloatingRate] = React.useState('');
    const [error_messages, setErrorMessage] = React.useState(null);

    const { currency, local_currency_config } = general_store.client;
    console.log('In FL - local_currency_config.currency: ', local_currency_config);

    const onChangeHandler = event => {
        setFloatingRate(event.target.value);
    };

    return (
        <div className='floating-rate'>
            <InputField
                ariaLabel='Floating Rate'
                className='floating-rate__field'
                classNameInlinePrefix='floating-rate__percent'
                classNameInput='floating-rate__input'
                error_messages={error_messages}
                // helper={helper}
                id='floating_rate_input'
                inline_prefix='%'
                is_autocomplete_disabled
                is_float
                is_incrementable
                is_signed
                inputmode='decimal'
                name='floating_rate_input'
                required
                type='number'
                value={floating_rate}
                onChange={onChangeHandler}
                setCurrentFocus={general_store.props.setCurrentFocus}
            />
            <div className='floating-rate__mkt-rate'>
                <span className='floating-rate__mkt-rate__label'> of the market rate</span>
                <span className='floating-rate__mkt-rate__msg'>
                    1 {currency} = {local_currency_config?.currency}
                </span>
            </div>
        </div>
    );
};

export default FloatingRate;
