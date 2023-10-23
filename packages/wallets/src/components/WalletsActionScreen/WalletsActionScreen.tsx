import React, { ComponentProps, PropsWithChildren, ReactNode } from 'react';
import classNames from 'classnames';
import useDevice from '../../hooks/useDevice';
import WalletButton from '../Base/WalletButton/WalletButton';
import WalletText from '../Base/WalletText/WalletText';
import './WalletsActionScreen.scss';

type TProps = {
    actionText?: string;
    actionVariant?: ComponentProps<typeof WalletButton>['variant'];
    description: ReactNode;
    icon: ReactNode;
    onAction?: () => void;
    title?: string;
    type?: 'modal' | 'page';
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
 * @constructor
 */
const WalletsActionScreen: React.FC<PropsWithChildren<TProps>> = ({
    actionText,
    actionVariant = 'contained',
    description,
    icon,
    onAction,
    title,
    type = 'page',
}) => {
    const { isMobile } = useDevice();

    return (
        <div
            className={classNames('wallets-action-screen', {
                'wallets-action-screen__modal': type === 'modal',
            })}
        >
            {icon}
            <div className='wallets-action-screen__content'>
                {title && (
                    <WalletText align='center' size={isMobile ? 'sm' : 'md'} weight='bold'>
                        {title}
                    </WalletText>
                )}
                <WalletText align='center' size={isMobile ? 'sm' : 'md'}>
                    {description}
                </WalletText>
            </div>
            {actionText && (
                <WalletButton color='primary' onClick={onAction} size='lg' text={actionText} variant={actionVariant} />
            )}
        </div>
    );
};

export default WalletsActionScreen;
