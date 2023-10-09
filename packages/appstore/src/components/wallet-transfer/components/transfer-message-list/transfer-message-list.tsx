import React from 'react';
import { MessageList } from '@deriv/components';
import { useFormikContext } from 'formik';
import type { TInitialValues } from '../../types';

const TransferMessageList = () => {
    const {
        errors: { from_amount: errors_message_list },
    } = useFormikContext<TInitialValues>();

    const message_list = Array.isArray(errors_message_list) ? errors_message_list : [];

    return <MessageList list={message_list} />;
};

export default TransferMessageList;
