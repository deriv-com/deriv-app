import { storiesOf } from '@storybook/react';
import { boolean, withKnobs } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import React from 'react';
import Carousel from 'Components/carousel';
import Theme from '../shared/theme';

const stories = storiesOf('Carousel', module);

const FlexWrapper = ({ children, justifyContent = 'center' }) => (
    <div
        style={{
            display: 'flex',
            padding: '36px',
            justifyContent,
        }}
    >
        {children}
    </div>
);

const demo_slides = [
    <div className='slide1'>
        <h1>Slide 1</h1>
    </div>,
    <div className='slide2'>
        <h1>Slide 2</h1>
    </div>,
    <div className='slide3'>
        <h1>Slide 3</h1>
    </div>,
    <div className='slide4'>
        <h1>Slide 4</h1>
    </div>,
    <div className='slide5'>
        <h1>Slide 5</h1>
    </div>,
    <div className='slide6'>
        <h1>Slide 6</h1>
    </div>,
    <div className='slide7'>
        <h1>Slide 7</h1>
    </div>,
    <div className='slide8'>
        <h1>Slide 8</h1>
    </div>,
    <div className='slide9'>
        <h1>Slide 9</h1>
    </div>,
];

stories.addDecorator(withKnobs).addDecorator(withInfo);

stories.add('basic', () => (
    <Theme is_dark={boolean('Theme', false)}>
        <FlexWrapper>
            <Carousel list={demo_slides} active_index={0} />
        </FlexWrapper>
    </Theme>
));
