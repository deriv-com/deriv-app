import React from 'react';
import { storiesOf } from '@storybook/react';
import Collapsible from 'Components/collapsible';
// import 'Components/dropdown/dropdown.scss';
import notes from './README.md';

storiesOf('Collapsible', module)
    .add(
        'Top',
        () => (
            <Collapsible as='div'>
                <div data-collapsible='true'>Will be collapsed</div>
                <div>Item 2</div>
                <div data-collapsible='true'>Will be collapsed</div>
                <div>Item 4</div>
                <div>Item 5</div>
                <div>Item 1</div>
            </Collapsible>
        ),
        {
            notes,
        }
    )
    .add(
        'Bottom',
        () => (
            <Collapsible position='bottom' is_collapsed>
                <li data-collapsible='true'>Will be collapsed</li>
                <li>Item 2</li>
                <li data-collapsible='true'>Will be collapsed</li>
                <li>Item 4</li>
                <li>Item 5</li>
                <li>Item 1</li>
            </Collapsible>
        ),
        {
            notes,
        }
    )
    .add(
        'Static',
        () => (
            <Collapsible position='top' is_collapsed>
                <li>Item 2</li>
                <li>Item 4</li>
                <li>Item 5</li>
                <li>Item 1</li>
            </Collapsible>
        ),
        {
            notes,
        }
    )
    .add(
        'with Title',
        () => (
            <Collapsible position='top' is_collapsed title='Title'>
                <li data-collapsible='true'>Content</li>
            </Collapsible>
        ),
        {
            notes,
        }
    );
