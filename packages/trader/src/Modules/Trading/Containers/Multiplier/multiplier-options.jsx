import React from 'react';
import MultipliersInfo from 'Modules/Trading/Components/Form/TradeParams/Multiplier/info.jsx';
import RadioGroupWithInfoMobile from 'Modules/Trading/Components/Form/RadioGroupWithInfoMobile';
import { requestPreviewProposal } from 'Stores/Modules/Trading/Helpers/preview-proposal';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { useIsMounted, WS } from '@deriv/shared';

const MultiplierOptions = ({ amount, multiplier, multiplier_range_list, onChange, toggleModal, trade_store }) => {
    const [commission, setCommission] = React.useState(null);
    const [stop_out, setStopOut] = React.useState(null);
    const isMounted = useIsMounted();

    React.useEffect(() => {
        if (!amount) return undefined;

        const onProposalResponse = ({ echo_req, proposal, subscription }) => {
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

    return (
        <React.Fragment>
            <RadioGroupWithInfoMobile
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
};

export default connect(({ modules }) => ({
    amount: modules.trade.amount,
    multiplier: modules.trade.multiplier,
    multiplier_range_list: modules.trade.multiplier_range_list,
    onChange: modules.trade.onChange,
    trade_store: modules.trade,
}))(MultiplierOptions);
