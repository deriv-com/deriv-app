import { storiesOf } from '@storybook/react';
import { boolean } from '@storybook/addon-knobs';
import GuideTour from 'Components/guide-tour';
import React from 'react';
import Wrapper from '../shared/wrapper';
import notes from './README.md';
import './guide-tour.stories.scss';

storiesOf('GuideTour', module).add(
    'Main function',
    () => {
        const default_tour_settings = {
            text_labels: {
                back: 'Back',
                next: 'Next',
                last: 'Finish',
            },
            close_with_mask: false,
        };
        const steps = [
            {
                selector: '.acc-info__wrapper',
                title: 'Sequi ratione eligendi',
                content: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit.',
                observe: '.acc-info__wrapper',
                substep: {
                    selector: 'acc-info__wrapper',
                    title: 'Quae totam voluptatem',
                    content: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit.',
                    hideButtons: false,
                    observe: '#modal_root',
                },
            },
            {
                selector: '.btn-purchase--2',
                title: 'Commodi culpa alias.',
                content: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit.',
            },
            {
                selector: '#dt_cashier_tab',
                title: 'Modi aliquam',
                content: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit.',
            },
        ];
        return (
            <Wrapper is_dark={boolean('Dark Theme', false)}>
                <GuideTour steps={steps} settings={default_tour_settings} />
            </Wrapper>
        );
    },
    {
        notes,
    }
);
