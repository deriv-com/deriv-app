import React from 'react';
import { screen, render, waitFor } from '@testing-library/react';
import { useStores } from 'Stores';
import { isMobile } from '@deriv/shared';
import OrderDetailsWrapper from '../order-details-wrapper';

const MockOrderWrapper = props => {
    return isMobile() ? (
        <OrderDetailsWrapper {...props}>
            <p>desktop test</p>
        </OrderDetailsWrapper>
    ) : (
        <OrderDetailsWrapper {...props}>
            <p>mobile test</p>
        </OrderDetailsWrapper>
    );
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(),
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn(),
}));

const mockUseStores = () => {
    useStores.mockImplementation(() => ({
        order_store: { order_information: { should_show_order_footer: true } },
        sendbird_store: { setShouldShowChatModal: false },
    }));
};

beforeAll(() => mockUseStores());

describe('<OrderDetailsWrapper />', () => {
    it('Should render component on desktop version', async () => {
        isMobile.mockReturnValue(true);
        const desktop_props = {
            onClick: jest.fn(),
            page_title: 'some text',
        };

        render(<MockOrderWrapper {...desktop_props} />);

        await waitFor(() => {
            expect(screen.getByTestId('order-details-wrapper-mobile')).toBeInTheDocument();
            expect(screen.getByText('desktop test')).toBeInTheDocument();
        });
    });
    it('Should render component on mobile version', async () => {
        isMobile.mockReturnValue(false);
        const mobile_props = {
            className: 'order-details',
            body_className: 'order-details--body',
            height_offset: '80px',
            is_flex: true,
            is_modal_open: true,
        };

        render(<MockOrderWrapper {...mobile_props} />);

        await waitFor(() => {
            expect(screen.getByTestId('order-details-wrapper-desktop')).toBeInTheDocument();
            expect(screen.getByText('mobile test')).toBeInTheDocument();
        });
    });
});
