import React from 'react';
import { Tab } from '@deriv-com/quill-ui';
import useActiveSymbols from 'AppV2/Hooks/useActiveSymbols';

const tabs = [
    { id: 'abc', title: 'cde', content: 'fornow' },
    { id: 'abcde', title: 'cde', content: 'some' },
    { id: 'abcfg', title: 'cde', content: 'kewl' },
];

const MarketCategoriesTabs = () => {
    const { activeSymbols } = useActiveSymbols();

    return (
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
    );
};

export default MarketCategoriesTabs;
