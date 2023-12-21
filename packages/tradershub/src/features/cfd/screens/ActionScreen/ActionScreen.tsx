import React, { ComponentProps, isValidElement, PropsWithChildren, ReactElement, ReactNode } from 'react';
import { Text } from '@deriv/quill-design';

type TProps = {
    description: ReactNode;
    descriptionSize?: ComponentProps<typeof Text>['size'];
    icon?: ReactNode;
    renderButtons?: () => ReactElement<ComponentProps<'div'>> | null;
    title?: string;
    titleSize?: ComponentProps<typeof Text>['size'];
};

/**
 * Generic component to display status / action screen / final screen
 * As its common and repeated in many places,
 * at the moment of writing this, there are already 3 different patterns use to display ex
 */
const ActionScreen: React.FC<PropsWithChildren<TProps>> = ({
    description,
    descriptionSize = 'md',
    icon,
    renderButtons,
    title,
    titleSize = 'md',
}) => {
    return (
        <div className='flex p-1500 flex-col items-center gap-1200 w-auto h-auto bg-background-primary-container rounded-200'>
            {icon}
            <div className='flex flex-col gap-400'>
                {title && (
                    <Text bold size={titleSize}>
                        {title}
                    </Text>
                )}
                {isValidElement(description) ? description : <Text size={descriptionSize}>{description}</Text>}
            </div>
            {renderButtons?.()}
        </div>
    );
};

export default ActionScreen;
