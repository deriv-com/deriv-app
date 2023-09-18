import React from 'react';
import classNames from 'classnames';
import { api_base } from '@deriv/bot-skeleton';
import { Button, Icon, Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';
// import { useDBotStore } from 'Stores/useDBotStore';
import Form from './Form';
import './server-side-bot.scss';

const ServerSideBot = () => {
    const [active_bot, setActiveBot] = React.useState<string | null>('1');
    const [is_loading, setIsLoading] = React.useState<boolean>(true);
    const [form_visibility, setFormVisibility] = React.useState<boolean>(false);
    const [bot_list, setBotList] = React.useState<any[]>([]);
    // const { server_bot } = useDBotStore();
    // const { getBotList } = server_bot;

    // // eslint-disable-next-line no-console
    // console.log(server_bot, 'server_bot');
    const is_mobile = isMobile();

    React.useEffect(() => {
        setTimeout(() => {
            get();
            createBot();
        }, 2000);
    }, []);

    const get = async () => {
        try {
            const { bot_list, error } = await api_base?.api?.send({ bot_list: 1 });
            if (error) throw error;
            setBotList(bot_list);
            setIsLoading(false);
        } catch (e) {
            // eslint-disable-next-line no-console
            console.log(e, 'error error from compo');
            setIsLoading(false);
        }
    };

    const createBot = () => {
        api_base?.api?.send({
            bot_create: 1,
            data: {
                name: 'test 2',
                strategy: 'martingale',
                parameters: {
                    contract_type: 'CALL',
                    symbol: 'R_100',
                    duration: '1',
                    duration_unit: 'm',
                    initial_stake: '1',
                    size: 2,
                    take_profit: '10',
                    stop_loss: '10',
                },
            },
        });
    };

    const handleAction = (action: { type: string; bot_id: string }) => {
        // eslint-disable-next-line no-console
        console.log(action);
    };

    const onCloseForm = () => {
        setFormVisibility(false);
    };

    const onSubmitForm = () => {
        // eslint-disable-next-line no-console
        console.log('submit');
    };

    return (
        <div className='server-side__wrapper'>
            <div className='server-side__workspace'>
                <div className='server-side__workspace__bot-list-wrapper'>
                    <div className='server-side__titles'>
                        <div>
                            <Text as='h2' weight='bold'>
                                List of the bots:-
                            </Text>
                        </div>
                        <div>
                            <Button green onClick={() => setFormVisibility(true)}>
                                + Add New Bot
                            </Button>
                        </div>
                    </div>
                    <div className='server-side__workspace__list'>
                        {is_loading && <div>Loading...</div>}
                        {bot_list.map(bot => (
                            <BotCard
                                key={bot.bot_id}
                                {...bot}
                                is_active={bot.bot_id === active_bot}
                                onClick={(id: string) => setActiveBot(id)}
                                onAction={handleAction}
                                is_running={false}
                                is_mobile={is_mobile}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <Form is_open={form_visibility} onClose={onCloseForm} onSubmit={onSubmitForm} />
        </div>
    );
};

export default ServerSideBot;

type TBotCard = {
    name: string;
    paramerters: {
        contract_type: string;
        duration: string;
        duration_unit: string;
        initial_stake: string;
        size: number;
        symbol: string;
    };
    strategy: string;
    bot_id: string;
    is_active: boolean;
    onClick: (id: string) => void;
    onAction: (action: { type: string; id: string }) => void;
    is_running: boolean;
    is_mobile: boolean;
};

const BotCard: React.FC<TBotCard> = ({
    bot_id,
    name,
    paramerters,
    strategy,
    is_active,
    onClick,
    onAction,
    is_running,
    is_mobile,
}) => (
    <div
        className={classNames('server-side__workspace__list__item', {
            'server-side__workspace__list__item--active': is_active,
        })}
        onClick={() => onClick(bot_id)}
    >
        <div>
            <div>
                <Text as='p' size='xs'>
                    {name}
                </Text>
                {is_mobile ? (
                    <>
                        <div className='server-side__workspace__list__item__stats'>
                            <Text as='p' weight='bold' size='xs'>
                                {strategy}
                            </Text>
                            {/* {is_active && (
                                <Text as='p' className='runs' size='xs'>
                                    Runs: 24
                                </Text>
                            )} */}
                        </div>
                        {/* {is_active && (
                            <div className='server-side__workspace__list__item__stats'>
                                <Text as='p' className='profit' size='xs'>
                                    Profit: +14.49
                                </Text>
                                <Text as='p' className='loss' size='xs'>
                                    Loss: 0.00
                                </Text>
                            </div>
                        )} */}
                    </>
                ) : (
                    <div className='server-side__workspace__list__item__stats'>
                        <Text as='p' weight='bold' size='xs'>
                            {strategy}
                        </Text>
                        {/* {is_active && (
                            <>
                                <Text as='p' className='runs' size='xs'>
                                    Runs: 24
                                </Text>
                                <Text as='p' className='profit' size='xs'>
                                    Profit: +14.49
                                </Text>
                                <Text as='p' className='loss' size='xs'>
                                    Loss: 0.00
                                </Text>
                            </>
                        )} */}
                    </div>
                )}
            </div>
        </div>
        <div className='server-side__workspace__list__item__actions'>
            <div className='ss-icon' onClick={() => onAction({ type: is_running ? 'stop' : 'start', bot_id })}>
                <Icon icon='IcPlay' />
            </div>
            {/* <div className='ss-icon' onClick={() => onAction({ type: 'edit', id })}>
                <Icon icon='IcEdit' />
            </div> */}
            <div className='ss-icon' onClick={() => onAction({ type: 'delete', bot_id })}>
                <Icon icon='IcDelete' />
            </div>
        </div>
    </div>
);
