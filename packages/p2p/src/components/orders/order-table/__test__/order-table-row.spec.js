import React from 'react';
import { render, screen } from '@testing-library/react';
import { Table } from '@deriv/components';
import OrderTableHeader from '../order-table-header.jsx';

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn().mockReturnValue({
        general_store: {
            is_active_tab: false,
            client: '',
            props: {},
            getLocalStorageSettingsForLoginId: jest.fn(),
        },
        order_store: {
            setQueryDetails: jest.fn(),
        },
        sendbird_store: {
            setShouldShowChatModal: jest.fn(),
            setShouldShowChatOnOrders: jest.fn(),
        },
    }),
}));
