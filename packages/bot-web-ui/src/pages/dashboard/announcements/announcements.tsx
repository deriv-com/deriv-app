import React, { useState } from 'react';
import { Text } from '@deriv/components';
import { Notifications as Announcement } from '@deriv-com/ui';
import { LabelPairedCircleInfoCaptionBoldIcon } from '@deriv/quill-icons';
import clsx from 'clsx';
import { localize } from '@deriv/translations';
import AnnouncementDialog from './announcement-dialog';
import { StandaloneBullhornRegularIcon } from '@deriv/quill-icons';
import './announcements.scss';

type TAnnouncements = {
    is_mobile?: boolean;
    handleTabChange: (item: number) => void;
};

const Announcements = ({ is_mobile, handleTabChange }: TAnnouncements) => {
    const [isAnnounceDialogOpen, setAnnounceDialogOpen] = useState(false);
    const [isOpenAnnounceList, setIsOpenAnnounceList] = useState(false);

    const announcements = [
        {
            icon: (
                <>
                    <LabelPairedCircleInfoCaptionBoldIcon fill='#0777C4' width='24' height='26' />
                    {true && <div className='notification__icon--indicator'></div>}
                </>
            ),
            title: 'Accumulators is now on Deriv Bot',
            message: (
                <>
                    <Text size='xs' line_height='l'>
                        Boost your trading strategy with Accumulators.
                    </Text>
                    <Text size='xxs' styles={{ color: '#0000007A' }}>
                        20 July 2024 00:00 UTC
                    </Text>
                </>
            ),
            buttonAction: () => {
                console.log('action1');
                setAnnounceDialogOpen(true);
                setIsOpenAnnounceList(!isOpenAnnounceList);
            },
            actionText: '',
        },
        {
            icon: <LabelPairedCircleInfoCaptionBoldIcon fill='#0777C4' width='24' height='26' />,
            title: 'title2',
            message: 'message2',
            buttonAction: () => console.log('action2'),
            actionText: '',
        },
        {
            icon: <LabelPairedCircleInfoCaptionBoldIcon fill='#0777C4' width='24' height='26' />,
            title: 'title3',
            message: 'message3',
            buttonAction: () => console.log('action3'),
            actionText: '',
        },
    ];

    return (
        <div className='announcements'>
            <button
                className='announcements__button'
                onClick={() => setIsOpenAnnounceList(!isOpenAnnounceList)}
                data-testid='btn-announcements'
            >
                <StandaloneBullhornRegularIcon fill='#000000' iconSize='sm' />
                {!is_mobile && (
                    <Text size='xs' line_height='s' className='announcements__label'>
                        {localize('Announcements')}
                    </Text>
                )}
                <div className='announcements__amount'>
                    <p>{announcements.length}</p>
                </div>
            </button>
            <div className='notifications__wrapper'>
                <Announcement
                    className={clsx('', {
                        'notifications__wrapper--mobile': is_mobile,
                        'notifications__wrapper--desktop': !is_mobile,
                    })}
                    clearNotificationsCallback={() => {}}
                    componentConfig={{
                        clearButtonText: localize('Mark all as read'),
                        modalTitle: localize('Announcements'),
                        noNotificationsMessage: localize('No announcements MESSAGE'),
                        noNotificationsTitle: localize('No announcements'),
                    }}
                    isOpen={isOpenAnnounceList}
                    notifications={announcements}
                    setIsOpen={setIsOpenAnnounceList}
                />
            </div>
            <AnnouncementDialog
                handleTabChange={handleTabChange}
                isAnnounceDialogOpen={isAnnounceDialogOpen}
                setAnnounceDialogOpen={setAnnounceDialogOpen}
            />
        </div>
    );
};

export default Announcements;
