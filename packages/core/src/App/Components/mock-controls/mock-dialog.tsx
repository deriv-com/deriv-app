import React from 'react';
import './mock-dialog.scss';
import { Button, Checkbox, Input, Text } from '@deriv/components';
import { useMockServer } from './mock-server-provider';

const MockDialog = () => {
    const { active_mock_id, handleSetActiveMockId } = useMockServer();
    const [input_mock_id, setInputMockId] = React.useState(active_mock_id);

    const saveHandler = () => {
        if (input_mock_id) {
            handleSetActiveMockId(input_mock_id);
        }
    };

    return (
        <div className='mock-dialog'>
            <div className='mock-dialog__title'>
                <Text weight='bold'>Mock Server Config</Text>
            </div>
            <div className='mock-dialog__form'>
                <Checkbox checked={!!active_mock_id} label='Enable mock server' />
                <Input
                    type='text'
                    value={input_mock_id}
                    onChange={e => setInputMockId(e.target.value)}
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
