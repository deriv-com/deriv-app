import React from 'react';
import { Clipboard } from '@deriv/components';

const MT5InfoCopy = ({ name, label, success_msg, info_msg }) => (
    <div className='mt5-dashboard__info-copy'>
        <div className='mt5-dashboard__info-display'>
            <span className='mt5-dashboard__info-label'>{label}:</span>
            {name}
        </div>
        <Clipboard text_copy={name} info_message={info_msg} success_message={success_msg} />
    </div>
);

export { MT5InfoCopy };
