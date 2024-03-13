import React, { ChangeEvent, KeyboardEvent, useRef, useState } from 'react';
import { Input, Text, useDevice } from '@deriv-com/ui';
import ChatFooterIcon from '../ChatFooterIcon/ChatFooterIcon';
import './ChatFooter.scss';

type TChatFooterProps = {
    isClosed: boolean;
    sendFile: (file: File) => void;
    sendMessage: (message: string) => void;
};
const ChatFooter = ({ isClosed, sendFile, sendMessage }: TChatFooterProps) => {
    const { isMobile } = useDevice();
    const [value, setValue] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null) as React.MutableRefObject<HTMLInputElement | null>;
    const textInputRef = useRef<HTMLInputElement>(null) as React.MutableRefObject<HTMLInputElement | null>;

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

    const sendChatMessage = () => {
        const elTarget = textInputRef.current;
        const shouldRestoreFocus = document.activeElement === elTarget;

        if (elTarget?.value) {
            sendMessage(elTarget.value);
            elTarget.value = '';
            setValue('');

            if (shouldRestoreFocus) {
                elTarget.focus();
            }
        }
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && !isMobile) {
            if (event.ctrlKey || event.metaKey) {
                const element = event.target as HTMLInputElement;
                const { value } = element;

                if (typeof element.selectionStart === 'number' && typeof element.selectionEnd === 'number') {
                    element.value = `${value.slice(0, element.selectionStart)}\n${value.slice(element.selectionEnd)}`;
                } else if (document.selection?.createRange) {
                    element.focus();

                    const range = document.selection.createRange();

                    range.text = '\r\n';
                    range.collapse(false);
                    range.select();
                }
            } else {
                event.preventDefault();
                sendChatMessage();
            }
        }
    };

    return (
        <div className='px-[2.4rem] pt-[1.6rem] pb-[2.8rem] w-full'>
            <Input
                isFullWidth
                label='Enter message'
                maxLength={5000}
                message={`${value.length}/5000`}
                onChange={onChange}
                onKeyDown={handleKeyDown}
                ref={ref => (textInputRef.current = ref)}
                rightPlaceholder={
                    <ChatFooterIcon
                        length={value.length}
                        onClick={() => (value.length > 0 ? sendChatMessage() : fileInputRef.current?.click())}
                    />
                }
                wrapperClassName='p2p-v2-chat-footer__input'
            />
            <div className='hidden'>
                <Input
                    data-testid='dt_p2p_v2_file_input'
                    name='file'
                    onChange={e => sendFile(e.target.files?.[0] as File)}
                    ref={el => (fileInputRef.current = el)}
                    type='file'
                />
            </div>
        </div>
    );
};

export default ChatFooter;
