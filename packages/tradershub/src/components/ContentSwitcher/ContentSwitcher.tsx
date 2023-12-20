import React, {
    Children,
    createContext,
    Dispatch,
    FC,
    PropsWithChildren,
    ReactNode,
    SetStateAction,
    useContext,
    useState,
} from 'react';
import { Button, qtJoin, qtMerge } from '@deriv/quill-design';

type TTabContext = {
    activeTabIndex: number;
    setActiveTabIndex: Dispatch<SetStateAction<number>>;
};

type TContentHeaderList = {
    className?: string;
    list: string[];
};

type TContentSwitcher = {
    children: ReactNode;
    className?: string;
};

/**
 * Context for managing tab state.
 */
const TabsContext = createContext<TTabContext | null>(null);

/**
 * Hook for accessing the tab context.
 * @throws {Error} If the hook is used outside of a `<ContentSwitcher />`.
 * @returns {TTabContext} The current tab context.
 */
export const useTabsContext = () => {
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
    const [activeTabIndex, setActiveTabIndex] = useState(0);

    return (
        <TabsContext.Provider value={{ activeTabIndex, setActiveTabIndex }}>
            <div className={className}>{children}</div>
        </TabsContext.Provider>
    );
};

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

/**
 * Panel for displaying content.
 * @param {PropsWithChildren} props The props for the component.
 * @returns {JSX.Element} The rendered component.
 */
const ContentTabPanel = ({ children }: PropsWithChildren) => <>{children}</>;

/**
 * List of of button headers for the content panels.
 * @param {TContentHeaderList} props The props for the component.
 * @returns {JSX.Element} The rendered component.
 */

const ContentHeaderList: FC<TContentHeaderList> = ({ className, list }) => {
    const { activeTabIndex, setActiveTabIndex } = useTabsContext();

    return (
        <div
            className={qtMerge('flex bg-system-light-secondary-background rounded-400 p-200', className)}
            data-list-count={list.length}
        >
            {list.map((tab, i) => (
                <Button
                    className={qtJoin('rounded-200', i !== activeTabIndex && 'bg-transparent')}
                    colorStyle='white'
                    fullWidth
                    key={i}
                    onClick={() => setActiveTabIndex(i)}
                    size='lg'
                >
                    {tab}
                </Button>
            ))}
        </div>
    );
};

ContentSwitcher.HeaderList = ContentHeaderList;
ContentSwitcher.PanelContainer = ContentPanelContainer;
ContentSwitcher.Panel = ContentTabPanel;

export default ContentSwitcher;
