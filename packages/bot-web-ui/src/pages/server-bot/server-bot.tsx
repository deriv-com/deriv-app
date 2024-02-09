import React, { useState } from 'react';
import { Button } from '@deriv/components';
import { localize } from '@deriv/translations';
import { observer } from '@deriv/stores';
import { useDBotStore } from 'Stores/useDBotStore';
import './server-bot.scss';
import ServerBotList from './server-bot-list';
import ServerQSForm from './server-qs-form';
import Chart from '../chart';

const ServerBot = observer(() => {
    const DBotStores = useDBotStore();
    const {
        server_bot: { getBotList, bot_list, createBot },
    } = DBotStores;
    const [add_btn_active, setAddBtnActive] = useState(false);

    React.useEffect(() => {
        if (!bot_list[0]) {
            getBotList();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className='server-bot'>
            <Button onClick={() => setAddBtnActive(true)} green>
                {localize('+ add bot')}
            </Button>
            <div>
                <div>
                    <ServerBotList />
                </div>
                <div>
                    <div className='chart-modal-dialog' data-testid='chart-modal-dialog'>
                        <Chart show_digits_stats={false} />
                    </div>
                </div>
            </div>
            <ServerQSForm add_btn_active={add_btn_active} setAddBtnActive={setAddBtnActive} createBot={createBot} />
        </div>
    );
});

export default ServerBot;
