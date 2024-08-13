import React, { useEffect, useState } from 'react';
import { Text } from '@deriv/components';
import { Notifications as Announcement } from '@deriv-com/ui';
import { StandaloneBullhornRegularIcon } from '@deriv/quill-icons';
import clsx from 'clsx';
import { localize } from '@deriv/translations';
import AnnouncementDialog from './announcement-dialog';
import { ANNOUNCEMENTS, TAnnouncement } from './config';
import './announcements.scss';
import { IconAnnounce, MessageAnnounce, TitleAnnounce } from './announcement-components';

type TAnnouncements = {
    is_mobile?: boolean;
    handleTabChange: (item: number) => void;
};

const Announcements = ({ is_mobile, handleTabChange }: TAnnouncements) => {
    const [is_announce_dialog_open, setIsAnnounceDialogOpen] = useState(false);
    const [is_open_announce_list, setIsOpenAnnounceList] = React.useState(false);
    const [selected_announcement, setSelectedAnnouncement] = React.useState<TAnnouncement | null>(null);
    const [amount_announce, setAmountAnnounce] = useState({} as Record<string, boolean>);
    const is_active_announce_1 = amount_announce?.announce_1;

    const handleAnnounceSubmit = (data: Record<string, boolean>) => {
        setAmountAnnounce(data);
        localStorage?.setItem('bot-announcements', JSON.stringify(data));
    };

    const announcements = [
        {
            id: 0,
            icon: <IconAnnounce announce={is_active_announce_1} />,
            title: (
                <TitleAnnounce title={localize('Accumulators is now on Deriv Bot')} announce={is_active_announce_1} />
            ),
            message: (
                <MessageAnnounce
                    message={localize('Boost your trading strategy with Accumulators.')}
                    date='20 July 2024 00:00 UTC'
                    announce={is_active_announce_1}
                />
            ),
            buttonAction: () => {
                setSelectedAnnouncement(ANNOUNCEMENTS.ACCUMULATOR_ANNOUNCE);
                setIsAnnounceDialogOpen(true);
                setIsOpenAnnounceList(prev => !prev);
                handleAnnounceSubmit({ ...amount_announce, announce_1: false });
            },
            actionText: '',
        },
    ];

    useEffect(() => {
        let data: Record<string, boolean> | null = null;
        data = JSON.parse(localStorage.getItem('bot-announcements') ?? '{}');

        if (data && Object.keys(data).length !== 0) {
            setAmountAnnounce(data);
        } else {
            const obj_announcements = Object.fromEntries(Object.keys(amount_announce).map(key => [key, false]));
            setAmountAnnounce(obj_announcements);
            localStorage?.setItem('bot-announcements', JSON.stringify(obj_announcements));
        }
    }, []);

    const countActiveAnnouncements = (): number => {
        return Object.values(amount_announce as Record<string, boolean>).reduce((count: number, value: boolean) => {
            return value === true ? count + 1 : count;
        }, 0);
    };

    const number_ammount_announce = countActiveAnnouncements();

    return (
        <div className='announcements'>
            <button
                className='announcements__button'
                onClick={() => setIsOpenAnnounceList(prevState => !prevState)}
                data-testid='btn-announcements'
            >
                <StandaloneBullhornRegularIcon fill='var(--icon-black-plus)' iconSize='sm' />
                {!is_mobile && (
                    <Text size='xs' line_height='s' className='announcements__label'>
                        {localize('Announcements')}
                    </Text>
                )}
                {number_ammount_announce !== 0 && (
                    <div className='announcements__amount' data-testid='announcements__amount'>
                        <p>{number_ammount_announce}</p>
                    </div>
                )}
            </button>
            <div className='notifications__wrapper'>
                <Announcement
                    className={clsx('', {
                        'notifications__wrapper--mobile': is_mobile,
                        'notifications__wrapper--desktop': !is_mobile,
                    })}
                    clearNotificationsCallback={() => {
                        const announce_obj = Object.fromEntries(Object.keys(amount_announce).map(key => [key, false]));
                        setAmountAnnounce(announce_obj);
                    }}
                    componentConfig={{
                        clearButtonText: localize('Mark all as read'),
                        modalTitle: localize('Announcements'),
                        noNotificationsMessage: localize('No announcements MESSAGE'),
                        noNotificationsTitle: localize('No announcements'),
                    }}
                    isOpen={is_open_announce_list}
                    notifications={announcements}
                />
            </div>
            {selected_announcement?.announcement && (
                <AnnouncementDialog
                    announcement={selected_announcement.announcement}
                    is_announce_dialog_open={is_announce_dialog_open}
                    setIsAnnounceDialogOpen={setIsAnnounceDialogOpen}
                    handleOnCancel={() => {
                        if (selected_announcement?.switch_tab_on_cancel) {
                            handleTabChange(selected_announcement.switch_tab_on_cancel);
                        }
                        selected_announcement.onCancel?.();
                    }}
                    handleOnConfirm={() => {
                        if (selected_announcement?.switch_tab_on_confirm) {
                            handleTabChange(selected_announcement.switch_tab_on_confirm);
                        }
                        selected_announcement.onConfirm?.();
                    }}
                />
            )}
        </div>
    );
};

export default Announcements;
