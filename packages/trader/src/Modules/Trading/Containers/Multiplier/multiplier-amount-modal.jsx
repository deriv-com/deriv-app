import React from 'react';
import { Div100vhContainer, Modal, Money, Popover } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import AmountMobile from 'Modules/Trading/Components/Form/TradeParams/amount-mobile.jsx';

const MultiplierAmountModal = ({ is_open, enableApp, disableApp, toggleModal }) => {
    // Fix to prevent iOS from zooming in erratically on quick taps
    const preventIOSZoom = React.useCallback(event => {
        if (event.touches.length > 1) {
            event.preventDefault();
            event.stopPropagation();
        }
    }, []);

    React.useEffect(() => {
        document.addEventListener('touchstart', event => preventIOSZoom(event), { passive: false });
        return () => {
            document.removeEventListener('touchstart', event => preventIOSZoom(event));
        };
    }, [preventIOSZoom]);

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
                title={localize('Stake')}
            >
                <Div100vhContainer className='mobile-widget-dialog__wrapper' max_autoheight_offset='48px'>
                    <TradeParamsMobileWrapper toggleModal={toggleModal} />
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
}))(MultiplierAmountModal);

const TradeParamsMobile = ({ amount, currency, toggleModal }) => {
    const [stake_value, setStakeValue] = React.useState(amount);

    const setSelectedAmount = (basis, stake) => {
        setStakeValue(stake);
    };

    return (
        <React.Fragment>
            <div className='trade-params__multiplier-icinfo-wrapper'>
                <Popover
                    alignment='top'
                    icon='info'
                    id='dt_multiplier-stake__tooltip'
                    zIndex={9999}
                    message={
                        <Localize
                            i18n_default_text='To ensure your loss does not exceed your stake, your contract will be closed automatically when your loss equals to <0/>.'
                            components={[<Money key={0} amount={stake_value} currency={currency} />]}
                        />
                    }
                />
            </div>
            <AmountMobile
                toggleModal={toggleModal}
                amount_tab_idx={0}
                setSelectedAmount={setSelectedAmount}
                setAmountError={() => {}}
                stake_value={stake_value}
            />
        </React.Fragment>
    );
};

const TradeParamsMobileWrapper = connect(({ ui, modules }) => ({
    amount: modules.trade.amount,
    currency: modules.trade.currency,
    multiplier: modules.trade.multiplier,
    multiplier_range_list: modules.trade.multiplier_range_list,
    onChange: modules.trade.onChange,
    addToast: ui.addToast,
}))(TradeParamsMobile);
