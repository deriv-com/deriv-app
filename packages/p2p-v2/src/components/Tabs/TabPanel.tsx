import React from 'react';

type TTabPanelProps = {
    className?: string;
};
const TabPanel = ({ children, className }: React.PropsWithChildren<TTabPanelProps>) => {
    return <div className={className}>{children}</div>;
};

export default TabPanel;
