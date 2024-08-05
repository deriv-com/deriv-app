import React, { useEffect, useState } from 'react';
import { Text } from '@deriv/components';
import { Notifications as Announcement } from '@deriv-com/ui';
import { useDBotStore } from 'Stores/useDBotStore';
import { observer } from '@deriv/stores';
import { LabelPairedCircleInfoCaptionBoldIcon } from '@deriv/quill-icons';
import clsx from 'clsx';
import { localize } from '@deriv/translations';
import AnnouncementDialog from './announcement-dialog';
import { StandaloneBullhornRegularIcon } from '@deriv/quill-icons';
import { ANNOUNCEMENTS } from './config';
import './announcements.scss';
import { DBOT_TABS } from 'Constants/bot-contents';

type TAnnouncements = {
    is_mobile?: boolean;
    handleTabChange: (item: number) => void;
};

const Announcements = observer(({ is_mobile, handleTabChange }: TAnnouncements) => {
    const { quick_strategy } = useDBotStore();
    const { onSubmit } = quick_strategy;
    const [isAnnounceDialogOpen, setAnnounceDialogOpen] = useState(false);
    const [isOpenAnnounceList, setIsOpenAnnounceList] = useState(false);
    const [amount_announce, setAmountAnnounce] = useState({});
    const accumulator_announcement = ANNOUNCEMENTS['ACCUMULATOR_ANNOUNCE'];

    const announcements = [
        {
            icon: (
                <>
                    <LabelPairedCircleInfoCaptionBoldIcon fill='#0777C4' width='24' height='26' />
                    {amount_announce?.announce_1 === true && <div className='notification__icon--indicator'></div>}
                </>
            ),
            title: (<Text size='xs' line_height='l' weight={amount_announce?.announce_1 ? 'bold' : 'normal'} styles={!amount_announce?.announce_1 ? {
                color: '#000000B8'
            } : {}}>
                {localize('Accumulators is now on Deriv Bot')}
            </Text>),
            message: (
                <>
                    <Text size='xs' line_height='l' weight={amount_announce?.announce_1 ? 'normal' : 'lighter'} styles={!amount_announce?.announce_1 ? {
                        color: '#000000B8'
                    } : {}}>
                        {localize('Boost your trading strategy with Accumulators.')}
                    </Text>
                    <Text size='xxs' styles={{ color: '#0000007A' }}>
                        20 July 2024 00:00 UTC
                    </Text>
                </>
            ),
            buttonAction: () => {
                setAnnounceDialogOpen(true);
                setIsOpenAnnounceList(!isOpenAnnounceList);
                setAmountAnnounce({ ...amount_announce, 'announce_1': false });
            },
            actionText: '',
        },
        {
            icon: (<><LabelPairedCircleInfoCaptionBoldIcon fill='#0777C4' width='24' height='26' />
                {amount_announce?.announce_2 === true && <div className='notification__icon--indicator'></div>}</>),
            title: 'title2',
            message: 'message2',
            buttonAction: () => {
                setAmountAnnounce({ ...amount_announce, 'announce_2': false });
            },
            actionText: '',
        },
        {
            icon: (<><LabelPairedCircleInfoCaptionBoldIcon fill='#0777C4' width='24' height='26' />
                {amount_announce?.announce_3 === true && <div className='notification__icon--indicator'></div>}</>),
            title: 'title3',
            message: 'message3',
            buttonAction: () => {
                setAmountAnnounce({ ...amount_announce, 'announce_3': false });
            },
            actionText: '',
        },
    ];

    useEffect(() => {
        const obj_announcements = Object.fromEntries(
            Array.from({ length: announcements.length }, (_, i) => [`announce_${i + 1}`, true])
        );
        setAmountAnnounce(obj_announcements);
    }, [])

    const handleOnCancelAccumulator = () => {
        handleTabChange(DBOT_TABS.TUTORIAL);
    };

    const handleOnConfirmAccumulator = () => {
        handleTabChange(DBOT_TABS.BOT_BUILDER);
        onSubmit({ 'tradetype': 'accumulator' })
    };

    const countActiveAnnouncements = (): number => {
        return Object.values(amount_announce as Record<string, boolean>).reduce((count: number, value: boolean) => {
            return value === true ? count + 1 : count;
        }, 0);
    }

    const number_ammount_announce = countActiveAnnouncements();

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
                {number_ammount_announce !== 0 && <div className='announcements__amount'>
                    <p>{number_ammount_announce}</p>
                </div>}
            </button>
            <div className='notifications__wrapper'>
                <Announcement
                    className={clsx('', {
                        'notifications__wrapper--mobile': is_mobile,
                        'notifications__wrapper--desktop': !is_mobile,
                    })}
                    clearNotificationsCallback={() => {
                        Object.entries(amount_announce).forEach(([key]) => {
                            (amount_announce as { [key: string]: boolean })[key] = false;
                        });
                    }}
                    componentConfig={{
                        clearButtonText: localize('Mark all as read'),
                        modalTitle: localize('Announcement'),
                        noNotificationsMessage: localize('No announcements MESSAGE'),
                        noNotificationsTitle: localize('No announcements'),
                    }}
                    isOpen={isOpenAnnounceList}
                    notifications={announcements}
                    setIsOpen={setIsOpenAnnounceList}
                />
            </div>
            <AnnouncementDialog
                announcement={accumulator_announcement}
                isAnnounceDialogOpen={isAnnounceDialogOpen}
                setAnnounceDialogOpen={setAnnounceDialogOpen}
                handleOnCancel={handleOnCancelAccumulator}
                handleOnConfirm={handleOnConfirmAccumulator}
            />
        </div>
    );
});

export default Announcements;
