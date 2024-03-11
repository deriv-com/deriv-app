/* eslint-disable no-console */
import React from 'react';
import { Button, Input } from '@deriv-com/ui';
import SendMessageIcon from '../../../../public/ic-send-message.svg';
import './ChatFooter.scss';

const ChatFooter = () => {
    const onChange = event => {
        console.log(event.target.value);
    };
    return (
        <div>
            <Input
                className='p2p-v2-chat-footer__input'
                label='asdfasdf'
                onChange={onChange}
                rightPlaceholder={
                    <SendMessageIcon
                        onClick={() => {
                            console.log('asfasd');
                        }}
                    />
                }
            />
        </div>
    );
};

export default ChatFooter;
