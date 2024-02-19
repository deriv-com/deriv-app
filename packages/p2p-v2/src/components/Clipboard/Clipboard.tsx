import React, { useEffect, useState } from 'react';
import { useCopyToClipboard } from 'usehooks-ts';
import { Tooltip } from '@deriv-com/ui';
import CheckmarkCircle from '../../public/ic-checkmark-circle.svg';
import CopyIcon from '../../public/ic-clipboard.svg';
import './Clipboard.scss';

type TClipboardProps = {
    textCopy: string;
};

const Clipboard = ({ textCopy }: TClipboardProps) => {
    const [, copy] = useCopyToClipboard();
    const [isCopied, setIsCopied] = useState(false);
    let timeoutClipboard: ReturnType<typeof setTimeout>;

    const onClick = (event: { stopPropagation: () => void }) => {
        setIsCopied(true);
        copy(textCopy);
        timeoutClipboard = setTimeout(() => {
            setIsCopied(false);
        }, 2000);
        event.stopPropagation();
    };

    useEffect(() => {
        return () => clearTimeout(timeoutClipboard);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Tooltip message={isCopied ? 'Copied!' : 'Copy'} position='right'>
            <button className='p2p-v2-clipboard' onClick={onClick}>
                {isCopied ? <CheckmarkCircle /> : <CopyIcon />}
            </button>
        </Tooltip>
    );
};

export default Clipboard;
