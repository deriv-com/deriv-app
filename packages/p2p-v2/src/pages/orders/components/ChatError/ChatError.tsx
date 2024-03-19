import React, { MouseEventHandler } from 'react';
import { Button, Text, useDevice } from '@deriv-com/ui';

type TChatErrorProps = {
    onClickRetry: MouseEventHandler<HTMLButtonElement>;
};

const ChatError = ({ onClickRetry }: TChatErrorProps) => {
    const { isMobile } = useDevice();

    return (
        <div className='flex flex-col gap-[1.6rem] items-center'>
            <Text size={isMobile ? 'lg' : 'md'}>Oops, something went wrong</Text>
            <Button className='w-fit' onClick={onClickRetry} variant='contained'>
                Retry
            </Button>
        </div>
    );
};

export default ChatError;
