import React from 'react';
import { observer } from 'mobx-react-lite';
import { DesktopWrapper, Icon, MobileFullPageModal, MobileWrapper, Text } from '@deriv/components';
import { my_profile_tabs } from 'Constants/my-profile-tabs';
import { Localize, localize } from 'Components/i18next';
import { useStores } from 'Stores/index';

const BlockUserEmpty = () => {
    const { my_profile_store } = useStores();
    const is_modal_open = my_profile_store.active_tab === my_profile_tabs.MY_COUNTERPARTIES;

    const setActiveTab = (tab: string) => my_profile_store.setActiveTab(tab);

    return (
        <React.Fragment>
            <DesktopWrapper>
                <div className='block-user-empty' data-testid='dt_desktop_content'>
                    <Icon
                        className='block-user-empty__icon'
                        icon='IcEmptyBlockedAdvertisers'
                        height={128}
                        width={128}
                    />
                    <Text className='block-user-empty__text' weight='bold'>
                        <Localize i18n_default_text='No one to show here' />
                    </Text>
                </div>
            </DesktopWrapper>
            <MobileWrapper>
                <MobileFullPageModal
                    body_className='block-user-empty'
                    height_offset='80px'
                    is_modal_open={is_modal_open}
                    page_header_text={localize('My counterparties')}
                    pageHeaderReturnFn={setActiveTab(my_profile_tabs.MY_STATS)}
                    onClickClose={setActiveTab(my_profile_tabs.MY_STATS)}
                >
                    <Icon
                        icon='IcEmptyBlockedAdvertisers'
                        className='block-user-empty__icon'
                        height={128}
                        width={128}
                    />
                    <Text className='block-user-empty__text' weight='bold'>
                        <Localize i18n_default_text='No one to show here' />
                    </Text>
                </MobileFullPageModal>
            </MobileWrapper>
        </React.Fragment>
    );
};

export default observer(BlockUserEmpty);
