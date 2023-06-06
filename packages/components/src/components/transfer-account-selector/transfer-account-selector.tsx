import React from 'react';
import Modal from '../modal';
import TransferAccountList from './transfer-account-list';
import TransferTile from './transfer-tile';
import { WalletTile } from '../wallet-tile';
import './transfer-account-selector.scss';

export type TTransferAccount = React.ComponentProps<typeof WalletTile>['account'];

type TTransferAccountSelectorProps = {
    is_mobile?: boolean;
    label?: string;
    mobile_list_min_height?: string;
    onSelectAccount?: (account: TTransferAccount) => void;
    placeholder?: string;
    portal_id?: string;
    transfer_accounts: { [k: string]: TTransferAccount[] };
    transfer_hint?: string | JSX.Element;
    value?: TTransferAccount;
    wallet_name?: string;
};

const TransferAccountSelector = ({
    is_mobile,
    label,
    mobile_list_min_height,
    onSelectAccount,
    placeholder,
    portal_id,
    transfer_accounts = {},
    transfer_hint,
    value,
    wallet_name,
}: TTransferAccountSelectorProps) => {
    const [is_list_modal_open, setIsListModalOpen] = React.useState(false);
    const [selected_account, setSelectedAccount] = React.useState<TTransferAccount | undefined>(value);

    React.useEffect(() => {
        if (selected_account) onSelectAccount?.(selected_account);
    }, [onSelectAccount, selected_account]);

    React.useEffect(() => {
        setSelectedAccount(value);
    }, [value]);

    const openAccountsList = () => {
        setIsListModalOpen(true);
    };

    return (
        <div className='transfer-account-selector' onClick={is_list_modal_open ? undefined : openAccountsList}>
            <TransferTile
                is_mobile={is_mobile}
                label={label}
                placeholder={placeholder}
                selected_account={selected_account}
            />

            <div id='mobile_list_modal_root' />

            <Modal
                className='transfer-account-selector__modal-header'
                has_close_icon
                is_open={is_list_modal_open}
                portalId={portal_id}
                title={label}
                toggleModal={() => setIsListModalOpen(old => !old)}
                min_height={is_mobile ? mobile_list_min_height : ''}
            >
                <TransferAccountList
                    is_mobile={is_mobile}
                    selected_account={selected_account}
                    setIsListModalOpen={setIsListModalOpen}
                    setSelectedAccount={setSelectedAccount}
                    transfer_accounts={transfer_accounts}
                    transfer_hint={transfer_hint}
                    wallet_name={wallet_name}
                />
            </Modal>
        </div>
    );
};

export default TransferAccountSelector;
