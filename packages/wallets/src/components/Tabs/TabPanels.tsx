import React from 'react';
import { useTabs } from './Tabs';

const TabPanels = ({ children }: React.PropsWithChildren<unknown>) => {
    const { active_tab_index } = useTabs();

    return (
        <div>
            {React.Children.map(children, (child, index) => {
                if (index !== active_tab_index) return undefined;

                return child;
            })}
        </div>
    );
};

export default TabPanels;
