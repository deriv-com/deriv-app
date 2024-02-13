import React, { ComponentProps, isValidElement, PropsWithChildren, ReactNode } from 'react';
import { Text } from '@deriv-com/ui';
import './ActionScreen.scss';

type TProps = {
    description: ReactNode;
    descriptionSize?: ComponentProps<typeof Text>['size'];
    icon?: ReactNode;
    renderButtons?: () => ReactNode;
    title?: ReactNode;
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
        <div className='action-screen'>
            {icon}
            <div className='action-screen__info'>
                {title && (
                    <Text align='center' size={titleSize} weight='bold'>
                        {title}
                    </Text>
                )}
                {isValidElement(description) ? (
                    description
                ) : (
                    <Text align='center' size={descriptionSize}>
                        {description}
                    </Text>
                )}
            </div>
            {renderButtons?.()}
        </div>
    );
};

export default ActionScreen;
