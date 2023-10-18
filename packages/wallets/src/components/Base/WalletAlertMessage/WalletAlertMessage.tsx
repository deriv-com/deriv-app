import React, { ReactNode } from 'react';
import useDevice from '../../../hooks/useDevice';
import ErrorCircleCrossmark from '../../../public/images/error-circle-crossmark.svg';
import InfoCircleDots from '../../../public/images/info-circle-dots.svg';
import SuccessCircleCheckmark from '../../../public/images/success-circle-checkmark.svg';
import { WalletButton, WalletText } from '../index';
import styles from './WalletAlertMessage.module.css';

const typeMapper = {
    error: {
        color: 'error',
        icon: ErrorCircleCrossmark,
    },
    info: {
        color: 'blue',
        icon: InfoCircleDots,
    },
    success: {
        color: 'success',
        icon: SuccessCircleCheckmark,
    },
};

type TAlertMessageProps =
    | {
          buttonLabel: ReactNode;
          message: ReactNode;
          onClickHandler: VoidFunction;
          type: 'error' | 'info' | 'success';
          variant: 'with-action-button';
      }
    | {
          message: ReactNode;
          type: 'error' | 'info' | 'success';
          variant: 'base';
      };

const WalletAlertMessage: React.FC<TAlertMessageProps> = props => {
    const { isMobile } = useDevice();
    const { message, type, variant } = props;

    const Icon = typeMapper[type].icon;
    const color = typeMapper[type].color;

    return (
        <div className={styles['wallets-alert-message']} data-testid='dt_wallet-alert-message'>
            <div className={styles['wallets-alert-message__icon-container']}>
                <div className={styles['wallets-alert-message__icon-container__line']} />
                <div className={styles['wallets-alert-message__icon-container__icon']}>
                    <Icon />
                </div>
            </div>
            <div className={styles['wallets-alert-message__message-container']}>
                <WalletText color={color} size={isMobile ? '2xs' : 'xs'}>
                    {message}
                </WalletText>
            </div>
            {variant === 'with-action-button' && props.buttonLabel && (
                <div className={styles['wallets-alert-message__button-container']}>
                    <WalletButton onClick={props.onClickHandler} size='sm' text={props.buttonLabel} />
                </div>
            )}
        </div>
    );
};

export default WalletAlertMessage;
