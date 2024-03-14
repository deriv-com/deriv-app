import React, { ChangeEvent, useState } from 'react';
import { Input, Text, useDevice } from '@deriv-com/ui';
import ChatFooterIcon from '../ChatFooterIcon/ChatFooterIcon';
import './ChatFooter.scss';

type TChatFooterProps = {
    isClosed: boolean;
};
const ChatFooter = ({ isClosed }: TChatFooterProps) => {
    const { isMobile } = useDevice();
    const [value, setValue] = useState('');

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
    };
    if (isClosed) {
        return (
            <div className='flex justify-center lg:px-[2.4rem] lg:py-[1.6rem]'>
                <Text size={isMobile ? 'md' : 'sm'}>This conversation is closed</Text>
            </div>
        );
    }
    return (
        <div className='px-[2.4rem] pt-[1.6rem] pb-[2.8rem]'>
            <Input
                isFullWidth
                label='Enter message'
                maxLength={5000}
                message={`${value.length}/5000`}
                onChange={onChange}
                //TODO: handle send message
                rightPlaceholder={<ChatFooterIcon length={value.length} onClick={() => undefined} />}
                wrapperClassName='p2p-v2-chat-footer__input'
            />
        </div>
    );
};

export default ChatFooter;
