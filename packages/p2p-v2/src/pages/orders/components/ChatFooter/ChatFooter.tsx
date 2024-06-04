import React, { ChangeEvent, KeyboardEvent, useRef, useState } from 'react';
import { Input, Text, useDevice } from '@deriv-com/ui';
import ChatFooterIcon from '../ChatFooterIcon/ChatFooterIcon';
import { TextAreaWithIcon } from '../TextAreaWithIcon';

type TChatFooterProps = {
    isClosed: boolean;
    sendFile: (file: File) => void;
    sendMessage: (message: string) => void;
};
const ChatFooter = ({ isClosed, sendFile, sendMessage }: TChatFooterProps) => {
    const { isMobile } = useDevice();
    const [value, setValue] = useState('');
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const textInputRef = useRef<HTMLTextAreaElement | null>(null);

    const onChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
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

    const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !isMobile) {
            if (event.ctrlKey || event.metaKey) {
                const element = event.currentTarget;
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
            <TextAreaWithIcon
                icon={
                    <ChatFooterIcon
                        length={value.length}
                        onClick={() => (value.length > 0 ? sendChatMessage() : fileInputRef.current?.click())}
                    />
                }
                maxLength={5000}
                onChange={onChange}
                onKeyDown={handleKeyDown}
                placeholder='Enter message'
                ref={ref => (textInputRef.current = ref)}
                shouldShowCounter
                value={value}
            />
            <div className='hidden'>
                <Input
                    data-testid='dt_p2p_v2_file_input'
                    name='file'
                    onChange={e => {
                        if (e.target.files?.[0]) {
                            sendFile(e.target.files[0]);
                        }
                    }}
                    ref={el => (fileInputRef.current = el)}
                    type='file'
                />
            </div>
        </div>
    );
};

export default ChatFooter;
