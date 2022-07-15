import React from 'react';
import { action } from '@storybook/addon-actions';
import { boolean } from '@storybook/addon-knobs';
import SwipeableWrapper from 'Components/swipeable-wrapper';
import Wrapper from '../../shared/wrapper';

const Slide = ({ id }) => (
    <div className='swipeable-wrapper-storybook-slide'>
        <div>Slide {id}</div>
    </div>
);

const IsDisabled = () => {
    const slides_count = [...Array(3).keys()];

    return (
        <Wrapper is_full_width has_no_padding is_block is_dark={boolean('Dark Theme', false)}>
            <div className='swipeable-wrapper-storybook'>
                <SwipeableWrapper onChange={action('onChange')} is_disabled>
                    {slides_count.map(id => (
                        <Slide id={id + 1} key={id} />
                    ))}
                </SwipeableWrapper>
            </div>
        </Wrapper>
    );
};

export default IsDisabled;
