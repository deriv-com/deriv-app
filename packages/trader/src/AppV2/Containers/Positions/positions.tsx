import React from 'react';
import { Localize } from '@deriv/translations';
import { Tab } from '@deriv-com/quill-ui';
import PositionsContent from './positions-content';

type TPositionsProps = {
    onRedirectToTrade?: () => void;
};

const Positions = ({ onRedirectToTrade }: TPositionsProps) => {
    const [hasButtonsDemo, setHasButtonsDemo] = React.useState(true);

    const tabs = [
        {
            id: 'open',
            title: <Localize i18n_default_text='Open' />,
            content: (
                <PositionsContent
                    onRedirectToTrade={onRedirectToTrade}
                    hasButtonsDemo={hasButtonsDemo}
                    setHasButtonsDemo={setHasButtonsDemo}
                />
            ),
        },
        {
            id: 'closed',
            title: <Localize i18n_default_text='Closed' />,
            content: <PositionsContent isClosedTab />,
        },
    ];

    return (
        <div className='positions-page'>
            <Tab.Container contentStyle='fill' size='md' className='positions-page__tabs'>
                <Tab.List>
                    {tabs.map(({ id, title }) => (
                        <Tab.Trigger key={id}>{title}</Tab.Trigger>
                    ))}
                </Tab.List>
                <Tab.Content className='positions-page__tabs-content'>
                    {tabs.map(({ id, content }) => (
                        <Tab.Panel key={id}>{content}</Tab.Panel>
                    ))}
                </Tab.Content>
            </Tab.Container>
        </div>
    );
};

export default Positions;
