import React         from 'react';
import {
    boolean,
    withKnobs }      from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import ContractAudit from 'Components/vertical-tab/vertical-tab'
import                    'Components/vertical-tab/vertical-tab.scss';
import Theme         from '../shared/theme';

const stories = storiesOf('Vertical Tabs', module);
stories.addDecorator(withKnobs);
stories.add('Basic usage', () => {
    const [modal_index, setModalIndex] = React.useState(0);

    return (
        <Theme is_dark={boolean('Dark theme?', false)}>
            <div style={{
                padding: '3.2rem',
                backgroundColor: 'var(--overlay-outside-dialog)'
            }}
            >
                <ContractAudit
                    header_title='Header'
                    action_bar={action_bar_items}
                    alignment='center'
                    current_path='/'
                    is_routed={false}
                    is_full_width={boolean('Full screen?', true)}
                    list={list}
                    modal_index={modal_index}
                    setModalIndex={setModalIndex}
                />
            </div>
        </Theme>
    );
})