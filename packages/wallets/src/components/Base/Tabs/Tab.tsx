import React, { FC, ReactNode } from 'react';

type TabProps = {
    children: ReactNode;
    icon?: ReactNode;
    title: string;
};

const Tab: FC<TabProps> = ({ children }) => <>{children}</>;

export default Tab;
