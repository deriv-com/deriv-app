import React from 'react';
import { CSSTransition } from 'react-transition-group';
import classNames from 'classnames';
import { Icon, Text } from '@deriv/components';
import { getWalletHeaderButtons } from 'Constants/utils';
import './wallet-button.scss';

type TProps = {
    button: ReturnType<typeof getWalletHeaderButtons>[number];
    is_desktop_wallet?: boolean;
    is_disabled?: boolean;
    is_open?: boolean;
};

const WalletButton = ({ button, is_desktop_wallet, is_disabled, is_open }: TProps) => {
    const { name, text, icon, action } = button;
    return is_desktop_wallet ? (
        <div
            key={name}
            className={classNames('wallet-button__desktop-item', {
                'wallet-button__desktop-item-disabled': is_disabled,
            })}
            onClick={action}
        >
            <Icon icon={icon} custom_color={is_disabled ? 'var(--general-disabled)' : 'var(--text-prominent)'} />
            <CSSTransition
                appear
                in={is_open}
                timeout={240}
                classNames='wallet-button__desktop-item-transition'
                unmountOnExit
            >
                <Text
                    weight='bold'
                    color={is_disabled ? 'disabled' : 'prominent'}
                    size='xs'
                    className='wallet-button__desktop-item-text'
                    role='button'
                >
                    {text}
                </Text>
            </CSSTransition>
        </div>
    ) : (
        <div className='wallet-button__mobile-item' onClick={action}>
            <div className='wallet-button__mobile-item-icon'>
                <Icon icon={icon} />
            </div>
            <Text size='xxxxs' className='wallet-button__mobile-item-text' role='button'>
                {text}
            </Text>
        </div>
    );
};

export default WalletButton;
