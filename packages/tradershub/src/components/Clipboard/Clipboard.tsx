import React, { useEffect, useState } from 'react';
import { useCopyToClipboard } from 'usehooks-ts';
import { Button } from '@deriv/quill-design';
import ClipboardIcon from '../../public/images/clipboard.svg';
import CheckmarkCircle from '../../public/images/ic-checkmark-circle.svg';
import { Tooltip } from '../Tooltip';

type TClipboardProps = {
    textCopy: string;
    tooltipPosition?: 'bottom' | 'left' | 'right' | 'top';
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
const Clipboard = ({ textCopy, tooltipPosition }: TClipboardProps) => {
    const [, copy] = useCopyToClipboard();
    const [isCopied, setIsCopied] = useState(false);
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
        <Tooltip className='text-center' message={isCopied ? 'Copied!' : 'Copy'} position={tooltipPosition ?? 'bottom'}>
            <Button colorStyle='white' onClick={onClick} size='sm' variant='tertiary'>
                {isCopied ? <CheckmarkCircle /> : <ClipboardIcon />}
            </Button>
        </Tooltip>
    );
};

export default Clipboard;
