import React, { useEffect, useRef, useState } from 'react';
import { useCopyToClipboard, useHover } from 'usehooks-ts';
import { useBreakpoint } from '@deriv/quill-design';
import Clipboard from '../../../public/images/clipboard.svg';
import CheckmarkCircle from '../../../public/images/ic-checkmark-circle.svg';
import { Tooltip } from '../Tooltip';

type TProps = {
    infoMessage?: string;
    popoverAlignment: 'bottom' | 'left' | 'right' | 'top';
    successMessage: string;
    textCopy: string;
};

const WalletClipboard = ({
    //  info_message, popoverAlignment, success_message,
    textCopy,
}: TProps) => {
    const [, copy] = useCopyToClipboard();
    const { isMobile } = useBreakpoint();
    const [isCopied, setIsCopied] = useState(false);
    const hoverRef = useRef(null);
    const isHovered = useHover(hoverRef);
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
        <Tooltip alignment='right' isVisible={isHovered && !isMobile} message={isCopied ? 'Copied!' : 'Copy'}>
            <button
                className='all-unset rounded-r-md border-l-0 flex items-center justify-center cursor-pointer'
                onClick={onClick}
                ref={hoverRef}
            >
                {isCopied ? <CheckmarkCircle /> : <Clipboard />}
            </button>
        </Tooltip>
    );
};

export default WalletClipboard;
