import React, { ComponentProps, PropsWithChildren, ReactElement, ReactNode } from 'react';
import { Text } from '@deriv-com/ui';
import { WalletButton, WalletButtonGroup } from '../Base';
import './WalletsActionScreen.scss';

type TProps = {
    description?: ReactNode;
    descriptionSize?: ComponentProps<typeof Text>['size'];
    icon?: ReactNode;
    renderButtons?: () =>
        | ReactElement<ComponentProps<'div'>>
        | ReactElement<ComponentProps<typeof WalletButton>>
        | ReactElement<ComponentProps<typeof WalletButtonGroup>>
        | null;
    title?: ReactNode;
    titleSize?: ComponentProps<typeof Text>['size'];
};

/**
 * Generic component to display status / action screen / final screen
 * As its common and repeated in many places,
 * at the moment of writing this, there are already 3 different patterns use to display ex
 */
const WalletsActionScreen: React.FC<PropsWithChildren<TProps>> = ({
    description,
    descriptionSize = 'md',
    icon,
    renderButtons,
    title,
    titleSize = 'md',
}) => {
    return (
        <div className='wallets-action-screen'>
            {icon}
            <div className='wallets-action-screen__info'>
                {title && (
                    <Text align='center' size={titleSize} weight='bold'>
                        {title}
                    </Text>
                )}
                <Text align='center' size={descriptionSize}>
                    {description}
                </Text>
            </div>
            {renderButtons?.()}
        </div>
    );
};

export default WalletsActionScreen;
