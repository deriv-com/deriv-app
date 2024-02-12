import React, { useState } from 'react';
import { Button } from '@deriv/components';
import { localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';
import { useDBotStore } from 'Stores/useDBotStore';
import './server-bot.scss';
import ServerBotList from './server-bot-list';
import ServerQSForm from './server-qs-form';
import Chart from '../chart';
import Notifications from './notifications';
import { api_base } from '@deriv/bot-skeleton';

const ServerBot = observer(() => {
    const DBotStores = useDBotStore();
    const {
        server_bot: { getBotList, bot_list, createBot, notifications, setNotifications },
    } = DBotStores;

    const [add_btn_active, setAddBtnActive] = useState(false);
    const { client } = useStore();
    const { is_virtual } = client;

    React.useEffect(() => {
        setTimeout(() => getBotList(), 2000)
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [is_virtual]);

    React.useEffect(() => {
        if (!bot_list[0]) {
            getBotList();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleMessage = ({ data }) => {
        if (data?.msg_type === 'bot_notification' && !data?.error) {

            let contract_ids = [];

            if (data.bot_notification.msg?.longcode) {
                setNotifications(`${data.bot_notification.msg.longcode} barrier: ${data.bot_notification.msg.barrier} current_spot: ${data.bot_notification.msg.current_spot} payout: ${data.bot_notification.msg.payout} profit: ${data.bot_notification.msg.profit}`);
            }
            if (data.bot_notification.msg_type === 'buy') {
                setNotifications(`msg_type: ${data.bot_notification.msg_type} action: ${data.bot_notification.msg.action} payout: ${data.bot_notification.msg.payout} price: ${data.bot_notification.msg.price}`);
                contract_ids.push(data.bot_notification.msg.contract_id)
                if (contract_ids.includes(data.bot_notification.msg.contract_id) &&
                data.bot_notification.msg.contract_id === contract_ids.some((el) => el === data.bot_notification.msg.contract_id)) {
                    setNotifications('!!' + data.bot_notification.msg[`${data.bot_notification.msg.contract_id}`].barrier)
                } else {
                    contract_ids.push(data.bot_notification.msg.contract_id)
                }
            }
            if (data.bot_notification.msg_type === 'sell') {
                setNotifications(`msg_type: ${data.bot_notification.msg_type} action: ${data.bot_notification.msg.action} payout: ${data.bot_notification.msg.payout} price: ${data.bot_notification.msg.price} profit: ${data.bot_notification.msg.profit}`);
            }
            if (data.bot_notification.msg_type === 'stop') {
                setNotifications(`msg_type: ${data.bot_notification.msg_type} reason: ${data.bot_notification.msg.reason}`);
            }

        }
    };

    React.useEffect(() => {
        api_base.api?.onMessage()?.subscribe(handleMessage);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [api_base?.api]);

    return (
        <div className='server-bot'>
            <Button onClick={() => setAddBtnActive(true)} green>
                {localize('+ add bot')}
            </Button>
            <div>
                <div className='server-bot-list'>
                    <ServerBotList />
                </div>
                <div>
                    <div className='chart-modal-dialog' data-testid='chart-modal-dialog'>
                        <Chart show_digits_stats={false} />
                    </div>
                </div>
            </div>
            {notifications.length !== 0 && <Notifications notifications={notifications} />}
            <ServerQSForm add_btn_active={add_btn_active} setAddBtnActive={setAddBtnActive} createBot={createBot} />
        </div>
    );
});

export default ServerBot;
