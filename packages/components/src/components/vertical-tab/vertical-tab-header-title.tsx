import React from 'react';
import Text from '../text';

type TVerticalTabHeaderTitle = { header_title: string };

const VerticalTabHeaderTitle = ({ header_title }: TVerticalTabHeaderTitle) => (
    <div className='dc-vertical-tab__header-title'>
        <Text as='p' color='prominent' align='center' weight='bold'>
            {header_title}
        </Text>
    </div>
);

export default VerticalTabHeaderTitle;
