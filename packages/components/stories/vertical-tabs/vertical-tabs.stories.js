import React         from 'react';
import { storiesOf } from '@storybook/react';
import VerticalTab   from 'Components/vertical-tabs/vertical-tab';

const action_bar_items = [
    {
        onClick: () => {
            alert('Info: You clicked a button.');
        },
        icon : 'IcAlertInfo',
        title: 'Informative alert',
    },
    {
        component: () => <div>Hello World</div>,
        title    : 'Test',
    },
];

const current_path = '/';
const is_routed = false;
const is_full_width = false;
const modal_index = 1;
const setModalIndex = () => {};

const story = storiesOf('Vertical Tabs', module);

storiesOf('Vertical Tabs', module)
    .add(
        'Basic usage',
        () => (
            <div style={{
                display       : 'flex',
                width         : '100%',
                height        : '100%',
                justifyContent: 'center',
                alignItems    : 'center',
            }}
            >
                <VerticalTab
                    header_title='Vertical tabs header'
                    action_bar={action_bar_items}
                    action_bar_classname='reports__inset_header'
                    alignment='center'
                    id='report'
                    classNameHeader='reports__tab-header'
                    current_path={current_path}
                    is_routed={false}
                    is_full_width={false}
                    list={[]}
                    modal_index={0}
                    setModalIndex={setModalIndex}
                />
            </div>
        )
    );
