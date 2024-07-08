import React, { useState } from 'react';
import { api_base } from '@deriv/bot-skeleton';
import { Button, Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';
import { useDBotStore } from 'Stores/useDBotStore';
import Notifications from './notifications';
import ServerBotList from './server-bot-list';
import ServerQSForm from './server-qs-form';
import './server-bot.scss';

const ServerBot = observer(() => {
    const {
        server_bot: { getBotList, bot_list, createBot, notifications, setNotifications, setStatusBot },
    } = useDBotStore();

    const [add_btn_active, setAddBtnActive] = useState(false);
    const { client, ui } = useStore();
    const { is_mobile } = ui;
    const { is_virtual } = client;

    React.useEffect(() => {
        if (!bot_list[0]) {
            setTimeout(() => getBotList(), 2000);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [is_virtual]);

    const handleMessage = ({ data }) => {
        if (data?.msg_type === 'bot_notification' && !data?.error) {
            const contract_ids = [];
            const { msg: bot_notification_msg } = data.bot_notification;

            if (bot_notification_msg?.longcode) {
                setNotifications(
                    `${bot_notification_msg.longcode} barrier: ${bot_notification_msg.barrier} current_spot: ${bot_notification_msg.current_spot} payout: ${bot_notification_msg.payout} profit: ${bot_notification_msg.profit}`
                );
            }
            if (data.bot_notification.msg_type === 'buy') {
                setNotifications(
                    `msg_type: ${data.bot_notification.msg_type} action: ${bot_notification_msg.action} payout: ${bot_notification_msg.payout} price: ${bot_notification_msg.price}`
                );
                contract_ids.push(bot_notification_msg.contract_id);
                if (
                    contract_ids.includes(bot_notification_msg.contract_id) &&
                    bot_notification_msg.contract_id ===
                        contract_ids.some(el => el === bot_notification_msg.contract_id)
                ) {
                    setNotifications(`!!${bot_notification_msg[`${bot_notification_msg.contract_id}`].barrier}`);
                } else {
                    contract_ids.push(bot_notification_msg.contract_id);
                }
            }
            if (data.bot_notification.msg_type === 'sell') {
                setNotifications(
                    `msg_type: ${data.bot_notification.msg_type} action: ${bot_notification_msg.action} payout: ${bot_notification_msg.payout} price: ${bot_notification_msg.price} profit: ${bot_notification_msg.profit}`
                );
            }
            if (data.bot_notification.msg_type === 'stop') {
                setStatusBot('stopped', data.echo_req.bot_id);
                setNotifications(`msg_type: ${data.bot_notification.msg_type} reason: ${bot_notification_msg.reason}`);
            }
        }
    };

    React.useEffect(() => {
        api_base.api?.onMessage()?.subscribe(handleMessage);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [api_base?.api]);

    return (
        <>
            <div className='server-bot'>
                <div className='server-bot__list'>
                    <div className='server-bot__list__actions'>
                        <Text size={is_mobile ? 'xs' : 's'} weight='bold'>
                            <Localize i18n_default_text='Your bots:' />
                        </Text>
                        <Button onClick={() => setAddBtnActive(true)} green>
                            {localize('+ Create Bot')}
                        </Button>
                    </div>
                    <ServerBotList />
                </div>
                <div className='server-bot__item'>
                    {notifications.length !== 0 && <Notifications notifications={notifications} />}
                </div>
            </div>
            <ServerQSForm add_btn_active={add_btn_active} setAddBtnActive={setAddBtnActive} createBot={createBot} />
        </>
    );
});

export default ServerBot;
