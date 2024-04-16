import React, { useEffect, useState } from 'react';
import { useCopyToClipboard } from 'usehooks-ts';
import { Tooltip, useDevice } from '@deriv-com/ui';
import Copy from '../../assets/images/copy.svg';
import CheckmarkCircle from '../../assets/images/ic-checkmark-circle.svg';
import styles from './Clipboard.module.scss';

type TProps = {
    popoverAlignment: 'bottom' | 'left' | 'right' | 'top';
    textCopy: string;
};

const Clipboard: React.FC<TProps> = ({ popoverAlignment, textCopy }) => {
    const [, copy] = useCopyToClipboard();
    const [isCopied, setIsCopied] = useState(false);
    const { isMobile } = useDevice();
    let timeoutClipboard: ReturnType<typeof setTimeout>;

    const onClick = () => {
        setIsCopied(true);
        copy(textCopy);
        timeoutClipboard = setTimeout(() => {
            setIsCopied(false);
        }, 2000);
    };

    useEffect(() => {
        return () => clearTimeout(timeoutClipboard);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Tooltip
            message={isCopied ? 'Copied!' : 'Copy'}
            position={popoverAlignment}
            triggerAction={isMobile ? 'click' : 'hover'}
        >
            <button className={styles.button} onClick={onClick}>
                {isCopied ? <CheckmarkCircle /> : <Copy />}
            </button>
        </Tooltip>
    );
};

export default Clipboard;
