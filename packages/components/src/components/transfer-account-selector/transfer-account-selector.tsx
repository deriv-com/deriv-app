import React from 'react';
import Modal from '../modal';
import Div100vhContainer from '../div100vh-container';
import ThemedScrollbars from '../themed-scrollbars';
import TransferAccountList from './transfer-account-list';
import TransferTile from './transfer-tile';
import { WalletTile } from '../wallet-tile';
import './transfer-account-selector.scss';

export type TTransferAccount = React.ComponentProps<typeof WalletTile>['account'];

type TTransferAccountSelectorProps = {
    contentScrollHandler?: React.UIEventHandler<HTMLDivElement>;
    is_mobile?: boolean;
    is_wallet_name_visible?: boolean;
    label?: string;
    onSelectAccount?: (account: TTransferAccount) => void;
    placeholder?: string;
    portal_id?: string;
    setIsWalletNameVisible?: (value: boolean) => void;
    transfer_accounts: { [k: string]: TTransferAccount[] };
    transfer_hint?: string | JSX.Element;
    value?: TTransferAccount;
    wallet_name?: string;
};

const TransferAccountSelector = ({
    contentScrollHandler,
    is_mobile,
    is_wallet_name_visible,
    label,
    onSelectAccount,
    placeholder,
    portal_id,
    setIsWalletNameVisible,
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

    const getHeightOffset = React.useCallback(() => {
        const header_height = '16.2rem';
        const collapsed_header_height = '12.2rem';
        return is_wallet_name_visible ? header_height : collapsed_header_height;
    }, [is_wallet_name_visible]);

    return (
        <div
            className='transfer-account-selector'
            data-testid='dt_transfer_account_selector'
            onClick={is_list_modal_open ? undefined : openAccountsList}
        >
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
                onUnmount={() => setIsWalletNameVisible?.(true)}
                portalId={portal_id}
                transition_timeout={is_mobile ? { enter: 250, exit: 0 } : 250}
                title={label}
                toggleModal={() => setIsListModalOpen(old => !old)}
            >
                <ThemedScrollbars
                    is_scrollbar_hidden={is_mobile}
                    onScroll={is_mobile ? contentScrollHandler : undefined}
                >
                    <Div100vhContainer height_offset={getHeightOffset()} is_bypassed={!is_mobile}>
                        <TransferAccountList
                            is_mobile={is_mobile}
                            selected_account={selected_account}
                            setIsListModalOpen={setIsListModalOpen}
                            setSelectedAccount={setSelectedAccount}
                            transfer_accounts={transfer_accounts}
                            transfer_hint={transfer_hint}
                            wallet_name={wallet_name}
                        />
                    </Div100vhContainer>
                </ThemedScrollbars>
            </Modal>
        </div>
    );
};

export default TransferAccountSelector;
