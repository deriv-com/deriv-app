import React from 'react';
import classNames from 'classnames';
import Text from '../text';
import { Localize, localize } from '@deriv/translations';
import { WalletTile } from '../wallet-tile';
import type { TTransferAccount } from './transfer-account-selector';

type TTransferAccountList = {
    is_mobile?: boolean;
    selected_account?: TTransferAccount;
    setIsListModalOpen: (value: boolean) => void;
    setSelectedAccount: React.Dispatch<React.SetStateAction<TTransferAccount | undefined>>;
    transfer_accounts: { [k: string]: TTransferAccount[] };
    transfer_hint?: string | JSX.Element;
    wallet_name?: string;
};

const TitleLine = () => <div className='transfer-account-selector__list-header__title-line' />;

const TransferAccountList = ({
    is_mobile,
    selected_account,
    setIsListModalOpen,
    setSelectedAccount,
    transfer_accounts,
    transfer_hint,
    wallet_name,
}: TTransferAccountList) => {
    const is_single_list = React.useMemo(
        () => Object.keys(transfer_accounts).filter(key => transfer_accounts[key].length > 0).length === 1,
        [transfer_accounts]
    );

    return (
        <div className='transfer-account-selector__list__container'>
            {Object.keys(transfer_accounts).map((key, idx) => {
                if (transfer_accounts[key].length === 0) return null;

                return (
                    <React.Fragment key={idx}>
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
                                <TitleLine />
                            </div>
                            <div className='transfer-account-selector__list-items'>
                                {transfer_accounts[key].map((account, index) => (
                                    <WalletTile
                                        key={index}
                                        account={account}
                                        className={classNames('transfer-account-selector__list-tile')}
                                        is_active={selected_account?.loginid === account.loginid}
                                        is_mobile={is_mobile}
                                        has_hover
                                        onClick={() => {
                                            setSelectedAccount(account);
                                            setIsListModalOpen(false);
                                        }}
                                    />
                                ))}
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
