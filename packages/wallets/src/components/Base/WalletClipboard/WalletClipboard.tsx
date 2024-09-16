import React, { ComponentProps, useEffect, useState } from 'react';
import classNames from 'classnames';
import { useCopyToClipboard } from 'usehooks-ts';
import { LegacyCopy1pxIcon, LegacyWonIcon } from '@deriv/quill-icons';
import { useTranslations } from '@deriv-com/translations';
import { Tooltip, useDevice } from '@deriv-com/ui';

type TProps = {
    className?: ComponentProps<typeof Tooltip>['className'];
    popoverAlignment?: ComponentProps<typeof Tooltip>['tooltipPosition'];
    textCopy: string;
};

const WalletClipboard = ({ className, popoverAlignment = 'right', textCopy }: TProps) => {
    const [, copy] = useCopyToClipboard();
    const { isDesktop } = useDevice();
    const { localize } = useTranslations();
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
        <Tooltip
            as='button'
            className={classNames('wallets-clipboard', className)}
            hideTooltip={!isDesktop}
            onClick={onClick}
            tooltipContent={isCopied ? localize('Copied!') : localize('Copy')}
            tooltipPosition={popoverAlignment}
        >
            {isCopied ? (
                <LegacyWonIcon data-testid='dt_legacy_won_icon' fill='#4BB4B3' iconSize='xs' />
            ) : (
                <LegacyCopy1pxIcon data-testid='dt_legacy_copy_icon' iconSize='xs' />
            )}
        </Tooltip>
    );
};

export default WalletClipboard;
