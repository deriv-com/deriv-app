import React, { useEffect, useRef, useState } from 'react';
import { useCopyToClipboard, useHover } from 'usehooks-ts';
import ClipboardIcon from '@/assets/svgs/clipboard.svg';
import CheckmarkCircle from '@/assets/svgs/ic-checkmark-circle.svg';
import { Tooltip } from '@/components';
import { Button, useDevice } from '@deriv-com/ui';

type TClipboardProps = {
    textCopy: string;
    tooltip?: 'bottom' | 'left' | 'right' | 'top';
};

/**
 * Props for the Clipboard component.
 * @property {string} textCopy - The text to be copied to the clipboard.
 *
 * @example
 * ```jsx
 * <Clipboard textCopy="Text to be copied" />
 * ```
 */
const Clipboard = ({ textCopy, tooltip }: TClipboardProps) => {
    const [, copy] = useCopyToClipboard();
    const { isDesktop } = useDevice();
    const [isCopied, setIsCopied] = useState(false);
    const hoverRef = useRef(null);
    const isHovered = useHover(hoverRef);
    let timeoutClipboard: ReturnType<typeof setTimeout>;

    /**
     * Handle click event to copy text to clipboard.
     * @param {React.MouseEvent<HTMLButtonElement, MouseEvent>} event - The click event.
     */
    const onClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
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
        <Tooltip
            alignment={tooltip ?? 'bottom'}
            isVisible={isHovered && isDesktop}
            message={isCopied ? 'Copied!' : 'Copy'}
        >
            <Button color='white' onClick={onClick} size='sm' variant='ghost'>
                {isCopied ? <CheckmarkCircle /> : <ClipboardIcon />}
            </Button>
        </Tooltip>
    );
};

export default Clipboard;
