import React from 'react';
import { Icon, MobileFullPageModal, Text } from '@deriv/components';
import { observer } from '@deriv/stores';
import { useDevice } from '@deriv-com/ui';
import { Localize, localize } from 'Components/i18next';
import { my_profile_tabs } from 'Constants/my-profile-tabs';
import { useStores } from 'Stores';

type TBlockUserTableErrorProps = {
    error_message: string;
};

const BlockUserTableError = ({ error_message }: TBlockUserTableErrorProps) => {
    const { isDesktop } = useDevice();
    const { my_profile_store } = useStores();

    const BlockUserTableErrorIcon = (
        <React.Fragment>
            <Icon icon='IcBlockedAdvertisersBarred' className='block-user-table-error__icon' height={128} width={128} />
            <Text align='center' className='block-user-table-error__text' weight='bold'>
                <Localize i18n_default_text={error_message} />
            </Text>
        </React.Fragment>
    );

    if (isDesktop) {
        return <div className='block-user-table-error'>{BlockUserTableErrorIcon}</div>;
    }

    return (
        <MobileFullPageModal
            body_className='block-user-table-error'
            height_offset='80px'
            is_modal_open
            page_header_text={localize('Blocked advertisers')}
            pageHeaderReturnFn={() => my_profile_store.setActiveTab(my_profile_tabs.MY_STATS)}
        >
            {BlockUserTableErrorIcon}
        </MobileFullPageModal>
    );
};

export default observer(BlockUserTableError);
