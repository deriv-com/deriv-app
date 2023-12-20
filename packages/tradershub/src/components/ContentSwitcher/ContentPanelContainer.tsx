import React, { Children, PropsWithChildren } from 'react';
import { useTabsContext } from './ContentSwitcher';

/**
 * Container for content panels.
 * Only the active panel's content will be rendered.
 * @param {PropsWithChildren} props The props for the component.
 * @returns {JSX.Element} The rendered component.
 */
const ContentPanelContainer = ({ children }: PropsWithChildren) => {
    const { activeTabIndex } = useTabsContext();

    return (
        <div>
            {Children.map(children, (child, index) => {
                if (index !== activeTabIndex) return undefined;

                return child;
            })}
        </div>
    );
};

export default ContentPanelContainer;
