import React from 'react';
import { observer } from 'mobx-react';
import { useTraderStore } from 'Stores/useTraderStores';
import { Text, ToggleSwitch, WheelPicker } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
// import { Skeleton } from '@deriv/components';

const DealCancellation = observer(() => {
    const { has_cancellation, cancellation_range_list, cancellation_duration, onChangeMultiple } = useTraderStore();

    const [is_enabled, setIsEnabled] = React.useState(has_cancellation);
    const [selected_value, setSelectedValue] = React.useState<string | number>(cancellation_duration);

    React.useEffect(() => {
        setIsEnabled(has_cancellation);
        setSelectedValue(cancellation_duration);
    }, [has_cancellation, cancellation_duration]);
    // console.log('has_cancellation', has_cancellation);
    // console.log('cancellation_range_list', cancellation_range_list);
    // console.log('cancellation_duration', cancellation_duration);
    // console.log('test', parseInt('5m'));
    return (
        <div className='deal-cancellation__container'>
            <div className='deal-cancellation__toggle'>
                <Text>
                    <Localize i18n_default_text='Deal cancellation' />
                </Text>
                <ToggleSwitch checked={is_enabled} onChange={setIsEnabled} />
            </div>
            <div className='deal-cancellation__wheel-picker'>
                <WheelPicker
                    data={cancellation_range_list.map(({ value }) => ({ value }))}
                    selectedValue={selected_value}
                    setSelectedValue={setSelectedValue}
                />
            </div>
        </div>
    );
});

export default DealCancellation;
