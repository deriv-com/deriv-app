import React from 'react';
import { Button, Checkbox, Input, Text } from '@deriv/components';
import WS from 'Services/ws-methods';
import './mock-dialog.scss';
import { getLanguage } from '@deriv/translations';

export const SESSION_ID_KEY = 'session_id';

const MockDialog = () => {
    const previous_session_id = localStorage.getItem(SESSION_ID_KEY) || '';
    const [selected_session_id, setSelectedSessionId] = React.useState(previous_session_id);
    const [input_session_id, setInputSessionId] = React.useState(previous_session_id);
    const [session_list, setSessionList] = React.useState([]);

    const handleSetActiveSessionId = (session_id: string) => {
        if (!session_id) return;
        window.localStorage.setItem(SESSION_ID_KEY, session_id);
        setSelectedSessionId(session_id);
        WS.send({
            session_id: 'default',
            generate_mock: 1,
            session_list: 1,
        });
    };

    return (
        <div className='mock-dialog'>
            <div className='mock-dialog__title'>
                <Text weight='bold'>Mock Server Config</Text>
            </div>
            <div className='mock-dialog__form'>
                <Checkbox label='Enable mock server' />
                <select>
                    {session_list.length && session_list.map(s => <option key={`options-${s}`}>{s}</option>)}
                </select>
                <Input
                    className='mock-dialog__form--input'
                    type='text'
                    label='Session Id'
                    hint='Create a new session id'
                    value={input_session_id}
                    onChange={e => setInputSessionId(e.target.value)}
                />
                <div className='mock-dialog__form--submit-container'>
                    <Button onClick={() => handleSetActiveSessionId(input_session_id)}>Save</Button>
                </div>
            </div>
        </div>
    );
};

export default MockDialog;
