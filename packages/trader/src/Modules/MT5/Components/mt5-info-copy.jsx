import React from 'react';
import { Clipboard } from '@deriv/components';

const MT5InfoCopy = ({ display_name, label, success_msg, info_msg, text_copy }) => (
    <div className='mt5-dashboard__info-copy'>
        <div className='mt5-dashboard__info-display'>
            <span className='mt5-dashboard__info-label'>{label}:</span>
            {display_name}
        </div>
        <Clipboard text_copy={text_copy} info_message={info_msg} success_message={success_msg} />
    </div>
);

export { MT5InfoCopy };
