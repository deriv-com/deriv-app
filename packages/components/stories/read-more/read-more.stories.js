import { storiesOf } from '@storybook/react';
import { boolean, withKnobs } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import React from 'react';
import Wrapper from '../shared/wrapper';
import ReadMore from 'Components/read-more';
import notes from './README.md';

const stories = storiesOf('ReadMore', module);

stories.addDecorator(withKnobs).addDecorator(withInfo);

stories.add(
    'Basic Usage',
    () => {
        return (
            <Wrapper is_dark={boolean('dark theme', false)}>
                <ReadMore
                    expand_text={'read more'}
                    text={
                        "This is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
                    }
                    collapse_length={100}
                    className='on-ramp__read-more'
                />
            </Wrapper>
        );
    },
    {
        notes,
    }
);
