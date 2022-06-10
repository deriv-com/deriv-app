import React from 'react';
import { Dropdown, Icon } from '@deriv/components';
import { localize } from 'Components/i18next';
import { useStores } from 'Stores';
import './advertiser-page.scss';
import { observer } from 'mobx-react-lite';

const AdvertiserPageDropdownMenu = () => {
    const { advertiser_page_store } = useStores();

    const { is_blocked } = advertiser_page_store.advertiser_info;

    const viewBlockUserModal = () => {
        if (!is_blocked) {
            advertiser_page_store.setIsBlockUserModalOpen(true);
        }
    };

    return (
        <div className='advertiser-page__menu-dots-toggle'>
            <Icon
                className='advertiser-page__menu-dots-icon'
                icon='IcMenuDots'
                onClick={() => advertiser_page_store.setIsDropdownVisible(!advertiser_page_store.is_dropdown_visible)}
                size={16}
            />
            {advertiser_page_store.is_dropdown_visible && (
                <div
                    className={`advertiser-page__dropdown${is_blocked ? '--disabled' : ''}`}
                    onClick={viewBlockUserModal}
                >
                    <Dropdown
                        className='advertiser-page__dropdown-container'
                        is_align_text_right
                        list={['Block']}
                        name={'block_user_dropdown'}
                        placeholder={localize('Block')}
                    />
                </div>
            )}
        </div>
    );
};

export default observer(AdvertiserPageDropdownMenu);
