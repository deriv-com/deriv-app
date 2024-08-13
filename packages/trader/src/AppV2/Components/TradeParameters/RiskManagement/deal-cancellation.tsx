import React from 'react';
import { observer } from 'mobx-react';
import { useTraderStore } from 'Stores/useTraderStores';
import { Button, Text, ToggleSwitch, WheelPicker } from '@deriv-com/quill-ui';
import { Localize, localize } from '@deriv/translations';

type TDealCancellationProps = {
    closeActionSheet: () => void;
};

const DealCancellation = observer(({ closeActionSheet }: TDealCancellationProps) => {
    const { has_cancellation, cancellation_range_list, cancellation_duration, onChangeMultiple } = useTraderStore();
    const addUnit = (value: string, unit = localize('min'), should_add_space = true) =>
        `${parseInt(value)}${should_add_space ? ' ' : ''}${unit}`;

    const [is_enabled, setIsEnabled] = React.useState(has_cancellation);
    const [selected_value, setSelectedValue] = React.useState<string>(addUnit(cancellation_duration));

    const onSave = () => {
        onChangeMultiple({
            has_cancellation: is_enabled,
            ...(is_enabled ? { has_take_profit: false } : {}),
            ...(is_enabled ? { has_stop_loss: false } : {}),
            cancellation_duration: addUnit(selected_value, 'm', false),
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
                    <WheelPicker
                        data={cancellation_range_list.map(({ value }) => ({ value: addUnit(value) }))}
                        selectedValue={selected_value}
                        setSelectedValue={
                            setSelectedValue as React.ComponentProps<typeof WheelPicker>['setSelectedValue']
                        }
                    />
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
