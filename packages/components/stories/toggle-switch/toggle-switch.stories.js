import { storiesOf } from '@storybook/react';
import {
    boolean,
    withKnobs }      from '@storybook/addon-knobs';
import { withInfo }  from '@storybook/addon-info';
import React         from 'react';
import Switch        from 'Components/toggle-switch';
import Theme         from '../shared/theme';

const stories = storiesOf('Toggle switch', module);

stories.addDecorator(withKnobs).addDecorator(withInfo);

stories
    .add(
        'primary',
        () => {
            const [enabled, setEnabled] = React.useState(false);

            const toggleSwitch = ({ is_enabled }) => {
                setEnabled(is_enabled);
            };

            return (
                <Theme is_dark={boolean('Theme', false)}>
                    <div>
                        <Switch theme='default' enabled={enabled} onStateChanged={toggleSwitch} />
                    </div>
                </Theme>
            );
        }
    );
