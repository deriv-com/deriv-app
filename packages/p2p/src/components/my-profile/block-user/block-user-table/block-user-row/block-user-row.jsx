/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';
import { Button, Table, Text } from '@deriv/components';
import UserAvatar from 'Components/user/user-avatar';
import { localize } from 'Components/i18next';

const BlockUserRow = ({ row: advertiser }) => {
    const { buy_sell_store, my_profile_store } = useStores();
    const { id, is_blocked, name } = advertiser;

    return (
        <Table.Row className='block-user-row'>
            <Table.Cell>
                <div
                    className='block-user-row__cell'
                    onClick={() => {
                        my_profile_store.getCounterpartyAdvertiserInfo(id);
                        buy_sell_store.setSelectedAdState({
                            advertiser_details: { id, name },
                        });
                    }}
                >
                    <UserAvatar nickname={name} size={32} text_size='s' />
                    <div className='block-user-row__cell-container'>
                        <Text size='xs' line_height='m' color='general'>
                            {name}
                        </Text>
                    </div>
                </div>
            </Table.Cell>
            <Table.Cell className='block-user-row__button-group'>
                {is_blocked ? (
                    <Button secondary medium onClick={() => my_profile_store.onClickUnblock(advertiser)}>
                        {localize('Unblock')}
                    </Button>
                ) : (
                    <Button alternate medium onClick={() => my_profile_store.onClickUnblock(advertiser)}>
                        {localize('Block')}
                    </Button>
                )}
            </Table.Cell>
        </Table.Row>
    );
};

BlockUserRow.propTypes = {
    advertiser: PropTypes.object,
};

export default observer(BlockUserRow);
