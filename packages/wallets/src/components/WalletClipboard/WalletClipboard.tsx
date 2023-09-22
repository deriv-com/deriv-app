import React, { useEffect, useState } from 'react';
import { useCopyToClipboard } from 'usehooks-ts';
import CheckmarkCircle from '../../public/images/checkmark-circle.svg';
import Clipboard from '../../public/images/clipboard.svg';
import './WalletClipboard.scss';

type TProps = {
    info_message?: string;
    popoverAlignment: 'bottom' | 'left' | 'right' | 'top';
    success_message: string;
    text_copy: string;
};

const WalletClipboard = ({
    //  info_message, popoverAlignment, success_message,
    text_copy,
}: TProps) => {
    const [, copy] = useCopyToClipboard();
    const [isCopied, setIsCopied] = useState(false);
    let timeout_clipboard: ReturnType<typeof setTimeout>;

    const onClick = (event: { stopPropagation: () => void }) => {
        setIsCopied(true);
        copy(text_copy);
        timeout_clipboard = setTimeout(() => {
            setIsCopied(false);
        }, 2000);
        event.stopPropagation();
    };

    useEffect(() => {
        return () => clearTimeout(timeout_clipboard);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <button className='wallets-clipboard' onClick={onClick}>
            {isCopied ? <CheckmarkCircle /> : <Clipboard />}
        </button>
    );
};

export default WalletClipboard;
