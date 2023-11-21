import React from 'react';
import { Div100vhContainer, Icon, Modal, Text, ThemedScrollbars } from '@deriv/components';
import TransferAccountList from './transfer-account-list';
import WalletTransferTile from '../wallet-transfer-tile';
import { WalletJurisdictionBadge } from 'Components/wallet-jurisdiction-badge';
import type { TTransferAccount } from 'Types';
import './transfer-account-selector.scss';

type TTransferAccountSelectorProps = {
    contentScrollHandler?: React.UIEventHandler<HTMLDivElement>;
    is_mobile?: boolean;
    is_wallet_name_visible?: boolean;
    label?: string;
    onSelectAccount?: (account: TTransferAccount) => void;
    placeholder?: string;
    portal_id?: string;
    setIsWalletNameVisible?: (value: boolean) => void;
    transfer_accounts: Record<'trading_accounts' | 'wallet_accounts', Record<string, TTransferAccount>>;
    transfer_hint?: string | JSX.Element;
    value?: TTransferAccount;
    wallet_name?: string;
};

type TAccountSelectorTransferTileProps = {
    is_mobile?: boolean;
    label?: string;
    selected_account?: TTransferAccount;
    placeholder?: string;
};

const ChevronIcon = () => {
    return (
        <div className='transfer-account-selector__chevron-icon'>
            <Icon icon='IcChevronDown' data_testid='dt_chevron_icon' />
        </div>
    );
};

const AccountSelectorTransferTile = ({
    is_mobile,
    label,
    placeholder,
    selected_account,
}: TAccountSelectorTransferTileProps) => {
    return (
        <React.Fragment>
            <div className='transfer-account-selector__content'>
                <div className='transfer-account-selector__heading-with-chevron'>
                    <div className='transfer-account-selector__heading'>
                        <Text size={is_mobile ? 'xxs' : 'xs'}>{label}</Text>
                    </div>

                    {is_mobile && <ChevronIcon />}
                </div>

                {selected_account ? (
                    <WalletTransferTile
                        account={selected_account}
                        className='transfer-account-selector__value'
                        is_mobile={is_mobile}
                    />
                ) : (
                    <Text size={is_mobile ? 'xxs' : 'xs'} weight='bold'>
                        {placeholder}
                    </Text>
                )}
            </div>

            {!is_mobile && (
                <React.Fragment>
                    <WalletJurisdictionBadge
                        is_demo={Boolean(selected_account?.is_demo)}
                        shortcode={selected_account?.shortcode}
                    />
                    <ChevronIcon />
                </React.Fragment>
            )}
        </React.Fragment>
    );
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
    transfer_accounts = { trading_accounts: {}, wallet_accounts: {} },
    transfer_hint,
    value,
    wallet_name,
}: TTransferAccountSelectorProps) => {
    const [is_list_modal_open, setIsListModalOpen] = React.useState(false);
    const [selected_account, setSelectedAccount] = React.useState<TTransferAccount | undefined>(value);

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
            <AccountSelectorTransferTile
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
                            onSelectAccount={onSelectAccount}
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
