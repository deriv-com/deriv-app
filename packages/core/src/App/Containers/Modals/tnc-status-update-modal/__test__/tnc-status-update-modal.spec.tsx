import React from 'react';
import { render, screen } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import TncStatusUpdateModal from '../tnc-status-update-modal';
import userEvent from '@testing-library/user-event';
import { WS } from '@deriv/shared';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    WS: {
        tncApproval: jest.fn(() =>
            Promise.resolve({
                tnc_approval: {},
            })
        ),
        getSettings: jest.fn(() =>
            Promise.resolve({
                get_limits: {},
            })
        ),
    },
}));

describe('<TncStatusUpdateModal />', () => {
    let modal_root_el: HTMLDivElement;

    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    const mock_store = mockStore({
        ui: {
            is_tnc_update_modal_open: false,
            toggleTncUpdateModal: jest.fn(),
        },
    });

    const renderComponent = ({ store_config = mock_store }) => {
        return render(
            <StoreProvider store={store_config}>
                <TncStatusUpdateModal />
            </StoreProvider>
        );
    };

    it('should not render the TncStatusUpdateModal component', async () => {
        renderComponent({});
        expect(screen.queryByText('Please review our updated terms and conditions')).not.toBeInTheDocument();
    });

    it('should render the TncStatusUpdateModal component', async () => {
        const mock = mockStore({
            ui: {
                is_tnc_update_modal_open: true,
            },
        });

        renderComponent({ store_config: mock });
        expect(screen.getByText("Updated T&C's")).toBeInTheDocument();
    });

    it('should render TncStatusUpdateModal component with Messages and Button', async () => {
        const mock = mockStore({
            ui: {
                is_tnc_update_modal_open: true,
            },
        });

        renderComponent({ store_config: mock });
        expect(screen.getByText("Updated T&C's")).toBeInTheDocument();
        expect(screen.getByText('By continuing you understand and accept the changes.')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Continue' })).toBeInTheDocument();
    });

    it('should render TncStatusUpdateModal click on Button to called toggle modal function', async () => {
        const mock = mockStore({
            ui: {
                is_tnc_update_modal_open: true,
                toggleTncUpdateModal: jest.fn(),
            },
        });

        renderComponent({ store_config: mock });
        const continue_button = screen.getByRole('button', { name: 'Continue' });
        await userEvent.click(continue_button);
        expect(WS.tncApproval).toBeCalled();
        expect(WS.getSettings).toBeCalled();
        expect(mock.ui.toggleTncUpdateModal).toHaveBeenCalledWith(false);
    });
});
