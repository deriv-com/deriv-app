import React, { ComponentProps, isValidElement, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import { Text } from '@deriv-com/ui';

type TActionScreenProps = {
    children?: ReactNode;
    className?: string;
    description: ReactNode;
    descriptionSize?: ComponentProps<typeof Text>['size'];
    icon?: ReactNode;
    renderButtons?: () => ReactNode;
    title?: string;
    titleSize?: ComponentProps<typeof Text>['size'];
};

/**
 * Generic component to display status / action screen / final screen
 * As its common and repeated in many places,
 * at the moment of writing this, there are already 3 different patterns use to display ex
 */
const ActionScreen = ({
    children,
    className,
    description,
    descriptionSize = 'md',
    icon,
    renderButtons,
    title,
    titleSize = 'md',
}: TActionScreenProps) => {
    return (
        <div
            className={twMerge('flex flex-col items-center justify-center gap-24 w-auto h-auto rounded-xs', className)}
        >
            {icon}
            <div className='flex flex-col items-center justify-center gap-8'>
                {title && (
                    <Text size={titleSize} weight='bold'>
                        {title}
                    </Text>
                )}
                {isValidElement(description) ? (
                    description
                ) : (
                    <Text className='text-center' size={descriptionSize}>
                        {description}
                    </Text>
                )}
            </div>
            {renderButtons?.()}
            {children}
        </div>
    );
};

export default ActionScreen;
