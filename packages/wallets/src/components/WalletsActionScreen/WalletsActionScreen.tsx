import React, { ReactNode, PropsWithChildren } from 'react';
import useDevice from '../../hooks/useDevice';
import WalletButton from '../Base/WalletButton/WalletButton';
import WalletText from '../Base/WalletText/WalletText';
import './WalletsActionScreen.scss';

type TProps = {
    action: {
        actionText?: string;
        disabled?: boolean;
        onAction?: VoidFunction;
        variant?: NonNullable<React.ComponentProps<typeof WalletButton>['variant']>;
    };
    description?: ReactNode;
    icon?: ReactNode;
    title?: string;
};

/**
 * Generic component to display status / action screen / final screen
 * As its common and repeated in many places,
 * at the moment of writing this, there are already 3 different patterns use to display ex
 *
 * @param action
 * @param description
 * @param icon
 * @param title
 * @constructor
 */
const WalletsActionScreen: React.FC<PropsWithChildren<TProps>> = ({ action, description, icon, title }) => {
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

            {action && (
                <div className='wallets-action-screen__button'>
                    {action.actionText && (
                        <WalletButton
                            color='primary'
                            disabled={action.disabled}
                            onClick={action.onAction}
                            size='lg'
                            text={action.actionText}
                            variant={action.variant}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default WalletsActionScreen;
