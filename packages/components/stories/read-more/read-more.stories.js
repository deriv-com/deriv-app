import { storiesOf } from '@storybook/react';
import { boolean } from '@storybook/addon-knobs';
import React from 'react';
import Wrapper from '../shared/wrapper';
import ReadMore from 'Components/read-more';
import notes from './README.md';

storiesOf('ReadMore', module).add(
    'Main function',
    () => {
        return (
            <Wrapper is_dark={boolean('Dark Theme', false)}>
                <ReadMore
                    expand_text={'read more'}
                    text={
                        "This is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
                    }
                    collapse_length={140}
                    className='on-ramp__read-more'
                />
            </Wrapper>
        );
    },
    {
        notes,
    }
);
