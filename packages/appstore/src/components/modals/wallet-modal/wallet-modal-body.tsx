import React from 'react';
import classNames from 'classnames';
import { Tabs, ThemedScrollbars } from '@deriv/components';
import { getCashierOptions, TWalletType } from './provider';

type TWalletModalBodyProps = {
    active_tab_index: number;
    is_dark: boolean;
    is_demo: boolean;
    is_mobile: boolean;
    setActiveTabIndex: (index: number) => void;
    is_wallet_name_visible: boolean;
    wallet_type: TWalletType;
};

const WalletModalBody = ({
    active_tab_index,
    is_dark,
    is_demo,
    is_mobile,
    is_wallet_name_visible,
    setActiveTabIndex,
    wallet_type,
}: TWalletModalBodyProps) => {
    const content_height = 'calc(100vh - 24.4rem)';
    const max_content_width = '128rem';

    return (
        <Tabs
            active_icon_color={is_dark ? 'var(--badge-white)' : ''}
            active_index={active_tab_index}
            className={classNames('modal-body__tabs', {
                is_scrolled: !is_wallet_name_visible,
            })}
            has_active_line={false}
            has_bottom_line={false}
            header_fit_content
            icon_size={16}
            icon_color={is_demo ? 'var(--demo-text-color-1)' : ''}
            onTabItemClick={(index: number) => {
                setActiveTabIndex(index);
            }}
        >
            {getCashierOptions(wallet_type).map(option => {
                return (
                    <div key={option.label} icon={option.icon} label={option.label}>
                        <ThemedScrollbars
                            is_bypassed={is_mobile}
                            is_scrollbar_hidden
                            height={content_height}
                            style={{ maxWidth: max_content_width, width: '100%' }}
                        >
                            {option.content}
                        </ThemedScrollbars>
                    </div>
                );
            })}
        </Tabs>
    );
};

WalletModalBody.displayName = 'WalletModalBody';

export default WalletModalBody;
