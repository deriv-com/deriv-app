import React from 'react';
import { observer } from 'mobx-react-lite';
import { useTraderStore } from 'Stores/useTraderStores';
import { ActionSheet, Text, WheelPicker } from '@deriv-com/quill-ui';
import { Skeleton } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { getProposalRequestObject } from 'AppV2/Utils/trade-params-utils';
import { useDtraderQuery } from 'AppV2/Hooks/useDtraderQuery';
import { TTradeStore } from 'Types';

type TPayoutPerPointWheelProps = {
    barrier?: string | number;
    is_open?: boolean;
    current_payout_per_point: string;
    onPayoutPerPointSelect: (new_value: string | number) => void;
    onClose: () => void;
    payout_per_point_list: {
        value: string;
    }[];
};
type TOnProposalResponse = TTradeStore['onProposalResponse'];

const PayoutPerPointWheel = observer(
    ({
        barrier,
        current_payout_per_point,
        is_open,
        onPayoutPerPointSelect,
        onClose,
        payout_per_point_list,
    }: TPayoutPerPointWheelProps) => {
        const trade_store = useTraderStore();
        const { trade_types } = trade_store;

        const [value, setValue] = React.useState<string | number>(current_payout_per_point);
        const [displayed_barrier_value, setDisplayedBarrierValue] = React.useState(barrier);

        // For handling cases when user clicks on Save btn before we got response from API
        const is_api_response_received_ref = React.useRef(false);

        const new_values = { payout_per_point: String(value) };
        const proposal_req = getProposalRequestObject({
            new_values,
            trade_store,
            trade_type: Object.keys(trade_types)[0],
        });
        // Sending proposal without subscription to get a new barrier value
        const { data: response } = useDtraderQuery<Parameters<TOnProposalResponse>[0]>(
            [
                'proposal',
                ...Object.entries(new_values).flat().join('-'),
                `${barrier}`,
                Object.keys(trade_types)[0],
                JSON.stringify(proposal_req),
            ],
            proposal_req,
            {
                enabled: is_open,
            }
        );

        const onChange = (new_value: string | number) => {
            // If a new value is equal to previous one, then we won't send API request
            const is_equal = value === new_value;
            is_api_response_received_ref.current = is_equal;
            if (is_equal) return;

            setValue(new_value);
        };

        const onSave = () => {
            // Prevent from saving if user clicks before BE validation
            if (!is_api_response_received_ref.current) return;
            onPayoutPerPointSelect(value);
            onClose();
        };

        React.useEffect(() => {
            const onProposalResponse: TOnProposalResponse = response => {
                const { error, proposal } = response;
                const { barrier_spot_distance } = proposal ?? {};
                // Currently we are not handling errors
                if (barrier_spot_distance && !error) setDisplayedBarrierValue(barrier_spot_distance);

                is_api_response_received_ref.current = true;
            };

            if (response) onProposalResponse(response);
        }, [response]);

        return (
            <React.Fragment>
                <ActionSheet.Content className='payout-per-point__wrapper' data-testid='dt_payout-per-point_wrapper'>
                    <div className='payout-per-point__wheel-picker'>
                        <WheelPicker data={payout_per_point_list} selectedValue={value} setSelectedValue={onChange} />
                    </div>
                    <div className='payout-per-point__barrier'>
                        <Text color='quill-typography__color--subtle' size='sm'>
                            <Localize i18n_default_text='Barrier' />
                        </Text>
                        <Text size='sm' as='div' className='payout-per-point__barrier__content'>
                            {displayed_barrier_value ?? <Skeleton width={90} height={14} />}
                        </Text>
                    </div>
                </ActionSheet.Content>
                <ActionSheet.Footer
                    alignment='vertical'
                    primaryAction={{
                        content: <Localize i18n_default_text='Save' />,
                        onAction: onSave,
                    }}
                    shouldCloseOnPrimaryButtonClick={false}
                />
            </React.Fragment>
        );
    }
);

export default PayoutPerPointWheel;
