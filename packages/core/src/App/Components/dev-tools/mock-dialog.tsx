import React from 'react';
import classNames from 'classnames';
import { Button, Dropdown, Input, Text } from '@deriv/components';
import { useLocalStorageData } from '@deriv/hooks';
import { useStore } from '@deriv/stores';
import { useWS } from '@deriv/shared';
import { getLanguage } from '@deriv/translations';
import './mock-dialog.scss';

type MockServerStatus = 'online' | 'connecting' | 'offline';

type MockServerData = {
    session_id: string;
    is_mockserver_enabled: boolean;
};

const default_mock_data = {
    session_id: '',
    is_mockserver_enabled: false,
};

const MockDialog = () => {
    const WS = useWS();
    const { client } = useStore();
    const [session_list, setSessionList] = React.useState<string[]>([]);
    const [mock_server_data, setMockServerData, clearAllData] = useLocalStorageData<MockServerData>(
        'mock_server_data',
        default_mock_data
    );

    React.useEffect(() => {
        getSessionList();
    }, []);

    const getSessionList = async () => {
        const response = await WS.send({
            generate_mock: 1,
            session_list: 1,
        });

        const { session_list: list } = response;
        if (Array.isArray(list)) {
            setSessionList(prev => [...prev, ...list]);
        }
    };

    const handleMockLogin = async () => {
        const response = await WS.send({
            generate_mock: 1,
            login: 1,
            session_id: mock_server_data?.session_id,
        });

        delete response.echo_req;
        delete response.req_id;
        delete response.active_loginid;

        const param_obj: Record<string, string> = {};
        Object.keys(response).forEach((loginid, index) => {
            const current_index = index + 1;
            param_obj[`acct${current_index}`] = loginid;
            param_obj[`token${current_index}`] = response[loginid].token ?? '';
            param_obj[`cur${current_index}`] = response[loginid].currency || 'USD';
        });

        const params = new URLSearchParams(param_obj);
        const new_url = new URL(`${window.location.href}?${params}`);
        window.location.replace(new_url);
    };

    const handleSessionIdChange = (id: string) => {
        if (id) {
            WS.closeAndOpenNewConnection(getLanguage(), id);
        }
    };

    const handleClearAll = () => {
        clearAllData();
        WS.closeAndOpenNewConnection(getLanguage(), '');
    };

    const getServerStatus = (): MockServerStatus => {
        if (mock_server_data?.session_id && WS.hasReadyState(1)) {
            return 'online';
        } else if (mock_server_data?.session_id && (!client.is_logged_in || client.is_logging_in)) {
            return 'connecting';
        }
        return 'offline';
    };

    return (
        <div className='mock-dialog'>
            <div className='mock-dialog__title'>
                <Text size='sm' weight='bold'>
                    Mock Server Config
                </Text>
            </div>
            <div className={classNames('mock-dialog__status', `mock-dialog__status--${getServerStatus()}`)}>
                <Text size='xxs' weight='bold'>
                    Mock Server status: {getServerStatus().toLocaleUpperCase()}
                </Text>
            </div>
            <div className='mock-dialog__form'>
                <div className='mock-dialog__form--dropdown-container'>
                    <Dropdown
                        placeholder='Available session id'
                        list={session_list.map((s: string) => ({
                            text: s,
                            value: s,
                        }))}
                        onChange={e =>
                            setMockServerData(prev => (prev !== null ? { ...prev, session_id: e.target.value } : prev))
                        }
                        value={mock_server_data?.session_id}
                        is_align_text_left
                    />
                    <Button>
                        <svg
                            stroke='currentColor'
                            fill='none'
                            strokeWidth='2'
                            viewBox='0 0 24 24'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            height='1em'
                            width='1em'
                            xmlns='http://www.w3.org/2000/svg'
                        >
                            <polyline points='1 4 1 10 7 10' />
                            <polyline points='23 20 23 14 17 14' />
                            <path d='M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15' />
                        </svg>
                    </Button>
                </div>
                <Input
                    className='mock-dialog__form--input'
                    type='text'
                    label='Session Id'
                    value={mock_server_data?.session_id}
                    onChange={e =>
                        setMockServerData(prev => (prev !== null ? { ...prev, session_id: e.target.value } : prev))
                    }
                />
                <div className='mock-dialog__form--submit-container'>
                    <Button disabled={getServerStatus() === 'offline'} onClick={() => handleMockLogin()}>
                        Login
                    </Button>
                </div>
                <div className=''>
                    <Button
                        disabled={getServerStatus() === 'offline'}
                        onClick={() => handleSessionIdChange(mock_server_data?.session_id ?? '')}
                    >
                        Connect
                    </Button>
                    <Button onClick={() => handleClearAll()}>Disconnect</Button>
                </div>
            </div>
        </div>
    );
};

export default MockDialog;
