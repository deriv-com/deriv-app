import { storiesOf } from '@storybook/react';
import Dialog from 'Components/dialog';
import Button from 'Components/button';
import React, { useState } from 'react';
import notes from './README.md';
import './dialog.stories.scss';

storiesOf('Dialog', module).add(
    'Main function',
    () => {
        const [visibility, setVisibility] = useState(false);
        const toggleVisibility = () => setVisibility(!visibility);

        return (
            <React.Fragment>
                <Button onClick={toggleVisibility} text={'Click Me!'} primary medium />
                <div className={'dialog__wrapper'}>
                    <Dialog
                        is_visible={visibility}
                        title={'title'}
                        is_mobile_full_width={false}
                        has_close_icon
                        cancel_button_text={'Cancel'}
                        confirm_button_text={'Confirm'}
                        onCancel={() => {
                            console.log('Canceled');
                        }}
                        onConfirm={() => {
                            console.log('Confirmed');
                        }}
                    >
                        <p>This is the main part of the Modal</p>
                    </Dialog>
                </div>
            </React.Fragment>
        );
    },
    {
        notes,
    }
);
