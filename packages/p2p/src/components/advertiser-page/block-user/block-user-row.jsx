import React from 'react';
import PropTypes from 'prop-types';
import { Button, Table, Text } from '@deriv/components';
import UserAvatar from 'Components/user/user-avatar';
import { localize } from 'Components/i18next';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';
import './block-user.scss';

const BlockUserRow = ({ row: advertiser }) => {
    const { my_profile_store, advertiser_page_store } = useStores();

    const onUnblock = () => {
        advertiser_page_store.setIsBlockUserModalOpen(true);
        advertiser_page_store.setSelectedBlockedUser(advertiser);
        my_profile_store.getBlockedAdvertisersList();
    };

    return (
        <Table.Row className='block-user__row'>
            <Table.Cell>
                <div className='block-user__row-cell'>
                    <UserAvatar nickname={'name'} size={32} text_size='s' />
                    <div className='block-user__row-cell--container'>
                        <Text size='xs' line_height='m' color='general'>
                            {advertiser.name}
                        </Text>
                    </div>
                </div>
            </Table.Cell>
            <Table.Cell className='block-user__row-button'>
                <Button secondary large onClick={onUnblock}>
                    {localize('Unblock')}
                </Button>
            </Table.Cell>
        </Table.Row>
    );
};

BlockUserRow.propTypes = {
    advertiser: PropTypes.object,
};

export default observer(BlockUserRow);
