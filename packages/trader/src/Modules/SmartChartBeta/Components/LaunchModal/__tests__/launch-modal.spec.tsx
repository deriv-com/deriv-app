import * as React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import LaunchModal from '../launch-modal';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TraderProviders from '../../../../../trader-providers';

const renderLaunchModal = (is_logged_in = true) => {
    const mocked_store = mockStore({
        client: { is_logged_in },
    });

    const handleMockLaunchModal = () => {
        sessionStorage.setItem('mockLaunch', JSON.stringify(true));
    };

    render(
        <StoreProvider store={mocked_store}>
            <LaunchModal open={true} handleChange={handleMockLaunchModal} />
        </StoreProvider>
    );
};

const renderTradeComponent = (storeProps = {}) => {
    const mocked_store = mockStore({});
    render(
        <StoreProvider store={mocked_store}>
            <TraderProviders store={mockStore(storeProps)} />
        </StoreProvider>
    );
};

jest.mock('Assets/SvgComponents/launch/ic-chart-launch.svg', () => {
    const LaunchModalChartImage = () => <div>Chart Svg</div>;

    return LaunchModalChartImage;
});

describe('Launch Modal', () => {
    let modal_root_el: HTMLDivElement;

    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    beforeEach(() => {
        sessionStorage.clear();
    });

    it('should display launch modal for a logged in user', async () => {
        renderLaunchModal();
        expect(screen.getByTestId('launch-modal')).toBeInTheDocument();
    });

    it('should not display launch modal for a not logged in user', async () => {
        renderTradeComponent();
        expect(screen.queryByTestId('launch-modal')).not.toBeInTheDocument();
    });

    it('should set the sessionStorage key launchModalShown to true on clicking the continue button', async () => {
        renderLaunchModal();
        const continue_btn = screen.getByRole('button', { name: 'Continue' });

        userEvent.click(continue_btn);
        const value = JSON.parse(sessionStorage.getItem('mockLaunch') || 'false');
        expect(value).toBe(true);
    });

    it('should not show the launch modal once sessionStorage launchModalShown is set', async () => {
        sessionStorage.setItem('launchModalShown', JSON.stringify(true));
        renderTradeComponent();
        await waitFor(() => {
            expect(screen.queryByTestId('launch-modal')).not.toBeInTheDocument();
        });
    });
});
