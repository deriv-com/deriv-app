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
    is_mobile?: boolean;
    is_wallet_name_visible?: boolean;
    label?: string;
    mobile_list_height?: string;
    onSelectAccount?: (account: TTransferAccount) => void;
    placeholder?: string;
    portal_id?: string;
    setIsScrollable?: (value: boolean) => void;
    setIsWalletNameVisible?: (value: boolean) => void;
    transfer_accounts: { [k: string]: TTransferAccount[] };
    transfer_hint?: string | JSX.Element;
    value?: TTransferAccount;
    wallet_name?: string;
};

const TransferAccountSelector = ({
    is_mobile,
    is_wallet_name_visible,
    label,
    mobile_list_height,
    onSelectAccount,
    placeholder,
    portal_id,
    setIsScrollable,
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

    // Disable parent scroll behaviour in order to use internal scrolling for accounts list in mobile view
    React.useEffect(() => {
        if (is_mobile && is_list_modal_open) {
            setIsScrollable?.(false);
        }
        return () => {
            setIsScrollable?.(true);
            setIsWalletNameVisible?.(true);
        };
    }, [is_mobile, is_list_modal_open, setIsScrollable, setIsWalletNameVisible]);

    const openAccountsList = () => {
        setIsListModalOpen(true);
    };

    const contentScrollHandler = React.useCallback(
        (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
            if (is_mobile && is_list_modal_open) {
                const target = e.target as HTMLDivElement;
                setIsWalletNameVisible?.(!(target.scrollTop > 0));
            }
        },
        [is_list_modal_open, is_mobile, setIsWalletNameVisible]
    );

    const getHeightOffset = React.useCallback(() => {
        const header_height = '16.2rem';
        const collapsed_header_height = '12.2rem';
        return is_wallet_name_visible ? header_height : collapsed_header_height;
    }, [is_wallet_name_visible]);

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
                height={is_mobile ? mobile_list_height : ''}
            >
                <ThemedScrollbars is_bypassed={is_mobile}>
                    <Div100vhContainer height_offset={getHeightOffset()} is_bypassed={!is_mobile}>
                        <TransferAccountList
                            contentScrollHandler={contentScrollHandler}
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
