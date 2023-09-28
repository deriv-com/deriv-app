import React from 'react';
import MultipliersInfo from 'Modules/Trading/Components/Form/TradeParams/Multiplier/info';
import RadioGroupWithInfoMobile from 'Modules/Trading/Components/Form/RadioGroupWithInfoMobile';
import { requestPreviewProposal } from 'Stores/Modules/Trading/Helpers/preview-proposal';
import { localize } from '@deriv/translations';
import { observer } from '@deriv/stores';
import { useTraderStore } from 'Stores/useTraderStores';
import { useIsMounted, WS } from '@deriv/shared';
import { TTradeStore } from 'Types';

type TMultiplierOptions = {
    toggleModal: () => void;
};

const MultiplierOptions = observer(({ toggleModal }: TMultiplierOptions) => {
    const trade_store = useTraderStore();
    const { amount, multiplier, multiplier_range_list, onChange } = trade_store;
    const [commission, setCommission] = React.useState<number | null>();
    const [stop_out, setStopOut] = React.useState<number>();
    const isMounted = useIsMounted();

    React.useEffect(() => {
        if (!amount) return undefined;

        const onProposalResponse: TTradeStore['onProposalResponse'] = ({ echo_req, proposal, subscription }) => {
            if (isMounted() && proposal && echo_req.contract_type === 'MULTUP' && Number(echo_req.amount) === amount) {
                setCommission(proposal.commission);
                proposal.limit_order?.stop_out && setStopOut(proposal.limit_order.stop_out?.order_amount);
            } else if (subscription?.id) {
                WS.forget(subscription.id);
            }
        };
        const dispose = requestPreviewProposal(trade_store, onProposalResponse, { amount });

        return () => {
            dispose?.();
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [amount]);

    return (
        <React.Fragment>
            <RadioGroupWithInfoMobile
                popover_alignment='bottom'
                contract_name='multiplier'
                current_value_object={{ name: 'multiplier', value: multiplier }}
                info={localize(
                    'Your gross profit is the percentage change in market price times your stake and the multiplier chosen here.'
                )}
                items_list={multiplier_range_list}
                onChange={onChange}
                toggleModal={toggleModal}
            />
            <MultipliersInfo
                className='trade-params__multiplier-trade-info'
                should_show_tooltip
                commission={commission}
                stop_out={stop_out}
                amount={amount}
            />
        </React.Fragment>
    );
});

export default MultiplierOptions;
