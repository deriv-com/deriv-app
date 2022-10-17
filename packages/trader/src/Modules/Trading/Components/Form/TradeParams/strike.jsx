import React from 'react';
import classNames from 'classnames';
// import PropTypes from 'prop-types';
import { DesktopWrapper, InputField, MobileWrapper, Money } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import Fieldset from 'App/Components/Form/fieldset.jsx';
import { connect } from 'Stores/connect';
import StrikeParamModal from 'Modules/Trading/Containers/strike-param-modal';

const Strike = ({ strike, current_focus, onChange, validation_errors, setCurrentFocus, currency }) => {
    const [is_open, setIsOpen] = React.useState(false);

    const toggleWidget = () => setIsOpen(!is_open);

    return (
        <React.Fragment>
            <DesktopWrapper>
                <Fieldset
                    className='trade-container__fieldset trade-container__barriers'
                    header={localize('Strike')}
                    header_tooltip={
                        <Localize i18n_default_text='Your gross profit is the percentage change in market price times your stake and the multiplier chosen here.' />
                    }
                >
                    <InputField
                        type='number'
                        name='strike'
                        value={strike}
                        className='trade-container__barriers-single'
                        classNameInput={classNames(
                            'trade-container__input',
                            'trade-container__barriers-input',
                            'trade-container__barriers-single-input'
                        )}
                        current_focus={current_focus}
                        onChange={onChange}
                        error_messages={validation_errors?.strike || []}
                        is_float
                        setCurrentFocus={setCurrentFocus}
                    />
                </Fieldset>
            </DesktopWrapper>
            <MobileWrapper>
                <div className='mobile-widget__wrapper'>
                    <div className='strike-widget' onClick={toggleWidget}>
                        <div className='mobile-widget__amount'>
                            <Money amount={strike} currency={currency} />
                        </div>
                        <div className='mobile-widget__type'>{localize('Strike')}</div>
                    </div>
                    <StrikeParamModal
                        is_open={is_open}
                        toggleModal={toggleWidget}
                        strike={strike}
                        currency={currency}
                        onChange={onChange}
                    />
                </div>
            </MobileWrapper>
        </React.Fragment>
    );
};

export default connect(({ client, modules, ui }) => ({
    strike: modules.trade.strike,
    current_focus: ui.current_focus,
    currency: client.currency,
    setCurrentFocus: ui.setCurrentFocus,
    onChange: modules.trade.onChange,
    validation_errors: modules.trade.validation_errors,
}))(Strike);
