import React from 'react';
import { ChatMessageText } from '../ChatMessageText';

const AdminMessage = () => (
    <ChatMessageText color='general' type='admin'>
        Hello! This is where you can chat with the counterparty to confirm the order details.
        <br />
        Note: In case of a dispute, we’ll use this chat as a reference.
    </ChatMessageText>
);

export default AdminMessage;
