import { storiesOf } from '@storybook/react';
import ButtonLink from 'Components/button-link';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import notes from './README.md';
import './button-link.stories.scss';

storiesOf('ButtonLink', module).add(
    'Main function',
    () => {
        return (
            <React.Fragment>
                <div className={'buttonlink__wrapper'}>
                    <BrowserRouter>
                        <ButtonLink
                            to='#'
                            onClick={() => {
                                console.log('clicked');
                            }}
                            size='medium'
                        >
                            <p>This is a button link</p>
                        </ButtonLink>
                    </BrowserRouter>
                </div>
            </React.Fragment>
        );
    },
    {
        notes,
    }
);
