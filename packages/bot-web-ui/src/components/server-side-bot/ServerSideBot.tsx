import React from 'react';
import classNames from 'classnames';
import { Button, Icon, Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { useDBotStore } from 'Stores/useDBotStore';
import Form from './Form';
import './server-side-bot.scss';

const mock_data = [
    {
        id: '1',
        name: 'Call Indicies 100 ticks 1',
        strategy: 'Martingale',
        paramerters: {
            contract_type: 'CALL',
            duration: '5',
            duration_unit: 't',
            initial_stake: '1',
            size: 2,
            symbol: 'R_100',
        },
    },
    {
        id: '2',
        name: 'Server side bot name',
        strategy: 'Martingale',
        paramerters: {
            contract_type: 'CALL',
            duration: '5',
            duration_unit: 't',
            initial_stake: '1',
            size: 2,
            symbol: 'R_100',
        },
    },
    {
        id: '3',
        name: 'Server side bot name',
        strategy: 'Martingale',
        paramerters: {
            contract_type: 'CALL',
            duration: '5',
            duration_unit: 't',
            initial_stake: '1',
            size: 2,
            symbol: 'R_100',
        },
    },
    {
        id: '4',
        name: 'Server side bot name',
        strategy: 'Martingale',
        paramerters: {
            contract_type: 'CALL',
            duration: '5',
            duration_unit: 't',
            initial_stake: '1',
            size: 2,
            symbol: 'R_100',
        },
    },
    {
        id: '5',
        name: 'Server side bot name',
        strategy: 'Martingale',
        paramerters: {
            contract_type: 'CALL',
            duration: '5',
            duration_unit: 't',
            initial_stake: '1',
            size: 2,
            symbol: 'R_100',
        },
    },
    {
        id: '6',
        name: 'Server side bot name',
        strategy: 'Martingale',
        paramerters: {
            contract_type: 'CALL',
            duration: '5',
            duration_unit: 't',
            initial_stake: '1',
            size: 2,
            symbol: 'R_100',
        },
    },
];

const ServerSideBot = () => {
    const [active_bot, setActiveBot] = React.useState<string | null>('1');
    const [form_visibility, setFormVisibility] = React.useState<boolean>(false);
    const { dbot } = useDBotStore();
    const is_mobile = isMobile();

    // React.useEffect(() => {
    // eslint-disable-next-line no-console
    // console.log(dbot, 'dbot');
    // dbot.getBotList();
    // eslint-disable-next-line no-console
    // console.log(api_base?.api);
    // }, []);

    const handleAction = (action: { type: string; id: string }) => {
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
                        {mock_data.map(bot => (
                            <BotCard
                                key={bot.id}
                                {...bot}
                                is_active={bot.id === active_bot}
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
    id: string;
    is_active: boolean;
    onClick: (id: string) => void;
    onAction: (action: { type: string; id: string }) => void;
    is_running: boolean;
    is_mobile: boolean;
};

const BotCard: React.FC<TBotCard> = ({
    id,
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
        onClick={() => onClick(id)}
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
            <div className='ss-icon' onClick={() => onAction({ type: is_running ? 'stop' : 'start', id })}>
                <Icon icon='IcPlay' />
            </div>
            {/* <div className='ss-icon' onClick={() => onAction({ type: 'edit', id })}>
                <Icon icon='IcEdit' />
            </div> */}
            <div className='ss-icon' onClick={() => onAction({ type: 'delete', id })}>
                <Icon icon='IcDelete' />
            </div>
        </div>
    </div>
);
