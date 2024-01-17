import React from 'react';
import classNames from 'classnames';
import { WalletText } from './../../../components';
import useDevice from './../../../hooks/useDevice';
import {WalletCardIcon} from './../../../components';

import './AccountSwitcher.scss';

type TProps = {

    accountsList: any[],
    activeWallet: any,
    label: string, 
    onSelect: (value?: any) => void,
    selectedAccount: any, 
};

const TitleLine = () => <div className='wallets-transfer-form-account-selection__title-line' />;

const AccountSwitcher: React.FC<TProps> = ({
    accountsList,
    activeWallet,
    label,
    onSelect,
    selectedAccount,
}) => {
    const { isMobile } = useDevice();

    return (
        <div className='wallets-transfer-form-account-selection'>
            {/* <div className='wallets-transfer-form-account-selection__header'> */}
                {/* <div className='wallets-transfer-form-account-selection__label'>
                    <WalletText size='md' weight='bold'>
                        {label}
                    </WalletText>
                </div>
                <button className='wallets-transfer-form-account-selection__close-button' onClick={() => modal.hide()}>
                   X
                </button> */}
            {/* </div> */}
            <div className='wallets-transfer-form-account-selection__accounts'>
                {accountsList.map((account, index) => {
                    return (
                        <div
                            className={classNames('wallets-transfer-form-account-selection__accounts-group', {})}
                            key={account.loginid}
                        >

                            <div className='wallets-transfer-form-account-selection__grouped-accounts'>

                                    <button
                                        className={classNames('wallets-transfer-form-account-selection__account', {
                                            'wallets-transfer-form-account-selection__account--selected':
                                                account?.loginid === selectedAccount?.loginid,
                                        })}
                                        key={`account-selection-${account?.loginid}`}
                                        onClick={() => {
                                            onSelect(account);
                                        }}
                                    >
                                        {/* start */}
                                            <div className={classNames('wallets-transfer-form-account-card', {})}>
                                                <div className='wallets-transfer-form-account-card__icon-with-badge'>
                                                    <div className='wallets-transfer-form-account-card__icon'>
                                                        <WalletCardIcon device='desktop' size={'md'} type={account?.is_virtual ? 'Demo' : account?.currency} />
                                                    </div>
                                                </div>

                                                <div className='wallets-transfer-form-account-card__content'>
                                                    <WalletText as='p' size={'sm'} weight='bold'>
                                                        {account?.currency} Wallet
                                                    </WalletText>
                                                    <WalletText as='p' size={'sm'} weight='bold'>
                                                        {account?.display_balance}
                                                    </WalletText>
                                                </div>
                                            </div>
                                        {/* end */}
                                    </button>

                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AccountSwitcher;
