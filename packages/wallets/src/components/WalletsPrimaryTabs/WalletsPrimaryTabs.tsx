import React, { createContext, useContext, useState } from 'react';

type TTabContext = {
    activeTabIndex: number;
    setActiveTabIndex: React.Dispatch<React.SetStateAction<number>>;
};

const TabsContext = createContext<TTabContext | null>(null);

export const useTabs = () => {
    const context = useContext(TabsContext);

    if (!context) {
        throw new Error('Seems you forgot to wrap the components in "<WalletsPrimaryTabs />"');
    }

    return context;
};

type TTabsProps = {
    className?: string;
};

export const WalletsPrimaryTabs = ({ children, className }: React.PropsWithChildren<TTabsProps>) => {
    const [activeTabIndex, setActiveTabIndex] = useState(0);

    return (
        <TabsContext.Provider value={{ activeTabIndex, setActiveTabIndex }}>
            <div className={className} data-testid='dt_tabs'>
                {children}
            </div>
        </TabsContext.Provider>
    );
};

export default WalletsPrimaryTabs;
