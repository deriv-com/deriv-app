import React from 'react';
import { Div100vhContainer, Modal, usePreventIOSZoom } from '@deriv/components';
import { useIsMounted, WS, CONTRACT_TYPES } from '@deriv/shared';
import { localize } from '@deriv/translations';
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
                className='trade-params dc-modal-header--title-bar'
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
    const { amount } = trade_store;

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
                echo_req.contract_type === CONTRACT_TYPES.MULTIPLIER.UP &&
                Number(echo_req.amount) === Number(stake_ref.current)
            ) {
                setCommission(proposal.commission);
                proposal.limit_order?.stop_out && setStopOut(proposal.limit_order.stop_out?.order_amount);
            } else if (subscription?.id) {
                WS.forget(subscription.id);
            }
        };
        const dispose = requestPreviewProposal(trade_store, onProposalResponse, { amount: stake_value });

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
