import React from 'react';
import { Div100vhContainer, Modal, RadioGroup, Popover, usePreventIOSZoom } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';

const MultiplierOptionsModal = ({ is_open, enableApp, disableApp, toggleModal }) => {
    // Fix to prevent iOS from zooming in erratically on quick taps
    usePreventIOSZoom();

    return (
        <React.Fragment>
            <Modal
                id='dt_trade_parameters_mobile'
                className='trade-params'
                enableApp={enableApp}
                is_open={is_open}
                is_title_centered
                disableApp={disableApp}
                toggleModal={toggleModal}
                height='auto'
                width='calc(100vw - 32px)'
                title={localize('Multiplier')}
            >
                <Div100vhContainer className='mobile-widget-dialog__wrapper' max_autoheight_offset='48px'>
                    <MultiplierOptionsWrapper toggleModal={toggleModal} />
                </Div100vhContainer>
            </Modal>
        </React.Fragment>
    );
};

export default connect(({ client, modules, ui }) => ({
    amount: modules.trade.amount,
    currency: client.currency,
    duration: modules.trade.duration,
    duration_unit: modules.trade.duration_unit,
    duration_units_list: modules.trade.duration_units_list,
    expiry_type: modules.trade.expiry_type,
    enableApp: ui.enableApp,
    disableApp: ui.disableApp,
}))(MultiplierOptionsModal);

const MultiplierOptions = ({ multiplier, multiplier_range_list, onChange, toggleModal }) => {
    const onChangeMultiplier = e => {
        onChange({
            target: {
                name: 'multiplier',
                value: Number(e.target.value),
            },
        });
        toggleModal();
    };

    return (
        <React.Fragment>
            <div className='trade-params__multiplier-icinfo-wrapper'>
                <Popover
                    alignment='top'
                    icon='info'
                    id='dt_multiplier-stake__tooltip'
                    zIndex={9999}
                    message={localize(
                        'Your gross profit is the percentage change in market price times your stake and the multiplier chosen here.'
                    )}
                />
            </div>
            <RadioGroup
                className='trade-params__multiplier-radio-group'
                name='trade-params__multiplier-radio'
                selected={!Number.isNaN(multiplier) ? multiplier.toString() : ''}
                onToggle={onChangeMultiplier}
            >
                {multiplier_range_list.map(({ text, value }) => (
                    <RadioGroup.Item key={value} id={text} label={text} value={value.toString()} />
                ))}
            </RadioGroup>
        </React.Fragment>
    );
};

const MultiplierOptionsWrapper = connect(({ ui, modules }) => ({
    multiplier: modules.trade.multiplier,
    multiplier_range_list: modules.trade.multiplier_range_list,
    onChange: modules.trade.onChange,
    addToast: ui.addToast,
}))(MultiplierOptions);
