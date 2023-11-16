import * as React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import LaunchModal from '../launch-modal';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TraderProviders from '../../../../../trader-providers';
import { LocalStore } from '@deriv/shared';

const renderLaunchModal = () => {
    const mocked_store = mockStore({
        client: { is_logged_in: true },
    });

    const handleMockLaunchModal = () => {
        LocalStore.set('mockLaunch', JSON.stringify(true));
    };

    render(
        <StoreProvider store={mocked_store}>
            <LaunchModal open handleChange={handleMockLaunchModal} />
        </StoreProvider>
    );
};

const renderTradeComponent = () => {
    const mocked_store = mockStore({});
    render(
        <StoreProvider store={mocked_store}>
            <TraderProviders store={mocked_store} />
        </StoreProvider>
    );
};

jest.mock('Assets/SvgComponents/launch/ic-chart-launch.svg', () => jest.fn(() => <div>Chart Svg</div>));

describe('Launch Modal', () => {
    let modal_root_el: HTMLDivElement;

    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    beforeEach(() => {
        LocalStore.remove('launchModalShown');
    });

    it('should display launch modal for a logged in user', async () => {
        renderLaunchModal();
        expect(screen.getByTestId('launch-modal')).toBeInTheDocument();
    });

    it('should not display launch modal for a not logged in user', async () => {
        renderTradeComponent();
        expect(screen.queryByTestId('launch-modal')).not.toBeInTheDocument();
    });

    it('should set the localStorage key launchModalShown to true on clicking the continue button', async () => {
        renderLaunchModal();
        const continue_btn = screen.getByRole('button', { name: 'Continue' });

        userEvent.click(continue_btn);
        const value = JSON.parse(LocalStore.get('mockLaunch') ?? 'false');
        expect(value).toBe(true);
    });

    it('should not show the launch modal once localStorage launchModalShown is set', async () => {
        LocalStore.set('launchModalShown', JSON.stringify(true));
        renderTradeComponent();
        await waitFor(() => {
            expect(screen.queryByTestId('launch-modal')).not.toBeInTheDocument();
        });
    });
});
