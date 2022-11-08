import React from 'react';
import classNames from 'classnames';
import { useIsMounted } from '@deriv/shared';
import Popover from '../popover';
import Icon from '../icon';
import { TPopoverProps } from '../types';
import { useCopyToClipboard } from '../../hooks';

type TClipboard = {
    text_copy: string;
    icon?: string;
    info_message?: string;
    success_message?: string;
    className?: string;
    popoverClassName?: string;
    popoverAlignment?: 'top' | 'right' | 'bottom' | 'left';
    popover_props?: Partial<TPopoverProps>;
};
const Clipboard = ({
    text_copy,
    info_message,
    icon,
    success_message,
    className,
    popoverClassName,
    popover_props = {},
    popoverAlignment = 'bottom',
}: TClipboard) => {
    const [is_copied, copyToClipboard, setIsCopied] = useCopyToClipboard();
    const isMounted = useIsMounted();
    let timeout_clipboard: NodeJS.Timeout;

    const onClick = (event: { stopPropagation: () => void }) => {
        copyToClipboard(text_copy);
        timeout_clipboard = setTimeout(() => {
            if (isMounted()) {
                setIsCopied(false);
            }
        }, 2000);
        event.stopPropagation();
    };

    React.useEffect(() => {
        return () => clearTimeout(timeout_clipboard);
    }, []);

    return (
        <Popover
            alignment={popoverAlignment}
            classNameBubble={classNames('dc-clipboard__popover', popoverClassName)}
            message={is_copied ? success_message : info_message}
            relative_render
            {...popover_props}
        >
            {is_copied && (
                <Icon
                    icon='IcCheckmarkCircle'
                    custom_color='var(--status-success)'
                    className={classNames('dc-clipboard', className)}
                />
            )}
            {!is_copied && (
                <Icon
                    icon={icon || 'IcClipboard'}
                    custom_color='var(--text-less-prominent)'
                    className={classNames('dc-clipboard', className)}
                    onClick={onClick}
                />
            )}
        </Popover>
    );
};

export default Clipboard;
