import React, { ComponentProps, isValidElement, PropsWithChildren, ReactElement, ReactNode } from 'react';
import { WalletButton, WalletButtonGroup } from '../Base';
import WalletText from '../Base/WalletText/WalletText';
import './WalletsActionScreen.scss';

type TProps = {
    description: ReactNode;
    descriptionSize?: ComponentProps<typeof WalletText>['size'];
    icon?: ReactNode;
    renderButtons?: () =>
        | ReactElement<ComponentProps<'div'>>
        | ReactElement<ComponentProps<typeof WalletButton>>
        | ReactElement<ComponentProps<typeof WalletButtonGroup>>
        | null;
    title?: string;
    titleSize?: ComponentProps<typeof WalletText>['size'];
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
                    <WalletText align='center' size={titleSize} weight='bold'>
                        {title}
                    </WalletText>
                )}
                {isValidElement(description) ? (
                    description
                ) : (
                    <WalletText align='center' size={descriptionSize}>
                        {description}
                    </WalletText>
                )}
            </div>
            {renderButtons?.()}
        </div>
    );
};

export default WalletsActionScreen;
