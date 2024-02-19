import React, { ComponentProps } from 'react';
import { clsx } from 'clsx';
import CloseIcon from '@/assets/svgs/ic-close-dark.svg';
import { Provider } from '@deriv/library';
import { Text } from '@deriv-com/ui';
import { TModalComponents } from './Modal';

/**
 * Type for the ModalHeader component props
 * @typedef TModalHeader
 * @property {string} [className] - Optional CSS class name
 * @property {boolean} [hideCloseButton] - Optional flag to hide the close button
 * @property {string} [title] - Optional title for the header
 * @extends TModalComponents
 */
type TModalHeader = TModalComponents & {
    hideCloseButton?: boolean;
    title?: string;
    titleClassName?: string;
    titleSize?: ComponentProps<typeof Text>['size'];
};

/**
 * ModalHeader component
 * @param {TModalHeader} props - The properties that define the ModalHeader component.
 * @returns {JSX.Element} The ModalHeader component.
 */
const ModalHeader = ({ className, hideCloseButton = false, title, titleClassName, titleSize }: TModalHeader) => {
    const { hide } = Provider.useModal();

    return (
        <div
            className={clsx(
                'flex items-center pl-16 pr-24 py-16 lg:px-24 border border-solid border-b-2 border-system-light-secondary-background w-full rounded-t-default',
                title ? 'justify-between' : 'justify-end',
                className
            )}
        >
            {title && (
                <Text className={clsx('flex-1 font-sans', titleClassName)} size={titleSize} weight='bold'>
                    {title}
                </Text>
            )}
            {!hideCloseButton && <CloseIcon className='cursor-pointer' onClick={hide} />}
        </div>
    );
};

export default ModalHeader;
