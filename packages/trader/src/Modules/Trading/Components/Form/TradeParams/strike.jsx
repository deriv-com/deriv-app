import React from 'react';
import classNames from 'classnames';
import { DesktopWrapper, InputField, MobileWrapper, Money, Dropdown } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
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
}) => {
    const [is_open, setIsOpen] = React.useState(false);

    const toggleWidget = () => setIsOpen(!is_open);

    //TODO: Add strike values
    const mock_strike_values = [
        { text: '-1%', value: '-1' },
        { text: '0%', value: '' },
        { text: '+1%', value: '1' },
    ];

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
                    {advanced_duration_unit === 'd' ? (
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
                        <Dropdown
                            classNameDisplay='dc-dropdown__display--duration'
                            disabled={false}
                            id='strike'
                            is_alignment_left
                            is_nativepicker={false}
                            list={mock_strike_values}
                            name='barrier_1'
                            no_border={true}
                            onChange={onChange}
                            value={barrier_1}
                        />
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

export default connect(({ client, modules, ui }) => ({
    barrier_1: modules.trade.barrier_1,
    current_focus: ui.current_focus,
    currency: client.currency,
    setCurrentFocus: ui.setCurrentFocus,
    onChange: modules.trade.onChange,
    validation_errors: modules.trade.validation_errors,
    advanced_duration_unit: ui.advanced_duration_unit,
}))(Strike);
