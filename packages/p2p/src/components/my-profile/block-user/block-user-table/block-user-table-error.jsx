import React from 'react';
import { observer } from 'mobx-react-lite';
import PropTypes from 'prop-types';
import { DesktopWrapper, Icon, MobileFullPageModal, MobileWrapper, Text } from '@deriv/components';
import { my_profile_tabs } from 'Constants/my-profile-tabs';
import { Localize, localize } from 'Components/i18next';
import { useStores } from 'Stores';

const BlockUserTableError = ({ error_message }) => {
    const { my_profile_store } = useStores();

    return (
        <React.Fragment>
            <DesktopWrapper>
                <div className='block-user__table--error'>
                    <Icon
                        className='block-user__table--error-icon'
                        icon='IcBlockedAdvertisersBarred'
                        height={128}
                        width={128}
                    />
                    <Text
                        align='center'
                        className='block-user__table--error-text'
                        line_height='m'
                        size='s'
                        weight='bold'
                    >
                        <Localize i18n_default_text={error_message} />
                    </Text>
                </div>
            </DesktopWrapper>
            <MobileWrapper>
                <MobileFullPageModal
                    body_className='block-user__table--error'
                    height_offset='80px'
                    is_modal_open
                    page_header_text={localize('Blocked advertisers')}
                    pageHeaderReturnFn={() => my_profile_store.setActiveTab(my_profile_tabs.MY_STATS)}
                >
                    <Icon
                        icon='IcBlockedAdvertisersBarred'
                        className='block-user__table--error-icon'
                        height={128}
                        width={128}
                    />
                    <Text
                        align='center'
                        className='block-user__table--error-text'
                        line_height='m'
                        size='s'
                        weight='bold'
                    >
                        <Localize i18n_default_text={error_message} />
                    </Text>
                </MobileFullPageModal>
            </MobileWrapper>
        </React.Fragment>
    );
};

BlockUserTableError.propTypes = {
    error_message: PropTypes.string,
};

export default observer(BlockUserTableError);
