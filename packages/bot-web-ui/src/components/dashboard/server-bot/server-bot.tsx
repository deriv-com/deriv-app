import React, { useState } from 'react';
import { Button } from '@deriv/components';
import { api_base } from '@deriv/bot-skeleton';
import { localize } from '@deriv/translations';
import { useStore } from '@deriv/stores';
import './server-bot.scss';
import ServerBotList from './server-bot-list';
import ServerQSForm from './server-qs-form';
import Chart from 'Components/chart';

const initial_req_schema = {
    bot_create: 1,
    data: {
        name: "your bot",
        strategy: "martingale",
        parameters: {
            initial_stake: 1,
            size: 1,
            take_profit: 1,
            stop_loss: 1
        },
        contract_parameters: {
            contract_type: "ONETOUCH",
            symbol: "R_100",
            duration: "5",
            duration_unit: "m",
            basis: "stake",
            amount: 1,
            currency: "USD"
        }
    }
};

const ServerBot = () => {
    const { client } = useStore();
    const [bot_list, setBotList] = useState([]);
    const [add_btn_active, setAddBtnActive] = useState(false);
    const api_status = api_base.getConnectionStatus();

    const createBot = () => {
        api_base.api?.send(initial_req_schema);
        setAddBtnActive(false);
    }

    const removeBot = () => {
        api_base.api?.send({
            bot_remove: 1,
            bot_id: "4a6f65feff2f90b88cf5111bdd0c0ffb" //id
        })
    }

    const getListBot = async () => {
        console.log('api_status', api_status);

        // if (api_status === 'Connected') {
        // console.log('here');

        await api_base?.api?.send({
            "bot_list": 1
        }).then((data) => {
            console.log('data', data.bot_list.bot_listing);
            return setBotList(data.bot_list.bot_listing);
        }).catch(e => console.log('e', e));
        // }
    }

    const setFormValues = () => {
        const data = JSON.parse(localStorage.getItem('qs-fields') || '{}');
        const parameters = initial_req_schema.data.parameters;
        const contract_parameters = initial_req_schema.data.contract_parameters;

        Object.keys(data).forEach(key => {
            if (key === 'size') {
                parameters[key] = data[key];
            }
            if (key === 'stake') {
                parameters['initial_stake'] = data['stake'];
            }
            if (key === 'type') {
                contract_parameters['contract_type'] = data['type'];
            }
            if (key === 'duration' ||
                key === 'symbol' ||
                key === 'duration_unit' ||
                key === 'amount' ||
                key === 'take_profit' ||
                key === 'stop_loss'
            ) {
                contract_parameters[key] = data[key];
            }
            if (key === 'currency') {
                contract_parameters[key] = data[client?.currency];
            }
        });
    }

    React.useEffect(() => {
        getListBot();
    }, [!!api_base.api, api_status]);

    React.useEffect(() => {
        if (!!bot_list[0] === false) {
            getListBot();
        }
        setFormValues();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className='server-bot'>
            <Button onClick={() => setAddBtnActive(true)} green>{localize('+ add bot')}</Button>
            <div>
                <div>
                    <div className='chart-modal-dialog' data-testid='chart-modal-dialog'>
                        <Chart show_digits_stats={false} />
                    </div>
                </div>
                <div>
                    <ServerBotList bot_list={bot_list} />
                </div>
            </div>
            <ServerQSForm add_btn_active={add_btn_active} setAddBtnActive={setAddBtnActive} />
        </div>
    )
}

export default ServerBot;