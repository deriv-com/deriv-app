// TODO: This component is temporary and to be removed in the future releases
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useStores } from 'Stores';
import { HintBox, Text } from '@deriv/components';
import { localize } from 'Components/i18next';

const ReduceOrderTimeBanner = () => {
    const { general_store } = useStores();
    const { order_time_out } = general_store;
    // Generate the banner text
    const render_banner_text = (() => {
        let hour_msg = '';
        if (order_time_out.hours === 1) {
            hour_msg = localize('{{hour}} hour', { hour: order_time_out.hours });
        } else if (order_time_out.hours > 1) {
            hour_msg = localize('{{hour}} hours', { hour: order_time_out.hours });
        }
        if (order_time_out.hours > 0 && order_time_out.miutes > 0) {
            return localize(
                'New orders are now active for {{hours}} and {{minutes}} minutes only. Complete your order before it expires!',
                { hours: hour_msg, minutes: order_time_out.minutes }
            );
        } else if (order_time_out.hours > 0 && order_time_out.minutes === 0) {
            return localize('New orders are now active for {{hours}} only. Complete your order before it expires!', {
                hours: hour_msg,
            });
        }
        return localize(
            'New orders are now active for {{minutes}} minutes only. Complete your order before it expires!',
            { minutes: order_time_out.minutes }
        );
    })();

    return (
        <HintBox
            className='p2p-my-ads__warning'
            icon='IcInfo'
            message={
                <Text as='p' size='xxxs' color='prominent' line_height='xs'>
                    {render_banner_text}
                </Text>
            }
            is_info
        />
    );
};

export default observer(ReduceOrderTimeBanner);
