import React, { useEffect, useRef, useState } from 'react';
import { useCopyToClipboard } from 'usehooks-ts';
import { LabelPairedCircleCheckCaptionFillIcon, StandaloneCopyRegularIcon } from '@deriv/quill-icons';
import { Tooltip, useDevice } from '@deriv-com/ui';

type TProps = {
    infoMessage?: string;
    popoverAlignment?: 'bottom' | 'left' | 'right' | 'top';
    successMessage?: string;
    textCopy: string;
};

/**
 * @depricated TODO: remove this when it's available in @deriv-com/ui. This is temporary.
 */
const Clipboard: React.FC<TProps> = ({
    infoMessage = 'Copy',
    popoverAlignment,
    successMessage = 'Copied',
    textCopy,
}) => {
    const [, copy] = useCopyToClipboard();
    const [isCopied, setIsCopied] = useState(false);
    const { isMobile } = useDevice();
    const timeoutClipboard = useRef<ReturnType<typeof setTimeout>>();

    const onClick = () => {
        setIsCopied(true);
        copy(textCopy);
        timeoutClipboard.current = setTimeout(() => {
            setIsCopied(false);
        }, 2000);
    };

    useEffect(() => {
        return () => clearTimeout(timeoutClipboard.current);
    }, []);

    return (
        <Tooltip
            message={isCopied ? successMessage : infoMessage}
            position={popoverAlignment}
            triggerAction={isMobile ? 'click' : 'hover'}
        >
            <button className='flex items-center cursor-pointer px-0 mx-0 border-0 w-fit' onClick={onClick}>
                {isCopied ? (
                    <LabelPairedCircleCheckCaptionFillIcon
                        className='fill-status-light-success'
                        height={24}
                        width={24}
                    />
                ) : (
                    <StandaloneCopyRegularIcon height={24} iconSize='sm' width={24} />
                )}
            </button>
        </Tooltip>
    );
};

export default Clipboard;
