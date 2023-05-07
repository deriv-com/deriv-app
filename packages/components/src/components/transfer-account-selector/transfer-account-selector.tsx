import React from 'react';
import classNames from 'classnames';
import { capitalizeFirstLetter, isMobile } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import { WalletIcon, WalletTile } from '../wallet';
import Modal from '../modal';
import Icon from '../icon';
import './transfer-account-selector.scss';

type TTransferAccount = {
    loginid: string;
    label?: string;
    currency?: string;
    balance?: string;
    wallet_icon?: string;
    icon?: string;
    jurisdiction?: string;
};

type TTransferAccountSelectorProps = {
    label?: string;
    placeholder?: string;
    transfer_accounts: { [k: string]: TTransferAccount[] };
    value?: TTransferAccount;
    wallet_name?: string;
};

const ChevronIcon = ({ className }: { className?: string }) => {
    return (
        <React.Fragment>
            <Icon className={`transfer-account-selector__chevron-icon ${className}`} icon='IcChevronDown' />
        </React.Fragment>
    );
};

const TransferAccountSelector = ({
    label,
    placeholder,
    transfer_accounts = {},
    value,
    wallet_name,
}: TTransferAccountSelectorProps) => {
    const [is_list_modal_open, setIsListModalOpen] = React.useState(false);
    const [selected_account, setSelectedAccount] = React.useState<TTransferAccount | undefined>(value);

    const openAccountsList = () => {
        setIsListModalOpen(true);
    };

    return (
        <div
            className='transfer-account-selector'
            onClick={is_list_modal_open ? undefined : openAccountsList}
            data-testid='dt_transfer-account-selector'
        >
            <div className='transfer-account-selector__heading'>
                <span className='transfer-account-selector__label'>{label}</span>

                {isMobile() && <ChevronIcon />}
            </div>

            <div className='transfer-account-selector__content'>
                {!selected_account && <span className='transfer-account-selector__placeholder'>{placeholder}</span>}
                {selected_account && (
                    <WalletTile
                        icon={
                            <WalletIcon
                                wallet_icon={selected_account.wallet_icon}
                                wallet_bg={
                                    selected_account.wallet_icon ? `wallet__${selected_account.currency}-bg` : ''
                                }
                                account_icon={selected_account.icon}
                            />
                        }
                        account={selected_account}
                        className='transfer-account-selector__value'
                        is_mobile={isMobile()}
                    />
                )}

                {!isMobile() && <ChevronIcon />}
            </div>

            <Modal
                className='transfer-account-selector__modal-header'
                has_close_icon
                is_open={is_list_modal_open}
                title={label}
                toggleModal={() => setIsListModalOpen(old => !old)}
            >
                <div>
                    {Object.keys(transfer_accounts).map((key, idx) => {
                        return (
                            <React.Fragment key={idx}>
                                <div
                                    className={classNames('transfer-account-selector__list', {
                                        'transfer-account-selector__list--is-last':
                                            Object.keys(transfer_accounts).length === idx + 1,
                                    })}
                                >
                                    <span className='transfer-account-selector__list-header'>
                                        {key === 'accounts' ? (
                                            <Localize
                                                i18n_default_text='Trading accounts linked with {{wallet}}'
                                                values={{
                                                    wallet: wallet_name,
                                                }}
                                            />
                                        ) : (
                                            <>{capitalizeFirstLetter(key)}</>
                                        )}
                                    </span>
                                    <div className='transfer-account-selector__list-items'>
                                        {transfer_accounts[key].map((account, index) => (
                                            <WalletTile
                                                key={index}
                                                icon={
                                                    <WalletIcon
                                                        wallet_icon={account.wallet_icon}
                                                        wallet_bg={
                                                            account.wallet_icon ? `wallet__${account.currency}-bg` : ''
                                                        }
                                                        account_icon={account.icon}
                                                    />
                                                }
                                                account={account}
                                                className={classNames('transfer-account-selector__list-tile', {
                                                    'transfer-account-selector__list-tile--is-last':
                                                        transfer_accounts[key].length === index + 1,
                                                })}
                                                is_active={selected_account?.loginid === account.loginid}
                                                has_hover
                                                onClick={() => {
                                                    setSelectedAccount(account);
                                                    setIsListModalOpen(false);
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </React.Fragment>
                        );
                    })}
                </div>
            </Modal>
        </div>
    );
};

export default TransferAccountSelector;
