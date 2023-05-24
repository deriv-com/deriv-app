/* eslint-disable react/prop-types */
import React from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';
import classNames from 'classnames';
import { Button, Table, Text } from '@deriv/components';
import { localize } from 'Components/i18next';
import UserAvatar from 'Components/user/user-avatar';
import { routes } from '@deriv/shared';

const BlockUserRow = ({ row: advertiser }) => {
    const { buy_sell_store, general_store, my_profile_store } = useStores();
    const { id, is_blocked, name } = advertiser;
    const history = useHistory();

    return (
        <Table.Row className='block-user-row'>
            <Table.Cell>
                <div
                    className={classNames('block-user-row__cell', {
                        'block-user-row__cell--barred': general_store.is_barred,
                    })}
                    onClick={() => {
                        if (!general_store.is_barred) {
                            my_profile_store.getCounterpartyAdvertiserInfo(id);
                            buy_sell_store.setSelectedAdState({
                                advertiser_details: { id, name },
                            });
                            history.push({
                                pathname: routes.p2p_advertiser_page,
                                search: `?id=${id}`,
                            });
                        }
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
                    <Button
                        className='block-user-row__button-group__unblock-button'
                        secondary
                        medium
                        onClick={() => my_profile_store.onClickUnblock(advertiser)}
                    >
                        {localize('Unblock')}
                    </Button>
                ) : (
                    <Button
                        className='block-user-row__button-group__block-button'
                        alternate
                        medium
                        onClick={() => my_profile_store.onClickUnblock(advertiser)}
                    >
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
