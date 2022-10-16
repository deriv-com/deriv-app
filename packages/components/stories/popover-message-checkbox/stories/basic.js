import React from 'react';
import { boolean } from '@storybook/addon-knobs';
import PopoverMessageCheckbox from 'Components/popover-message-checkbox';
import Popover from 'Components/popover';
import Wrapper from '../../shared/wrapper';

const PopoverComponent = ({ message }) => (
    <Popover alignment='right' is_bubble_hover_enabled margin={2} zIndex={2} message={message}>
        <div>Hover me to see the message</div>
    </Popover>
);

const Basic = () => {
    const [is_checked, toggleCheck] = React.useState(false);

    return (
        <Wrapper className='popover-message-checkbox-storybook' is_dark={boolean('Dark Theme', false)}>
            <PopoverComponent
                message={
                    <PopoverMessageCheckbox
                        onChange={() => toggleCheck(!is_checked)}
                        defaultChecked={is_checked}
                        checkboxLabel='Disable a tool'
                        message='Check the box please'
                    />
                }
            />
        </Wrapper>
    );
};

export default Basic;
