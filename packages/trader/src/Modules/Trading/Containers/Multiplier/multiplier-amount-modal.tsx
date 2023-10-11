import React from 'react';
import { Div100vhContainer, Modal, Money, Popover, usePreventIOSZoom } from '@deriv/components';
import { useIsMounted, WS } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { requestPreviewProposal } from 'Stores/Modules/Trading/Helpers/preview-proposal';
import AmountMobile from 'Modules/Trading/Components/Form/TradeParams/amount-mobile';
import MultipliersInfo from 'Modules/Trading/Components/Form/TradeParams/Multiplier/info';
import { observer } from '@deriv/stores';
import { useTraderStore } from 'Stores/useTraderStores';
import { TTradeStore } from 'Types';

type TToggleModal = () => void;
type TMultiplierAmountModal = {
    is_open: boolean;
    toggleModal: TToggleModal;
};

const MultiplierAmountModal = ({ is_open, toggleModal }: TMultiplierAmountModal) => {
    // Fix to prevent iOS from zooming in erratically on quick taps
    usePreventIOSZoom();

    return (
        <React.Fragment>
            <Modal
                id='dt_trade_parameters_mobile'
                className='trade-params'
                is_open={is_open}
                is_title_centered
                should_header_stick_body={false}
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
};

export default MultiplierAmountModal;

const TradeParamsMobile = observer(({ toggleModal }: { toggleModal: TToggleModal }) => {
    const trade_store = useTraderStore();
    const { amount, currency } = trade_store;

    const [stake_value, setStakeValue] = React.useState<string | number>(amount);
    const [commission, setCommission] = React.useState<number | null>();
    const [stop_out, setStopOut] = React.useState<number | null>();
    const stake_ref = React.useRef<string | number>(amount);
    const isMounted = useIsMounted();

    React.useEffect(() => {
        if (stake_value === amount) return undefined;

        const onProposalResponse: TTradeStore['onProposalResponse'] = response => {
            const { proposal, echo_req, subscription } = response;
            if (
                isMounted() &&
                proposal &&
                echo_req.contract_type === 'MULTUP' &&
                Number(echo_req.amount) === Number(stake_ref.current)
            ) {
                setCommission(proposal.commission);
                proposal.limit_order?.stop_out && setStopOut(proposal.limit_order.stop_out?.order_amount);
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

    const setSelectedAmount = (basis: string | undefined, stake: number | string) => {
        setStakeValue(stake);
        stake_ref.current = stake;
    };

    return (
        <React.Fragment>
            <div className='trade-params__multiplier-ic-info-wrapper'>
                <Popover
                    alignment='right'
                    classNameBubble='dc-popover__trade-params'
                    icon='info'
                    id='dt_multiplier-stake__tooltip'
                    zIndex='9999'
                    is_bubble_hover_enabled
                    message={
                        <Localize
                            i18n_default_text='To ensure your loss does not exceed your stake, your contract will be closed automatically when your loss equals to <0/>.'
                            components={[<Money key={0} amount={stop_out || ''} currency={currency} show_currency />]}
                        />
                    }
                />
            </div>
            <AmountMobile
                toggleModal={toggleModal}
                amount_tab_idx={0}
                setSelectedAmount={setSelectedAmount}
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
