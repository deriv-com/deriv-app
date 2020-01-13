import { storiesOf } from '@storybook/react';
import {
    boolean,
    withKnobs }      from '@storybook/addon-knobs';
import { withInfo }  from '@storybook/addon-info';
import React         from 'react';
import TickPicker        from 'Components/tick-picker';
import Theme         from '../shared/theme';

const stories = storiesOf('Tick picker', module);

stories.addDecorator(withKnobs).addDecorator(withInfo);


stories
    .add(
        'basic usage',
        () => (
            <Theme is_dark={boolean('Theme', true)}>
              <TickPicker />
            </Theme>
        )
    );
