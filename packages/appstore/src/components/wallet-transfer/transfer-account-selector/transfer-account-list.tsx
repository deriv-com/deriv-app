import React from 'react';
import classNames from 'classnames';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import WalletTransferTile from '../wallet-transfer-tile';
import type { TTransferAccount } from 'Types';

type TTransferAccountList = {
    is_mobile?: boolean;
    onSelectAccount?: (account: TTransferAccount) => void;
    selected_account?: TTransferAccount;
    setIsListModalOpen: (value: boolean) => void;
    setSelectedAccount: React.Dispatch<React.SetStateAction<TTransferAccount | undefined>>;
    transfer_accounts: Record<'trading_accounts' | 'wallet_accounts', Record<string, TTransferAccount>>;
    transfer_hint?: string | JSX.Element;
    wallet_name?: string;
};

const TitleLine = () => <div className='transfer-account-selector__list-header__title-line' />;

const TransferAccountList = ({
    is_mobile,
    onSelectAccount,
    selected_account,
    setIsListModalOpen,
    setSelectedAccount,
    transfer_accounts,
    transfer_hint,
    wallet_name,
}: TTransferAccountList) => {
    const is_single_list = React.useMemo(
        () =>
            Object.keys(transfer_accounts).filter(
                key => Object.keys(transfer_accounts[key as 'trading_accounts' | 'wallet_accounts']).length > 0
            ).length === 1,
        [transfer_accounts]
    );

    return (
        <div className='transfer-account-selector__list__container'>
            {Object.keys(transfer_accounts).map((key, idx) => {
                if (Object.values(transfer_accounts[key as 'trading_accounts' | 'wallet_accounts']).length === 0)
                    return null;

                return (
                    <React.Fragment key={key}>
                        <div
                            className={classNames('transfer-account-selector__list', {
                                'transfer-account-selector__list--is-last':
                                    is_single_list || Object.keys(transfer_accounts).length === idx + 1,
                                'transfer-account-selector__list--is-mobile': is_mobile,
                                'transfer-account-selector__list--is-single': is_single_list,
                            })}
                        >
                            <div className='transfer-account-selector__list-header'>
                                <Text as='div' size={is_mobile ? 'xxxs' : 'xs'} weight='bold'>
                                    {key === 'trading_accounts' ? (
                                        <Localize
                                            i18n_default_text='Trading accounts linked with {{wallet}}'
                                            values={{
                                                wallet: wallet_name,
                                            }}
                                        />
                                    ) : (
                                        <Localize i18n_default_text='Wallets' />
                                    )}
                                </Text>
                                <TitleLine />
                            </div>
                            <div className='transfer-account-selector__list-items'>
                                {Object.values(transfer_accounts[key as 'trading_accounts' | 'wallet_accounts']).map(
                                    account => (
                                        <WalletTransferTile
                                            key={account?.loginid}
                                            account={account}
                                            className={classNames('transfer-account-selector__list-tile')}
                                            is_active={selected_account?.loginid === account?.loginid}
                                            is_list_item
                                            is_mobile={is_mobile}
                                            has_hover
                                            onClick={() => {
                                                setSelectedAccount(account);
                                                if (account) onSelectAccount?.(account);
                                                setIsListModalOpen(false);
                                            }}
                                        />
                                    )
                                )}
                            </div>
                        </div>
                        {transfer_hint && (
                            <Text as='p' size='xxs' align='center' color='primary' className='transfer-hint'>
                                {transfer_hint}
                            </Text>
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};
export default React.memo(TransferAccountList);
