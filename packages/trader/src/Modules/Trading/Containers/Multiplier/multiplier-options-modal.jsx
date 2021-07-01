import React from 'react';
import { Div100vhContainer, Modal, RadioGroup, Popover, usePreventIOSZoom } from '@deriv/components';
import MultipliersInfo from 'Modules/Trading/Components/Form/TradeParams/Multiplier/info.jsx';
import { requestPreviewProposal } from 'Stores/Modules/Trading/Helpers/preview-proposal';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { useIsMounted, WS } from '@deriv/shared';

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
                should_header_stick_body={false}
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

const MultiplierOptions = ({ amount, multiplier, multiplier_range_list, onChange, toggleModal, trade_store }) => {
    const [commission, setCommission] = React.useState(null);
    const [stop_out, setStopOut] = React.useState(null);
    const isMounted = useIsMounted();

    React.useEffect(() => {
        if (!amount) return undefined;

        const onProposalResponse = response => {
            const { proposal, echo_req, subscription } = response;
            if (isMounted() && proposal && echo_req.contract_type === 'MULTUP' && Number(echo_req.amount) === amount) {
                setCommission(proposal.commission);
                setStopOut(proposal.limit_order?.stop_out?.order_amount);
            } else if (subscription?.id) {
                WS.forget(subscription.id);
            }
        };
        const dispose = requestPreviewProposal(trade_store, { amount }, onProposalResponse);

        return () => {
            dispose?.();
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [amount]);

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
            <div className='trade-params__multiplier-ic-info-wrapper'>
                <Popover
                    alignment='right'
                    icon='info'
                    id='dt_multiplier-stake__tooltip'
                    is_bubble_hover_enabled
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
            <MultipliersInfo
                className='trade-params__multiplier-trade-info'
                should_show_tooltip
                commission={commission}
                stop_out={stop_out}
                amount={amount}
            />
        </React.Fragment>
    );
};

const MultiplierOptionsWrapper = connect(({ ui, modules }) => ({
    amount: modules.trade.amount,
    currency: modules.trade.currency,
    multiplier: modules.trade.multiplier,
    multiplier_range_list: modules.trade.multiplier_range_list,
    onChange: modules.trade.onChange,
    trade_store: modules.trade,
    addToast: ui.addToast,
}))(MultiplierOptions);
