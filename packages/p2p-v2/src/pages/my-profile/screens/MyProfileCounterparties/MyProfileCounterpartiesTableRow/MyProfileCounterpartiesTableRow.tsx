import React, { memo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { UserAvatar } from '@/components';
import { BlockUnblockUserModal } from '@/components/Modals';
import { ADVERTISER_URL } from '@/constants';
import { useDevice } from '@/hooks';
import { Button, Text } from '@deriv-com/ui';
import './MyProfileCounterpartiesTableRow.scss';

type TMyProfileCounterpartiesTableRowProps = {
    id: string;
    isBlocked: boolean;
    nickname: string;
};

const MyProfileCounterpartiesTableRow = ({ id, isBlocked, nickname }: TMyProfileCounterpartiesTableRowProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { isMobile } = useDevice();
    const history = useHistory();

    return (
        <>
            <div className='p2p-v2-my-profile-counterparties-table-row'>
                <div
                    className='p2p-v2-my-profile-counterparties-table-row__nickname-wrapper'
                    onClick={() => history.push(`${ADVERTISER_URL}/${id}`, { from: 'MyProfile' })}
                >
                    <UserAvatar className='h-[3rem] w-[3rem]' nickname={nickname} size={65} textSize='sm' />
                    <Text size={isMobile ? 'md' : 'sm'}>{nickname}</Text>
                </div>
                {/* TODO: variant to be replaced after available in @deriv-com/ui */}
                <Button
                    className='w-36 border-[1px]'
                    color={isBlocked ? 'black' : 'primary'}
                    onClick={() => setIsModalOpen(true)}
                    variant='outlined'
                >
                    {isBlocked ? 'Unblock' : 'Block'}
                </Button>
            </div>
            {/* TODO: to be replaced by deriv-com/ui modal component */}
            <BlockUnblockUserModal
                advertiserName={nickname}
                id={id}
                isBlocked={isBlocked}
                isModalOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
            />
        </>
    );
};

export default memo(MyProfileCounterpartiesTableRow);
