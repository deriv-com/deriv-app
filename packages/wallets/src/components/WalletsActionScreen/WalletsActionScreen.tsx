import React, { ReactNode, PropsWithChildren } from 'react';
import useDevice from '../../hooks/useDevice';
import WalletButton from '../Base/WalletButton/WalletButton';
import WalletText from '../Base/WalletText/WalletText';
import './WalletsActionScreen.scss';

type TProps = {
    actionText?: string;
    description?: ReactNode;
    icon?: ReactNode;
    onAction?: () => void;
    title?: string;
    variant?: NonNullable<React.ComponentProps<typeof WalletButton>['variant']>;
};

/**
 * Generic component to display status / action screen / final screen
 * As its common and repeated in many places,
 * at the moment of writing this, there are already 3 different patterns use to display ex
 *
 * @param icon
 * @param title
 * @param description
 * @param actionText
 * @param onAction
 * @param variant
 * @constructor
 */
const WalletsActionScreen: React.FC<PropsWithChildren<TProps>> = ({
    actionText,
    description,
    icon,
    onAction,
    title,
    variant,
}) => {
    const { isMobile } = useDevice();

    return (
        <div className='wallets-action-screen'>
            {icon && <div className='wallets-action-screen__icon'>{icon}</div>}

            {title && (
                <div className='wallets-action-screen__title'>
                    <WalletText size={isMobile ? 'lg' : '2xl'} weight='bold'>
                        {title}
                    </WalletText>
                </div>
            )}

            {description && (
                <div className='wallets-action-screen__subtitle'>
                    <WalletText size={isMobile ? 'md' : 'lg'}>{description}</WalletText>
                </div>
            )}

            {actionText && onAction && (
                <div className='wallets-action-screen__button'>
                    {actionText && (
                        <WalletButton
                            color='primary'
                            onClick={onAction}
                            size='lg'
                            text={actionText}
                            variant={variant}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default WalletsActionScreen;
