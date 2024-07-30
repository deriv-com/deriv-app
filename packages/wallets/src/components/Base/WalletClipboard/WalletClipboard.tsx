import React, { useEffect, useRef, useState } from 'react';
import { useCopyToClipboard, useHover } from 'usehooks-ts';
import { LegacyCopy1pxIcon, LegacyWonIcon } from '@deriv/quill-icons';
import useDevice from '../../../hooks/useDevice';
import { Tooltip } from '../Tooltip';
import './WalletClipboard.scss';

type TProps = {
    infoMessage?: string;
    popoverAlignment?: 'bottom' | 'left' | 'right' | 'top';
    successMessage?: string;
    textCopy: string;
};

const WalletClipboard = ({
    // info_message, success_message,
    popoverAlignment = 'right',
    textCopy,
}: TProps) => {
    const [, copy] = useCopyToClipboard();
    const { isMobile } = useDevice();
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
        <Tooltip
            alignment={popoverAlignment}
            isVisible={isHovered && !isMobile}
            message={isCopied ? 'Copied!' : 'Copy'}
        >
            <button className='wallets-clipboard' onClick={onClick} ref={hoverRef}>
                {isCopied ? (
                    <LegacyWonIcon data-testid='dt_legacy_won_icon' fill='#4BB4B3' iconSize='xs' />
                ) : (
                    <LegacyCopy1pxIcon data-testid='dt_legacy_copy_icon' iconSize='xs' />
                )}
            </button>
        </Tooltip>
    );
};

export default WalletClipboard;
