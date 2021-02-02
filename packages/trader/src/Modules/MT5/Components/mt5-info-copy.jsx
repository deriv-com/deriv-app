import React from 'react';
import { Clipboard, Text } from '@deriv/components';

const MT5InfoCopy = ({ display_name, label, success_msg, info_msg, text_copy }) => (
    <div className='mt5-dashboard__info-copy'>
        <div className='mt5-dashboard__info-display'>
            <Text className='mt5-dashboard__info-label'>{label}:</Text>
            {display_name}
        </div>
        <Clipboard text_copy={text_copy} info_message={info_msg} success_message={success_msg} />
    </div>
);

export { MT5InfoCopy };
