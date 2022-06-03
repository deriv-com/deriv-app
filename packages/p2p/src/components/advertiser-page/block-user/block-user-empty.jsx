import React from 'react';
import { DesktopWrapper, Icon, MobileFullPageModal, MobileWrapper, Text } from '@deriv/components';
import { my_profile_tabs } from 'Constants/my-profile-tabs';
import { Localize, localize } from 'Components/i18next';
import { useStores } from 'Stores';

const BlockUserEmpty = () => {
    const { my_profile_store } = useStores();
    return (
        <React.Fragment>
            <DesktopWrapper>
                <div className='payment-methods-empty'>
                    <Icon icon='IcEmptyBlockedAdvertisers' height={159} width={256} />
                    <Text className='payment-methods-empty--text' line_height='m' size='s' weight='bold'>
                        <Localize i18n_default_text='You have no blocked advertisers' />
                    </Text>
                </div>
            </DesktopWrapper>
            <MobileWrapper>
                <MobileFullPageModal
                    body_className='payment-methods-empty'
                    height_offset='80px'
                    is_modal_open={true}
                    page_header_text={localize('Blocked advertisers')}
                    pageHeaderReturnFn={() => my_profile_store.setActiveTab(my_profile_tabs.MY_STATS)}
                >
                    <Icon
                        icon='IcEmptyBlockedAdvertisers'
                        className='payment-methods-empty--icon'
                        height={159}
                        width={256}
                    />
                    <Text className='payment-methods-empty--text' line_height='m' size='s' weight='bold'>
                        <Localize i18n_default_text='You have no blocked advertisers' />
                    </Text>
                </MobileFullPageModal>
            </MobileWrapper>
        </React.Fragment>
    );
};

export default BlockUserEmpty;
