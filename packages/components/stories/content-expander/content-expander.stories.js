import React from 'react';
import { storiesOf } from '@storybook/react';
import ContentExpander from 'Components/content-expander';
import notes from './README.md';

storiesOf('ContentExpander', module)
    .add(
        'Header is string',
        () => (
            <ContentExpander is_visible={true} header='Click here'>
                <p>Hello</p>
            </ContentExpander>
        ),
        {
            notes,
        }
    )
    .add(
        'Header is string, title is spaced',
        () => (
            <ContentExpander is_visible={true} header='Click here' is_title_spaced>
                <p>Hello</p>
            </ContentExpander>
        ),
        {
            notes,
        }
    );
