import React from 'react';
// import classNames from 'classnames';

type TTabContext = {
    active_tab_index: number;
    setActiveTabIndex: React.Dispatch<React.SetStateAction<number>>;
};

const TabsContext = React.createContext<TTabContext | null>(null);

export const useTabs = () => {
    const context = React.useContext(TabsContext);

    if (!context) {
        throw new Error('Seems you forgot to wrap the components in "<Tabs />"');
    }

    return context;
};

type TTabsProps = {
    className?: string;
};

export const Tabs = ({ children, className }: React.PropsWithChildren<TTabsProps>) => {
    const [active_tab_index, setActiveTabIndex] = React.useState(0);

    return (
        <TabsContext.Provider value={{ active_tab_index, setActiveTabIndex }}>
            <div className={className}>{children}</div>
        </TabsContext.Provider>
    );
};

export default Tabs;
