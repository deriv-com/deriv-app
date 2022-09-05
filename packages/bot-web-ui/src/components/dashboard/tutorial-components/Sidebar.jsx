import React from 'react';
import { VerticalTab } from '@deriv/components';

const Sidebar = () => {
    return (
        <div className='dc-tabs__content_side_bar_wrapper'>
            <input type='text' placeholder='Search' />
            <VerticalTab
                list={[
                    {
                        default: true,
                        icon: '',
                        label: 'Guide',
                        path: '',
                        value: () => {
                            return true;
                        },
                    },
                    {
                        default: false,
                        icon: '',
                        label: 'FAQ',
                        path: '',
                        value: () => {
                            return true;
                        },
                    },
                ]}
            />
        </div>
    );
};

export default Sidebar;
