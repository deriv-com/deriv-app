import React from 'react';
import classNames from 'classnames';
import { isMobile } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import Text from '../text';
import { WalletTile } from '../wallet-tile';
import Modal from '../modal';
import Icon from '../icon';
import './transfer-account-selector.scss';

type TTransferAccount = React.ComponentProps<typeof WalletTile>['account'];

type TTransferAccountSelectorProps = {
    label?: string;
    placeholder?: string;
    portal_id?: string;
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
    portal_id,
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
        <div className='transfer-account-selector' onClick={openAccountsList}>
            <div className='transfer-account-selector__heading'>
                <Text className='transfer-account-selector__label' size='xs'>
                    {label}
                </Text>

                {isMobile() && <ChevronIcon />}
            </div>

            <div className='transfer-account-selector__content'>
                {!selected_account && (
                    <Text size='xs' weight='bold'>
                        {placeholder}
                    </Text>
                )}
                {selected_account && (
                    <WalletTile
                        account={selected_account}
                        className='transfer-account-selector__value'
                        is_mobile={isMobile()}
                        is_value
                    />
                )}

                {!isMobile() && <ChevronIcon />}
            </div>

            <Modal
                className='transfer-account-selector__modal-header'
                has_close_icon
                is_open={is_list_modal_open}
                portalId={portal_id}
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
                                        <Text size='xs' weight='bold'>
                                            {key === 'accounts' ? (
                                                <Localize
                                                    i18n_default_text='Trading accounts linked with {{wallet}}'
                                                    values={{
                                                        wallet: wallet_name,
                                                    }}
                                                />
                                            ) : (
                                                <React.Fragment>{localize('Wallets')}</React.Fragment>
                                            )}
                                        </Text>
                                    </span>
                                    <div className='transfer-account-selector__list-items'>
                                        {transfer_accounts[key].map((account, index) => (
                                            <WalletTile
                                                key={index}
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
