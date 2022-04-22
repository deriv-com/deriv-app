// TODO: This component is temporary and to be removed in the future releases
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useStores } from 'Stores';
import { HintBox, Text } from '@deriv/components';
import { localize } from 'Components/i18next';

const ReduceOrderTimeBanner = () => {
    const { general_store } = useStores();
    const { order_time_out } = general_store;

    let render_banner_text = '';

    if (order_time_out.hours > 0 && order_time_out.minutes > 0) {
        render_banner_text = localize(
            'New orders are now active for {{hours}} hour and {{minutes}} minutes only. Complete your order before it expires!',
            { hours: order_time_out.hours, minutes: order_time_out.minutes }
        );
    } else if (order_time_out.hours > 0 && order_time_out.minutes === 0) {
        render_banner_text = localize(
            'New orders are now active for {{hours}} hour only. Complete your order before it expires!',
            { hours: order_time_out.hours }
        );
    } else {
        render_banner_text = localize(
            'New orders are now active for {{minutes}} minutes only. Complete your order before it expires!',
            { minutes: order_time_out.minutes }
        );
    }

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
