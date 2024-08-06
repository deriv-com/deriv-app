import React, { useEffect, useState } from 'react';
import { Text } from '@deriv/components';
import { Notifications as Announcement } from '@deriv-com/ui';
import { useDBotStore } from 'Stores/useDBotStore';
import { observer } from '@deriv/stores';
import { StandaloneBullhornRegularIcon } from '@deriv/quill-icons';
import clsx from 'clsx';
import { localize } from '@deriv/translations';
import AnnouncementDialog from './announcement-dialog';
import { ANNOUNCEMENTS } from './config';
import './announcements.scss';
import { DBOT_TABS } from 'Constants/bot-contents';
import { IconAnnounce, MessageAnnounce, TitleAnnounce } from './announcement-components';

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

    const is_active_announce_1 = amount_announce?.announce_1;
    const is_active_announce_2 = amount_announce?.announce_2;
    const is_active_announce_3 = amount_announce?.announce_3;

    const announcements = [
        {
            icon: <IconAnnounce announce={is_active_announce_1} />,
            title: <TitleAnnounce title={localize('Moving Binary Bot strategies to Deriv Bot')} announce={is_active_announce_1} />,
            message: <MessageAnnounce
                        message={localize('Follow these steps for a smooth transition of your strategies.')}
                        date='6 Aug 2024 00:00 UTC'
                        announce={is_active_announce_1}
                    />,
            buttonAction: () => {
                setAmountAnnounce({ ...amount_announce, 'announce_1': false });
            },
            actionText: '',
        },
        {
            icon: <IconAnnounce announce={is_active_announce_2} />,
            title: <TitleAnnounce title={localize('Impact of Google Blockly V10 update')} announce={is_active_announce_2} />,
            message: <MessageAnnounce
                        message={localize('This update means variable names in XML files are no longer case-sensitive.')}
                        date='6 Aug 2024 00:00 UTC'
                        announce={is_active_announce_2}
                    />,
            buttonAction: () => {
                setAmountAnnounce({ ...amount_announce, 'announce_2': false });
            },
            actionText: '',
        },
        {
            icon: <IconAnnounce announce={is_active_announce_3} />,
            title: <TitleAnnounce title={localize('Accumulators is now on Deriv Bot')} announce={is_active_announce_3} />,
            message: <MessageAnnounce
                        message={localize('Boost your trading strategy with Accumulators.')}
                        date='20 July 2024 00:00 UTC'
                        announce={is_active_announce_3}
                    />,
            buttonAction: () => {
                setAnnounceDialogOpen(true);
                setIsOpenAnnounceList(!isOpenAnnounceList);
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
