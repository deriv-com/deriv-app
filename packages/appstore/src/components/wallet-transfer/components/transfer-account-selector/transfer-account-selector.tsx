import React, { useState, useMemo, useCallback } from 'react';
import { useFormikContext } from 'formik';
import { Div100vhContainer, Icon, Modal, Text, ThemedScrollbars } from '@deriv/components';
import { useTransferBetweenAccounts } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';
import TransferAccountList from './transfer-account-list';
import { WalletTransferTile } from '../wallet-transfer-tile';
import { WalletJurisdictionBadge } from 'Components/wallet-jurisdiction-badge';
import { getAccountName } from 'Constants/utils';
import type { TTransferAccount } from 'Types';
import type { TInitialValues } from '../../types';
import './transfer-account-selector.scss';

type TTransferAccountSelectorProps = {
    contentScrollHandler?: React.UIEventHandler<HTMLDivElement>;
    is_wallet_name_visible?: boolean;
    name: 'from_account' | 'to_account';
    setIsWalletNameVisible?: (value: boolean) => void;
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

const TransferAccountSelector = observer(
    ({ contentScrollHandler, is_wallet_name_visible, name, setIsWalletNameVisible }: TTransferAccountSelectorProps) => {
        const { ui } = useStore();
        const { is_mobile } = ui;
        const { values, setErrors, setFieldValue } = useFormikContext<TInitialValues>();
        const { from_account, to_account } = values;
        const { active_wallet, trading_accounts, wallet_accounts } = useTransferBetweenAccounts();
        const [is_list_modal_open, setIsListModalOpen] = useState(false);
        const active_wallet_name = getAccountName({ ...active_wallet });
        const label = name === 'from_account' ? localize('Transfer from') : localize('Transfer to');
        const placeholder =
            name === 'from_account' || !to_account ? localize('Select a trading account or a Wallet') : '';
        const portal_id = is_mobile ? 'mobile_list_modal_root' : 'modal_root';

        const to_account_list = useMemo(() => {
            if (!from_account?.loginid) return { trading_accounts: {}, wallet_accounts: {} };
            if (!active_wallet?.loginid) return { trading_accounts: {}, wallet_accounts: {} };

            if (from_account?.loginid === active_wallet?.loginid) {
                return {
                    trading_accounts,
                    wallet_accounts: Object.fromEntries(
                        Object.entries(wallet_accounts).filter(
                            ([key]) => active_wallet?.loginid && !key.includes(active_wallet?.loginid)
                        )
                    ),
                };
            }
            return { trading_accounts: {}, wallet_accounts: { [active_wallet?.loginid]: active_wallet } };
        }, [active_wallet, from_account?.loginid, trading_accounts, wallet_accounts]);

        const transfer_accounts = name === 'from_account' ? { trading_accounts, wallet_accounts } : to_account_list;

        const transfer_to_hint = React.useMemo(() => {
            return to_account?.loginid === active_wallet?.loginid ? (
                <Localize
                    i18n_default_text='You can only transfers funds from the {{account}} to the linked {{wallet}}.'
                    values={{
                        account: getAccountName({ ...from_account }),
                        wallet: active_wallet_name,
                    }}
                />
            ) : (
                ''
            );
        }, [active_wallet?.loginid, active_wallet_name, from_account, to_account?.loginid]);

        const getHeightOffset = React.useCallback(() => {
            const header_height = '16.2rem';
            const collapsed_header_height = '12.2rem';
            return is_wallet_name_visible ? header_height : collapsed_header_height;
        }, [is_wallet_name_visible]);

        const resetAmount = useCallback(() => {
            setFieldValue('from_amount', 0);
            setFieldValue('to_amount', 0);
        }, [setFieldValue]);

        const onSelectFromAccount = React.useCallback(
            (account: typeof from_account) => {
                if (account?.loginid === from_account?.loginid) return;
                setFieldValue('from_account', account);
                if (account?.loginid === active_wallet?.loginid) {
                    setFieldValue('to_account', undefined);
                } else {
                    setFieldValue('to_account', active_wallet);
                }
                resetAmount();
                setTimeout(() => setErrors({}));
            },
            [active_wallet, from_account?.loginid, resetAmount, setErrors, setFieldValue]
        );

        const onSelectToAccount = React.useCallback(
            (account: typeof to_account) => {
                if (account?.loginid === to_account?.loginid) return;
                setFieldValue('to_account', account);
                resetAmount();
                setTimeout(() => setErrors({}));
            },
            [resetAmount, setErrors, setFieldValue, to_account?.loginid]
        );

        const openAccountsList = () => {
            setIsListModalOpen(true);
        };

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
                    selected_account={name === 'from_account' ? from_account : to_account}
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
                                onSelectAccount={name === 'from_account' ? onSelectFromAccount : onSelectToAccount}
                                selected_account={name === 'from_account' ? from_account : to_account}
                                setIsListModalOpen={setIsListModalOpen}
                                transfer_accounts={transfer_accounts}
                                transfer_hint={name === 'from_account' ? undefined : transfer_to_hint}
                                wallet_name={active_wallet_name}
                            />
                        </Div100vhContainer>
                    </ThemedScrollbars>
                </Modal>
            </div>
        );
    }
);

export default TransferAccountSelector;
