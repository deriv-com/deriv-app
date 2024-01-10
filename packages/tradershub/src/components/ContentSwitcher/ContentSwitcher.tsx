import React, { createContext, Dispatch, ReactNode, SetStateAction, useContext, useMemo, useState } from 'react';
import ContentHeaderList from './ContentHeaderList';
import ContentPanelContainer from './ContentPanelContainer';
import ContentTabPanel from './ContentTabPanel';

type TContentContext = {
    activeTabLabel?: string;
    setActiveTabLabel: Dispatch<SetStateAction<string>>;
};

type TContentSwitcher = {
    children: ReactNode;
    className?: string;
};

/**
 * Context for managing tab state.
 */
const TabsContext = createContext<TContentContext | null>(null);

/**
 * Hook for accessing the tab context.
 * @throws {Error} If the hook is used outside of a `<ContentSwitcher />`.
 * @returns {TContentContext} The current tab context.
 */
export const useContentSwitch = () => {
    const context = useContext(TabsContext);

    if (!context) {
        throw new Error('Seems you forgot to wrap the components in "<ContentSwitcher />"');
    }

    return context;
};

/**
 * Component for switching between different content panels.
 * @param {TContentSwitcher} props The props for the component.
 * @returns {JSX.Element} The rendered component.
 *
 * @example
 * ```tsx
 * <ContentSwitcher>
 *     <ContentSwitcher.HeaderList list={['Tab 1', 'Tab 2', 'Tab 3']} />
 *     <ContentSwitcher.PanelContainer>
 *         <ContentSwitcher.Panel>
 *          <Heading.H3>Tab 1</Heading.H3>
 *         </ContentSwitcher.Panel>
 *         <ContentSwitcher.Panel>
 *          <Heading.H3>Tab 2</Heading.H3>
 *         </ContentSwitcher.Panel>
 *         <ContentSwitcher.Panel>
 *          <Heading.H3>Tab 3</Heading.H3>
 *         </ContentSwitcher.Panel>
 *     </ContentSwitcher.PanelContainer>
 * </ContentSwitcher>
 * ```
 */
const ContentSwitcher = ({ children, className }: TContentSwitcher) => {
    const [activeTabLabel, setActiveTabLabel] = useState('');

    const value = useMemo(
        () => ({
            activeTabLabel,
            setActiveTabLabel,
        }),
        [activeTabLabel]
    );

    return (
        <TabsContext.Provider value={value}>
            <div className={className}>{children}</div>
        </TabsContext.Provider>
    );
};

ContentSwitcher.HeaderList = ContentHeaderList;
ContentSwitcher.PanelContainer = ContentPanelContainer;
ContentSwitcher.Panel = ContentTabPanel;

export default ContentSwitcher;
