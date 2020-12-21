import React from 'react';
import Text from '../text';

const VerticalTabHeaderTitle = ({ header_title }) => (
    <div className='dc-vertical-tab__header-title'>
        <Text as='p' color='prominent' align='center' weight='bold'>
            {header_title}
        </Text>
    </div>
);

export default VerticalTabHeaderTitle;
