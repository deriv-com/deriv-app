import React from 'react';
import { DesktopWrapper, Icon, Loading, MobileFullPageModal, MobileWrapper, Text } from '@deriv/components';
import { my_profile_tabs } from 'Constants/my-profile-tabs';
import { Localize, localize } from 'Components/i18next';
import { useStores } from 'Stores';
import './block-user-empty.scss';

const BlockUserEmpty = () => {
    const { my_profile_store } = useStores();
    const [loaded, setLoaded] = React.useState(false);

    const iconRef = React.useCallback(node => {
        if (node) {
            setLoaded(true);
        }
    });

    return (
        <React.Fragment>
            <DesktopWrapper>
                <div className='block-user-empty'>
                    {!loaded && <Loading className='block-user-empty__loading' is_fullscreen={false} />}
                    <Icon
                        className='block-user-empty__icon'
                        ref={iconRef}
                        icon='IcEmptyBlockedAdvertisers'
                        height={128}
                        width={128}
                    />
                    <Text className='block-user-empty__text' line_height='m' size='s' weight='bold'>
                        <Localize i18n_default_text='You have no blocked advertisers' />
                    </Text>
                </div>
            </DesktopWrapper>
            <MobileWrapper>
                <MobileFullPageModal
                    body_className='block-user-empty'
                    height_offset='80px'
                    is_modal_open
                    page_header_text={localize('Blocked advertisers')}
                    pageHeaderReturnFn={() => my_profile_store.setActiveTab(my_profile_tabs.MY_STATS)}
                >
                    {!loaded && <Loading className='block-user-empty__loading' is_fullscreen={false} />}
                    <Icon
                        icon='IcEmptyBlockedAdvertisers'
                        ref={iconRef}
                        className='block-user-empty__icon'
                        height={128}
                        width={128}
                    />
                    <Text className='block-user-empty__text' line_height='m' size='s' weight='bold'>
                        <Localize i18n_default_text='You have no blocked advertisers' />
                    </Text>
                </MobileFullPageModal>
            </MobileWrapper>
        </React.Fragment>
    );
};

export default BlockUserEmpty;
