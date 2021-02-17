import React from 'react';
import { Clipboard, Text } from '@deriv/components';

const CFDInfoCopy = ({ display_name, label, success_msg, info_msg, text_copy }) => (
    <div className='cfd-dashboard__info-copy'>
        <div className='cfd-dashboard__info-display'>
            <Text className='cfd-dashboard__info-label'>{label}:</Text>
            {display_name}
        </div>
        <Clipboard text_copy={text_copy} info_message={info_msg} success_message={success_msg} />
    </div>
);

export { CFDInfoCopy };
