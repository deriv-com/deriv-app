import React, { ReactNode } from 'react';

type TContentTabPanel = {
    children: ReactNode;
    label: string;
};

/**
 * Panel for displaying content.
 * @param {PropsWithChildren} props The props for the component.
 * @returns {JSX.Element} The rendered component.
 */
const ContentTabPanel = ({ children, label }: TContentTabPanel) => {
    if (!label) {
        return null;
    }

    return <div>{children}</div>;
};

export default ContentTabPanel;
