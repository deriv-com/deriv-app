import React from 'react';
import PropTypes from 'prop-types';
import { Button, Table, Text } from '@deriv/components';
import UserAvatar from 'Components/user/user-avatar';
import { localize } from 'Components/i18next';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';
import '../block-user.scss';

const BlockUserRow = ({ row: advertiser }) => {
    const { advertiser_page_store, my_profile_store } = useStores();

    const onClickUnblock = () => {
        advertiser_page_store.setIsBlockUserModalOpen(true);
        my_profile_store.setSelectedBlockedUser(advertiser);
    };

    return (
        <Table.Row className='block-user__row'>
            <Table.Cell>
                <div className='block-user__row-cell'>
                    <UserAvatar nickname={advertiser.name} size={32} text_size='s' />
                    <div className='block-user__row-cell--container'>
                        <Text size='xs' line_height='m' color='general'>
                            {advertiser.name}
                        </Text>
                    </div>
                </div>
            </Table.Cell>
            <Table.Cell className='block-user__row-button'>
                <Button secondary large onClick={onClickUnblock}>
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
