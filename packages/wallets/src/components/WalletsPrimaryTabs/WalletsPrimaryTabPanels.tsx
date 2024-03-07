import React, { Children } from 'react';
import { useTabs } from './WalletsPrimaryTabs';

const WalletsPrimaryTabPanels = ({ children }: React.PropsWithChildren<unknown>) => {
    const { activeTabIndex } = useTabs();

    return (
        <div data-testid='dt_tab_panels'>
            {Children.map(children, (child, index) => {
                if (index !== activeTabIndex) return undefined;

                return child;
            })}
        </div>
    );
};

export default WalletsPrimaryTabPanels;
