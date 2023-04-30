import React from 'react';
import { Tabs, ThemedScrollbars } from '@deriv/components';
import { isDesktop } from '@deriv/shared';
import { getCashierOptions } from './provider';

type TCashierWalletModalBodyProps = {
    active_tab_index: number;
    is_dark: boolean;
    is_demo: boolean;
    setActiveTabIndex: (index: number) => void;
};

const CashierWalletModalBody = React.forwardRef<HTMLDivElement, TCashierWalletModalBodyProps>(
    ({ active_tab_index, is_dark, is_demo, setActiveTabIndex }, ref) => {
        const getDemoTabsColor = () => {
            if (is_demo) {
                return is_dark ? '#333333' : '#C2C2C2';
            }
            return '';
        };

        return (
            <Tabs
                active_icon_color={is_dark ? '#FFFFFF' : ''}
                active_index={active_tab_index}
                className='cashier-wallet-modal__tabs'
                has_active_line={false}
                has_bottom_line={false}
                header_fit_content
                icon_size={16}
                icon_color={getDemoTabsColor()}
                onTabItemClick={(index: number) => {
                    setActiveTabIndex(index);
                }}
            >
                {getCashierOptions(is_demo)
                    .map(option => {
                        return (
                            option.is_visible && (
                                <div key={option.label} icon={option.icon} label={option.label}>
                                    <ThemedScrollbars refSetter={ref} is_bypassed={isDesktop()} is_scrollbar_hidden>
                                        {option.content}
                                    </ThemedScrollbars>
                                </div>
                            )
                        );
                    })
                    .filter(Boolean)}
            </Tabs>
        );
    }
);

CashierWalletModalBody.displayName = 'CashierWalletModalBody';

export default CashierWalletModalBody;
