import { observer } from 'mobx-react-lite';
import React from 'react';
import { useStores } from 'Stores';
import { HintBox, Text } from '@deriv/components';
import { localize } from 'Components/i18next';
import { minutesToHours } from 'Utils/date-time';

const ReduceOrderTimeBanner = () => {
    const { general_store } = useStores();
    const { order_timeout } = general_store;

    let render_banner_text = '';

    const { hours, minutes } = minutesToHours(order_timeout);

    if (hours === 0 && minutes === 0) {
        return null;
    }

    if (hours > 0) {
        if (minutes > 0) {
            render_banner_text = localize(
                'New orders are now active for {{hours}} hour and {{minutes}} minutes only. Complete your order before it expires!',
                { hours, minutes }
            );
        } else if (minutes === 0) {
            render_banner_text = localize(
                'New orders are now active for {{hours}} hour only. Complete your order before it expires!',
                { hours }
            );
        }
    } else {
        render_banner_text = localize(
            'New orders are now active for {{minutes}} minutes only. Complete your order before it expires!',
            { minutes }
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
