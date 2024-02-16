import React, { ComponentProps } from 'react';
import { clsx } from 'clsx';
import CloseIcon from '@/assets/svgs/ic-close-dark.svg';
import { Provider } from '@deriv/library';
import { Text } from '@deriv-com/ui';

/**
 * Type for the DialogHeader component props
 * @typedef TDialogHeader
 * @property {string} [className] - Optional CSS class name
 * @property {boolean} [hideCloseButton] - Optional flag to hide the close button
 * @property {string} [title] - Optional title for the dialog header
 */
type TDialogHeader = {
    className?: string;
    hideCloseButton?: boolean;
    title?: string;
    titleSize?: ComponentProps<typeof Text>['size'];
};

/**
 * DialogHeader component
 * @param {TDialogHeader} props - The properties that define the DialogHeader component.
 * @returns {JSX.Element} The DialogHeader component.
 */
const DialogHeader = ({ className, titleSize, hideCloseButton = false, title }: TDialogHeader) => {
    const { hide } = Provider.useModal();

    return (
        <div className={clsx('flex items-start', title ? 'justify-between' : 'justify-end', className)}>
            {title && (
                <Text className='flex-1' size={titleSize} weight='bold'>
                    {title}
                </Text>
            )}
            {!hideCloseButton && <CloseIcon className='hover:cursor-pointer' onClick={hide} />}
        </div>
    );
};

export default DialogHeader;
