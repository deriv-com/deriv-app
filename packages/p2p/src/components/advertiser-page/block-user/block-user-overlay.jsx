import React from 'react';
import { Button, Icon, Text } from '@deriv/components';
import { localize, Localize } from 'Components/i18next';
import { useStores } from 'Stores';
import { observer } from 'mobx-react-lite';
import './block-user-overlay.scss';

const BlockUserOverlay = () => {
    const { advertiser_page_store } = useStores();

    return (
        <div className='block-user-overlay'>
            <Icon icon='IcBlockedUser' height={159} width={256} />
            <Text className='block-user-overlay__text' line_height='m' size='s' weight='bold'>
                <Localize
                    i18n_default_text='You have blocked {{advertiser_name}}.'
                    values={{ advertiser_name: advertiser_page_store.advertiser_details_name }}
                />
            </Text>
            {/* TODO: Show Unblock confirmation modal when user clicks on this button */}
            <Button className='block-user-overlay__button' secondary onClick={() => true} large>
                {localize('Unblock')}
            </Button>
        </div>
    );
};

export default observer(BlockUserOverlay);
