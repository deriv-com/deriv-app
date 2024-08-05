import React from 'react';
import clsx from 'clsx';
import { ActionSheet, WheelPicker } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import { sortObjectByKeys } from 'AppV2/Utils/trade-params-utils';

type TStrikeWheelProps = {
    current_strike: string;
    is_small_screen_device?: boolean;
    onStrikePriceSelect: (e: {
        target: {
            name: string;
            value: unknown;
        };
    }) => void;
    strike_price_list: {
        value: string;
    }[];
};

const StrikeWheel = ({
    current_strike,
    is_small_screen_device,
    onStrikePriceSelect,
    strike_price_list,
}: TStrikeWheelProps) => {
    const [selected_value, setSelectedValue] = React.useState<string | number>(current_strike);

    return (
        <React.Fragment>
            <ActionSheet.Content
                className={clsx('strike__wrapper', is_small_screen_device && 'strike__wrapper--small-screen')}
            >
                <div className='strike__wheel-picker'>
                    <WheelPicker
                        data={strike_price_list}
                        selectedValue={selected_value}
                        setSelectedValue={setSelectedValue}
                    />
                </div>
                <div className='strike__payout'>Payout per point</div>
            </ActionSheet.Content>
            <ActionSheet.Footer
                alignment='vertical'
                primaryAction={{
                    content: <Localize i18n_default_text='Save' />,
                    onAction: () => onStrikePriceSelect({ target: { name: 'barrier_1', value: selected_value } }),
                }}
            />
        </React.Fragment>
    );
};

export default React.memo(StrikeWheel, (prev_props, new_props) => {
    const prev_props_string = JSON.stringify(sortObjectByKeys(prev_props));
    const new_props_string = JSON.stringify(sortObjectByKeys(new_props));
    return prev_props_string === new_props_string;
});
