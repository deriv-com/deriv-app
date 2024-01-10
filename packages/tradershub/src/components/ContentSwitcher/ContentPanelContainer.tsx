import React, { Children, isValidElement, PropsWithChildren, useEffect } from 'react';
import { useContentSwitch } from './ContentSwitcher';

/**
 * Container for content panels.
 * Only the active panel's content will be rendered.
 * @param {PropsWithChildren} props The props for the component.
 * @returns {JSX.Element} The rendered component.
 */
const ContentPanelContainer = ({ children }: PropsWithChildren) => {
    const { activeTabLabel, setActiveTabLabel } = useContentSwitch();

    useEffect(() => {
        // If no active tab is set, set the first tab as active
        if (!activeTabLabel && Children.count(children) > 0) {
            const firstChild = Children.toArray(children)[0];
            if (isValidElement(firstChild)) {
                setActiveTabLabel(firstChild.props.label);
            }
        }
    }, [activeTabLabel, children, setActiveTabLabel]);

    return (
        <div>
            {Children.map(children, child => {
                // Check if the label matches the activeTabLabel
                if (isValidElement(child) && child.props.label === activeTabLabel) {
                    return child;
                }
                return null;
            })}
        </div>
    );
};

export default ContentPanelContainer;
