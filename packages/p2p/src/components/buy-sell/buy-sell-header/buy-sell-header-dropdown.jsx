import React from 'react';
import { DesktopWrapper, Dropdown, Icon, MobileWrapper } from '@deriv/components';
import { observer } from '@deriv/stores';
import { localize } from 'Components/i18next';
import { useStores } from 'Stores';

const BuySellHeaderDropdown = () => {
    const { buy_sell_store } = useStores();
    const { handleChange, selected_value, setIsSortDropdownOpen, sort_list } = buy_sell_store;

    return (
        <React.Fragment>
            <DesktopWrapper>
                <Dropdown
                    className='buy-sell__header-dropdown'
                    classNameLabel='buy-sell__header-dropdown--label'
                    is_align_text_left
                    list={sort_list}
                    onChange={handleChange}
                    placeholder={localize('Sort by')}
                    value={selected_value}
                />
            </DesktopWrapper>
            <MobileWrapper>
                <div className='buy-sell__header-dropdown--sort' onClick={() => setIsSortDropdownOpen(true)}>
                    <Icon icon='IcCashierSort' size={16} />
                </div>
            </MobileWrapper>
        </React.Fragment>
    );
};

export default observer(BuySellHeaderDropdown);
