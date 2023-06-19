import React from 'react';
import { Button, Checkbox, Input, Text } from '@deriv/components';
import { useMockServer } from './mock-server-provider';
import './mock-dialog.scss';

const MockDialog = () => {
    const { active_session_id, handleSetActiveSessionId } = useMockServer();
    const [input_session_id, setInputSessionId] = React.useState(active_session_id);

    const saveHandler = () => {
        if (input_session_id) {
            handleSetActiveSessionId(input_session_id);
        }
    };

    return (
        <div className='mock-dialog'>
            <div className='mock-dialog__title'>
                <Text weight='bold'>Mock Server Config</Text>
            </div>
            <div className='mock-dialog__form'>
                <Checkbox checked={!!input_session_id} label='Enable mock server' />
                <Input
                    type='text'
                    value={input_session_id}
                    onChange={e => setInputSessionId(e.target.value)}
                    className='mock-dialog__form--input'
                />
                <div className='mock-dialog__form--submit-container'>
                    <Button onClick={saveHandler}>Save</Button>
                </div>
            </div>
        </div>
    );
};

export default MockDialog;
