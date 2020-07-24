import classNames from 'classnames';
import React from 'react';
import { Div100vhContainer, Tabs, Modal, Money, RadioGroup, Icon } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import AmountMobile from 'Modules/Trading/Components/Form/TradeParams/amount-mobile.jsx';
import ToastErrorPopup from 'Modules/Trading/Containers/toast-error-popup.jsx';
import 'Sass/app/modules/trading-mobile.scss';

const MultiplierTradeParamsModal = ({ is_open, enableApp, disableApp, toggleModal, form_components }) => {
    // Fix to prevent iOS from zooming in erratically on quick taps
    const preventIOSZoom = event => {
        if (event.touches.length > 1) {
            event.preventDefault();
            event.stopPropagation();
        }
    };

    React.useEffect(() => {
        document.addEventListener('touchstart', event => preventIOSZoom(event), { passive: false });
        return () => {
            document.removeEventListener('touchstart', event => preventIOSZoom(event));
        };
    }, [preventIOSZoom]);

    const isVisible = component_key => form_components.includes(component_key);

    return (
        <React.Fragment>
            <ToastErrorPopup
                portal_id={is_open ? 'modal_root' : null}
                className={classNames('trade-params__error-popup', {
                    'trade-params__error-popup--has-numpad': is_open,
                })}
            />
            <Modal
                id='dt_trade_parameters_mobile'
                className='trade-params'
                enableApp={enableApp}
                is_open={is_open}
                is_vertical_top
                header={<div />}
                disableApp={disableApp}
                toggleModal={toggleModal}
                height='auto'
                width='calc(100vw - 32px)'
            >
                <Div100vhContainer className='mobile-widget-dialog__wrapper' max_autoheight_offset='48px'>
                    <TradeParamsMobileWrapper toggleModal={toggleModal} isVisible={isVisible} />
                </Div100vhContainer>
            </Modal>
        </React.Fragment>
    );
};

export default connect(({ client, modules, ui }) => ({
    amount: modules.trade.amount,
    form_components: modules.trade.form_components,
    currency: client.currency,
    duration: modules.trade.duration,
    duration_unit: modules.trade.duration_unit,
    duration_units_list: modules.trade.duration_units_list,
    expiry_type: modules.trade.expiry_type,
    enableApp: ui.enableApp,
    disableApp: ui.disableApp,
}))(MultiplierTradeParamsModal);

const TradeParamsMobile = ({
    amount,
    currency,
    commission,
    multiplier,
    toggleModal,
    isVisible,
    is_purchase_enabled,
    multiplier_range_list,
    onChange,
    addToast,
}) => {
    const [stake_value, setStakeValue] = React.useState(amount);
    const [has_amount_error, setAmountError] = React.useState(false);

    const getAmountText = () => {
        return <Money currency={currency} amount={stake_value} />;
    };

    const setSelectedAmount = (basis, stake) => {
        setStakeValue(stake);
    };

    const getHeaderValues = tab_key => {
        if (tab_key === 'amount') {
            return {
                label: localize('Stake'),
                value: has_amount_error ? localize('Error') : getAmountText(),
                has_error: has_amount_error,
            };
        } else if (tab_key === 'multiplier') {
            return {
                label: localize('Multiplier'),
                value: `x${multiplier}`,
            };
        }
        return null;
    };

    const getHeaderContent = tab_key => {
        const header_values = getHeaderValues(tab_key);
        if (!header_values) return null;

        const { label, value, has_error } = header_values;
        return (
            <div className='trade-params__header'>
                <div className='trade-params__header-label'>{label}</div>
                <div
                    className={classNames('trade-params__header-value', {
                        'trade-params__header-value--has-error': has_error,
                    })}
                >
                    {value}
                </div>
            </div>
        );
    };

    const onChangeMultiplier = e => {
        onChange({
            target: {
                name: 'multiplier',
                value: Number(e.target.value),
            },
        });
    };

    const showCommissionToast = () => {
        const text = (
            <Localize
                i18n_default_text='<0>{{commission_percentage}}%</0> of (<1/> * {{multiplier}})'
                values={{ commission_percentage, multiplier }}
                components={[<span className='bold' key={0} />, <Money key={1} amount={amount} currency={currency} />]}
            />
        );

        addToast({
            key: 'multiplier_commission',
            content: text,
            type: 'info',
        });
    };

    const showStakeToast = () => {
        const text = (
            <Localize
                i18n_default_text='To ensure your loss does not exceed your stake, your contract will be closed automatically when your loss equals to <0/>.'
                components={[<Money key={0} amount={stake_value} currency={currency} />]}
            />
        );

        addToast({
            key: 'multiplier_stake',
            content: text,
            type: 'info',
        });
    };

    const showMultiplierToast = () => {
        const text = localize('Your profit and loss are multiplied by this amount.');

        addToast({
            key: 'multiplier',
            content: text,
            type: 'info',
        });
    };

    const commission_percentage = Number((commission * 100) / (multiplier * amount)).toFixed(4);

    const commission_message = (
        <div className='trade-params__multiplier-commission-tooltip'>
            <Localize
                i18n_default_text='Commission: <0/>'
                components={[<Money key={0} amount={commission} currency={currency} />]}
            />
            <Icon icon='IcInfoOutline' onClick={showCommissionToast} />
        </div>
    );

    return (
        <Tabs className='trade-params__multiplier-tabs' top>
            {isVisible('amount') && (
                <div header_content={getHeaderContent('amount')}>
                    <div className='trade-params__multiplier-icinfo-wrapper'>
                        <Icon icon='IcInfoOutline' onClick={showStakeToast} />
                    </div>
                    <AmountMobile
                        toggleModal={toggleModal}
                        amount_tab_idx={0}
                        setSelectedAmount={setSelectedAmount}
                        setAmountError={setAmountError}
                        stake_value={stake_value}
                    />
                    {commission_message}
                </div>
            )}
            {isVisible('multiplier') && (
                <div header_content={getHeaderContent('multiplier')}>
                    <div className='trade-params__multiplier-icinfo-wrapper'>
                        <Icon icon='IcInfoOutline' onClick={showMultiplierToast} />
                    </div>
                    <RadioGroup
                        className='trade-params__multiplier-radio-group'
                        name='trade-params__multiplier-radio'
                        items={multiplier_range_list.map(({ text, value }) => ({
                            id: text,
                            label: text,
                            value: value.toString(),
                        }))}
                        selected={!Number.isNaN(multiplier) ? multiplier.toString() : ''}
                        onToggle={onChangeMultiplier}
                    />
                    {is_purchase_enabled && commission_message}
                </div>
            )}
        </Tabs>
    );
};

const TradeParamsMobileWrapper = connect(({ ui, modules }) => ({
    amount: modules.trade.amount,
    currency: modules.trade.currency,
    commission: modules.trade.commission,
    multiplier: modules.trade.multiplier,
    multiplier_range_list: modules.trade.multiplier_range_list,
    is_purchase_enabled: modules.trade.is_purchase_enabled,
    onChange: modules.trade.onChange,
    addToast: ui.addToast,
}))(TradeParamsMobile);
