import React from 'react';
import { observer } from 'mobx-react';
import { useTraderStore } from 'Stores/useTraderStores';
import { Button, Text, ToggleSwitch, WheelPicker, useSnackbar } from '@deriv-com/quill-ui';
import { Skeleton } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { addUnit } from 'AppV2/Utils/trade-params-utils';

type TDealCancellationProps = {
    closeActionSheet: () => void;
};

const DealCancellation = observer(({ closeActionSheet }: TDealCancellationProps) => {
    const {
        has_cancellation,
        has_take_profit,
        has_stop_loss,
        cancellation_range_list,
        cancellation_duration,
        onChangeMultiple,
    } = useTraderStore();
    const { addSnackbar } = useSnackbar();

    const [is_enabled, setIsEnabled] = React.useState(has_cancellation);
    const [selected_value, setSelectedValue] = React.useState<string>(addUnit(cancellation_duration));

    const getSnackBarText = ({
        has_cancellation,
        has_take_profit,
        has_stop_loss,
    }: {
        has_cancellation?: boolean;
        has_take_profit?: boolean;
        has_stop_loss?: boolean;
    }) => {
        if (has_cancellation) {
            if (has_take_profit && has_stop_loss)
                return <Localize i18n_default_text='TP and SL have been turned off.' />;
            if (has_take_profit) return <Localize i18n_default_text='TP has been turned off.' />;
            if (has_stop_loss) return <Localize i18n_default_text='SL has been turned off.' />;
        }
        if ((has_take_profit || has_stop_loss) && has_cancellation)
            return <Localize i18n_default_text='DC has been turned off.' />;
    };

    const onSave = () => {
        const new_cancellation_duration = addUnit(selected_value, 'm', false);

        if (has_cancellation === is_enabled && new_cancellation_duration === cancellation_duration) return;

        if (has_take_profit || has_stop_loss) {
            addSnackbar({
                message: getSnackBarText({ has_cancellation: is_enabled, has_stop_loss, has_take_profit }),
                hasCloseButton: true,
                delay: 100,
            });
        }
        onChangeMultiple({
            has_cancellation: is_enabled,
            ...(is_enabled ? { has_take_profit: false } : {}),
            ...(is_enabled ? { has_stop_loss: false } : {}),
            cancellation_duration: new_cancellation_duration,
        });
        closeActionSheet();
    };

    React.useEffect(() => {
        setIsEnabled(has_cancellation);
        setSelectedValue(addUnit(cancellation_duration));
    }, [has_cancellation, cancellation_duration]);

    return (
        <React.Fragment>
            <div className='deal-cancellation__container'>
                <div className='deal-cancellation__toggle'>
                    <Text>
                        <Localize i18n_default_text='Deal cancellation' />
                    </Text>
                    <ToggleSwitch checked={is_enabled} onChange={setIsEnabled} />
                </div>
                <div className='deal-cancellation__wheel-picker'>
                    {cancellation_range_list.length ? (
                        <WheelPicker
                            data={cancellation_range_list.map(({ value }) => ({ value: addUnit(value) }))}
                            selectedValue={selected_value}
                            setSelectedValue={
                                setSelectedValue as React.ComponentProps<typeof WheelPicker>['setSelectedValue']
                            }
                        />
                    ) : (
                        <Skeleton />
                    )}
                </div>
            </div>
            <Button
                color='black'
                size='lg'
                label={<Localize i18n_default_text='Save' />}
                fullWidth
                className='risk-management__save-button'
                onClick={onSave}
            />
        </React.Fragment>
    );
});

export default DealCancellation;
