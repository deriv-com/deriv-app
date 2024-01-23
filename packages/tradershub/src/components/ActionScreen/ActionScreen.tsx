import React, { ComponentProps, isValidElement, PropsWithChildren, ReactNode } from 'react';
import { qtMerge, Text } from '@deriv/quill-design';

type TProps = {
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
const ActionScreen: React.FC<PropsWithChildren<TProps>> = ({
    className,
    description,
    descriptionSize = 'md',
    icon,
    renderButtons,
    title,
    titleSize = 'md',
}) => {
    return (
        <div
            className={qtMerge([
                'flex flex-col items-center justify-center gap-1200  w-auto h-auto rounded-200',
                className,
            ])}
        >
            {icon}
            <div className='flex flex-col items-center justify-center gap-400'>
                {title && (
                    <Text bold size={titleSize}>
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
        </div>
    );
};

export default ActionScreen;
