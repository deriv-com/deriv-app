import React from 'react';
import classNames from 'classnames';
import { DesktopWrapper, InputField, MobileWrapper, Money, Dropdown, Text } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { toMoment } from '@deriv/shared';
import Fieldset from 'App/Components/Form/fieldset.jsx';
import { connect } from 'Stores/connect';
import StrikeParamModal from 'Modules/Trading/Containers/strike-param-modal';

const Strike = ({
    barrier_1,
    current_focus,
    onChange,
    validation_errors,
    setCurrentFocus,
    currency,
    advanced_duration_unit,
    strike_price_choices,
    expiry_type,
    expiry_date,
    server_time,
}) => {
    const [is_open, setIsOpen] = React.useState(false);

    const toggleWidget = () => setIsOpen(!is_open);

    const is_24_hours_contract = expiry_date ? toMoment(expiry_date).isSame(toMoment(server_time), 'day') : false;

    const is_relative_strike_applicable =
        advanced_duration_unit !== 'd' || (expiry_type === 'endtime' && is_24_hours_contract);

    const strike_price_list = is_relative_strike_applicable
        ? strike_price_choices.map(strike_price => ({ text: strike_price, value: strike_price }))
        : [];

    return (
        <React.Fragment>
            <DesktopWrapper>
                <Fieldset
                    className='trade-container__fieldset trade-container__barriers'
                    header={localize('Strike')}
                    header_tooltip={
                        <Localize
                            i18n_default_text='<0>For Call:</0> You will earn a payout if the market is above this price at the expiry time. Otherwise, your payout will be zero.<1/><1/><0>For Put:</0> You will earn a payout if the market is below this price at the expiry time. Otherwise, your payout will be zero.'
                            components={[<strong key={0} />, <br key={1} />]}
                        />
                    }
                >
                    {!is_relative_strike_applicable ? (
                        <InputField
                            type='number'
                            name='barrier_1'
                            value={barrier_1}
                            className='trade-container__barriers-single'
                            classNameInput={classNames(
                                'trade-container__input',
                                'trade-container__barriers-input',
                                'trade-container__barriers-single-input'
                            )}
                            current_focus={current_focus}
                            onChange={onChange}
                            error_messages={validation_errors?.barrier_1 || []}
                            is_float
                            is_signed
                            setCurrentFocus={setCurrentFocus}
                        />
                    ) : (
                        <div className='trade-container__strike-field'>
                            <Text size='s' className='strike-field--text'>
                                {localize('Spot')}
                            </Text>
                            <Dropdown
                                classNameDisplay='dc-dropdown__display--duration'
                                disabled={false}
                                id='strike'
                                is_alignment_left
                                is_nativepicker={false}
                                list={strike_price_list}
                                name='barrier_1'
                                no_border={true}
                                onChange={onChange}
                                value={barrier_1}
                            />
                        </div>
                    )}
                </Fieldset>
            </DesktopWrapper>
            <MobileWrapper>
                <div className='mobile-widget__wrapper'>
                    <div className='strike-widget' onClick={toggleWidget}>
                        <div className='mobile-widget__amount'>
                            <Money amount={barrier_1} currency={currency} />
                        </div>
                        <div className='mobile-widget__type'>{localize('Strike')}</div>
                    </div>
                    <StrikeParamModal
                        is_open={is_open}
                        toggleModal={toggleWidget}
                        strike={barrier_1}
                        currency={currency}
                        onChange={onChange}
                    />
                </div>
            </MobileWrapper>
        </React.Fragment>
    );
};

export default connect(({ client, modules, ui, common }) => ({
    barrier_1: modules.trade.barrier_1,
    current_focus: ui.current_focus,
    currency: client.currency,
    setCurrentFocus: ui.setCurrentFocus,
    onChange: modules.trade.onChange,
    validation_errors: modules.trade.validation_errors,
    advanced_duration_unit: ui.advanced_duration_unit,
    strike_price_choices: modules.trade.strike_price_choices,
    expiry_type: modules.trade.expiry_type,
    start_date: modules.trade.start_date,
    expiry_date: modules.trade.expiry_date,
    server_time: common.server_time,
}))(Strike);
