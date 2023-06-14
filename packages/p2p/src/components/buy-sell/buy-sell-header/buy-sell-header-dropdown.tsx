import React from 'react';
import { DesktopWrapper, Dropdown, Icon, MobileWrapper } from '@deriv/components';
import { observer } from '@deriv/stores';
import { localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { useStores } from 'Stores';

const BuySellHeaderDropdown = () => {
    const { buy_sell_store } = useStores();
    const { handleChange, selected_value, sort_list } = buy_sell_store;
    const { showModal } = useModalManagerContext();

    return (
        <React.Fragment>
            <DesktopWrapper>
                <Dropdown
                    className='buy-sell-header-dropdown'
                    classNameLabel='buy-sell-header-dropdown--label'
                    is_align_text_left
                    list={sort_list}
                    onChange={handleChange}
                    placeholder={localize('Sort by')}
                    value={selected_value}
                />
            </DesktopWrapper>
            <MobileWrapper>
                <div className='buy-sell-header-dropdown--sort' onClick={() => showModal({ key: 'SortModal' })}>
                    <Icon icon='IcCashierSort' size={16} />
                </div>
            </MobileWrapper>
        </React.Fragment>
    );
};

export default observer(BuySellHeaderDropdown);
