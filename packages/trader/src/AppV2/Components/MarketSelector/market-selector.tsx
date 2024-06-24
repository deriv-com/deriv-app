import { ActionSheet, Tab, Text } from '@deriv-com/quill-ui';
import { observer, useStore } from '@deriv/stores';
// import { Localize, localize } from '@deriv/translations';
import React, { useState } from 'react';
import MarketSelectorSearchField from '../MarketSelectorSearchField';
import { Localize } from '@deriv/translations';

const tabs = [
    { id: 'abc', title: 'cde', content: 'fornow' },
    { id: 'abcde', title: 'cde', content: 'some' },
    { id: 'abcfg', title: 'cde', content: 'kewl' },
];

const MarketSelector = observer(() => {
    const { ui } = useStore();
    const [isOpen, setIsOpen] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    return (
        <React.Fragment>
            <button onClick={() => setIsOpen(!isOpen)}>button</button>
            <ActionSheet.Root isOpen={isOpen}>
                <ActionSheet.Portal>
                    <MarketSelectorSearchField isSearching={isSearching} setIsSearching={setIsSearching} />
                    <Tab.Container contentStyle='hug' size='md' className=''>
                        {isSearching ? (
                            <Text
                                size='sm'
                                color='quill-typography__color--subtle'
                                className='market-selector__search--suggestion'
                            >
                                <Localize i18n_default_text='Try searching for markets or keywords' />
                            </Text>
                        ) : (
                            <React.Fragment>
                                <Tab.List>
                                    {tabs.map(({ id, title }) => (
                                        <Tab.Trigger key={id}>{title}</Tab.Trigger>
                                    ))}
                                </Tab.List>
                                <Tab.Content className=''>
                                    {tabs.map(({ id, content }) => (
                                        <Tab.Panel key={id}>{content}</Tab.Panel>
                                    ))}
                                </Tab.Content>
                            </React.Fragment>
                        )}
                    </Tab.Container>
                </ActionSheet.Portal>
            </ActionSheet.Root>
        </React.Fragment>
    );
});

export default MarketSelector;
