import React from 'react';
import classNames from 'classnames';
import { Tabs, ThemedScrollbars, Div100vhContainer } from '@deriv/components';
import { getCashierOptions } from './provider';
import { observer, useStore } from '@deriv/stores';
import type { TWalletAccount } from 'Types';

type TWalletModalBodyProps = {
    contentScrollHandler: React.UIEventHandler<HTMLDivElement>;
    is_dark: boolean;
    is_mobile: boolean;
    setIsWalletNameVisible: (value: boolean) => void;
    is_wallet_name_visible: boolean;
    wallet: TWalletAccount;
};

const real_tabs = {
    Deposit: 0,
    Withdraw: 1,
    Transfer: 2,
    Transactions: 3,
} as const;

const demo_tabs = {
    Deposit: 2,
    Transfer: 0,
    Transactions: 1,
    Withdraw: undefined,
} as const;

const WalletModalBody = observer(
    ({
        contentScrollHandler,
        is_dark,
        is_mobile,
        setIsWalletNameVisible,
        is_wallet_name_visible,
        wallet,
    }: TWalletModalBodyProps) => {
        const store = useStore();

        const { is_demo } = wallet;

        const {
            traders_hub: { active_modal_tab, setWalletModalActiveTab },
        } = store;

        const getHeightOffset = React.useCallback(() => {
            const desktop_header_height = '24.4rem';
            const mobile_header_height = '8.2rem';

            return is_mobile ? mobile_header_height : desktop_header_height;
        }, [is_mobile]);

        const tabs = is_demo ? demo_tabs : real_tabs;

        return (
            <Tabs
                active_icon_color={is_dark ? 'var(--badge-white)' : ''}
                active_index={tabs[active_modal_tab || 'Deposit']}
                className={classNames('modal-body__tabs', {
                    is_scrolled: is_mobile && !is_wallet_name_visible,
                })}
                has_active_line={false}
                has_bottom_line={false}
                header_fit_content
                icon_size={16}
                icon_color={is_demo ? 'var(--demo-text-color-1)' : ''}
                is_scrollable={false}
                onTabItemClick={(index: number) => {
                    // @ts-expect-error the key always exist in the tabs object, So we can ignore the TS error.
                    const tab_name = Object.keys(tabs).find(key => tabs[key] === index) as typeof active_modal_tab;
                    setWalletModalActiveTab(tab_name);
                }}
                should_scroll_tab_into_view
            >
                {getCashierOptions(is_demo ? 'demo' : 'real').map(option => {
                    return (
                        <div key={option.label} icon={option.icon} label={option.label}>
                            <ThemedScrollbars
                                className='dc-tabs--modal-body__tabs__themed-scrollbar'
                                is_scrollbar_hidden={is_mobile}
                                onScroll={contentScrollHandler}
                            >
                                <Div100vhContainer height_offset={getHeightOffset()}>
                                    <div className='dc-tabs--modal-body__tabs__content-wrapper'>
                                        {option.content({
                                            is_wallet_name_visible,
                                            contentScrollHandler,
                                            setIsWalletNameVisible,
                                        })}
                                    </div>
                                </Div100vhContainer>
                            </ThemedScrollbars>
                        </div>
                    );
                })}
            </Tabs>
        );
    }
);

export default WalletModalBody;
