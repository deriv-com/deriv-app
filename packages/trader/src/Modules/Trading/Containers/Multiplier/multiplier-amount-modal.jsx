import React from 'react';
import { Div100vhContainer, Modal, Money, Popover, usePreventIOSZoom } from '@deriv/components';
import { useIsMounted, WS } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { requestPreviewProposal } from 'Stores/Modules/Trading/Helpers/preview-proposal';
import AmountMobile from 'Modules/Trading/Components/Form/TradeParams/amount-mobile.jsx';
import MultipliersInfo from 'Modules/Trading/Components/Form/TradeParams/Multiplier/info.jsx';
import { observer, useStore } from '@deriv/stores';
import { useTraderStore } from 'Stores/useTraderStores';

const MultiplierAmountModal = observer(({ is_open, toggleModal }) => {
    // Fix to prevent iOS from zooming in erratically on quick taps
    usePreventIOSZoom();
    const {
        ui: { enableApp, disableApp },
    } = useStore();

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
                title={localize('Stake')}
            >
                <Div100vhContainer className='mobile-widget-dialog__wrapper' max_autoheight_offset='48px'>
                    <TradeParamsMobile toggleModal={toggleModal} />
                </Div100vhContainer>
            </Modal>
        </React.Fragment>
    );
});

export default MultiplierAmountModal;

const TradeParamsMobile = observer(({ toggleModal }) => {
    const { amount, currency, trade_stop_out, trade_store } = useTraderStore();

    const [stake_value, setStakeValue] = React.useState(amount);
    const [commission, setCommission] = React.useState(null);
    const [stop_out, setStopOut] = React.useState(null);
    const stake_ref = React.useRef(amount);
    const isMounted = useIsMounted();

    React.useEffect(() => {
        if (stake_value === amount) return undefined;

        const onProposalResponse = response => {
            const { proposal, echo_req, subscription } = response;
            if (
                isMounted() &&
                proposal &&
                echo_req.contract_type === 'MULTUP' &&
                Number(echo_req.amount) === Number(stake_ref.current)
            ) {
                setCommission(proposal.commission);
                setStopOut(proposal.limit_order?.stop_out?.order_amount);
            } else if (subscription?.id) {
                WS.forget(subscription.id);
            }
        };
        const dispose = requestPreviewProposal(trade_store, { amount: stake_value }, onProposalResponse);

        return () => {
            dispose?.();
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stake_value]);

    const setSelectedAmount = (basis, stake) => {
        setStakeValue(stake);
        stake_ref.current = stake;
    };

    return (
        <React.Fragment>
            <div className='trade-params__multiplier-ic-info-wrapper'>
                <Popover
                    alignment='right'
                    icon='info'
                    id='dt_multiplier-stake__tooltip'
                    zIndex={9999}
                    is_bubble_hover_enabled
                    message={
                        <Localize
                            i18n_default_text='To ensure your loss does not exceed your stake, your contract will be closed automatically when your loss equals to <0/>.'
                            components={[
                                <Money key={0} amount={stop_out || trade_stop_out} currency={currency} show_currency />,
                            ]}
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
            <MultipliersInfo
                className='trade-params__multiplier-trade-info'
                should_show_tooltip
                commission={commission}
                stop_out={stop_out}
                amount={stake_value}
            />
        </React.Fragment>
    );
});
