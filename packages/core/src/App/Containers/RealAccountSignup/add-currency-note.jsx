import React from 'react';
import { Text } from '@deriv/components';

const AddCurrencyNote = ({ message }) => {
    return (
        <div className='add-currency__note-wrapper'>
            <Text as='p' color='prominent' align='center' size='xxs' className='add-currency__note'>
                {message}
            </Text>
        </div>
    );
};

export default AddCurrencyNote;
