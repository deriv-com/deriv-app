import { act, render, screen } from '@testing-library/react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { useDevice } from '@deriv-com/ui';
import NetworkStatusToastPopup from '../network-status-toast-popup';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isMobile: true })),
}));

jest.mock('@deriv-com/quill-ui', () => ({
    Snackbar: jest.fn(({ message, isVisible }) => (isVisible ? <div>{message}</div> : null)),
}));

describe('NetworkStatusToastPopup', () => {
    const offline = 'Offline';
    const online = 'Online';
    const connecting = 'Connecting to server';

    let popup_root_el: Element;

    beforeAll(() => {
        popup_root_el = document.createElement('div');
        popup_root_el.setAttribute('id', 'popup_root');
        document.body.appendChild(popup_root_el);
    });

    afterAll(() => {
        document.body.removeChild(popup_root_el);
    });

    const mock_store = mockStore({
        common: { network_status: { class: offline.toLowerCase(), tooltip: offline } },
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    const wrapper = ({ children }: { children: JSX.Element }) => (
        <StoreProvider store={mock_store}>{children}</StoreProvider>
    );

    it('should render NetworkStatusToastPopup when offline', () => {
        render(<NetworkStatusToastPopup />, { wrapper });

        expect(screen.queryByText(connecting)).not.toBeInTheDocument();
        expect(screen.queryByText(online)).not.toBeInTheDocument();
        expect(screen.getByText(offline)).toBeInTheDocument();
    });

    it('should render NetworkStatusToastPopup when trying to connect', async () => {
        jest.useFakeTimers();

        mock_store.common.network_status.class = connecting.toLowerCase();
        mock_store.common.network_status.tooltip = connecting;

        const { rerender } = render(
            <StoreProvider store={mock_store}>
                <NetworkStatusToastPopup />
            </StoreProvider>
        );

        expect(screen.queryByText(offline)).not.toBeInTheDocument();
        expect(screen.queryByText(online)).not.toBeInTheDocument();
        expect(screen.getByText(connecting)).toBeInTheDocument();

        const mock_store_updated = mockStore({
            common: { network_status: { class: online.toLowerCase(), tooltip: online } },
        });

        rerender(
            <StoreProvider store={mock_store_updated}>
                <NetworkStatusToastPopup />
            </StoreProvider>
        );

        expect(screen.queryByText(offline)).not.toBeInTheDocument();
        expect(screen.queryByText(connecting)).not.toBeInTheDocument();
        expect(screen.getByText(online)).toBeInTheDocument();

        act(() => {
            jest.advanceTimersByTime(1500);
        });

        expect(screen.queryByText(offline)).not.toBeInTheDocument();
        expect(screen.queryByText(connecting)).not.toBeInTheDocument();
        expect(screen.queryByText(online)).not.toBeInTheDocument();

        jest.useRealTimers();
    });

    it('should not render NetworkStatusToastPopup when no message', () => {
        mock_store.common.network_status.class = offline.toLowerCase();
        mock_store.common.network_status.tooltip = '';

        render(<NetworkStatusToastPopup />, { wrapper });

        expect(screen.queryByText(offline)).not.toBeInTheDocument();
        expect(screen.queryByText(connecting)).not.toBeInTheDocument();
        expect(screen.queryByText(online)).not.toBeInTheDocument();
    });

    it('should not render NetworkStatusToastPopup for desktop', () => {
        (useDevice as jest.Mock).mockReturnValue({
            isDesktop: true,
            isTablet: false,
            isMobile: false,
        });
        mock_store.common.network_status.class = offline.toLowerCase();
        mock_store.common.network_status.tooltip = offline;

        render(<NetworkStatusToastPopup />, { wrapper });

        expect(screen.queryByText(offline)).not.toBeInTheDocument();
        expect(screen.queryByText(connecting)).not.toBeInTheDocument();
        expect(screen.queryByText(online)).not.toBeInTheDocument();
    });

    it('should not render NetworkStatusToastPopup for tablet', () => {
        (useDevice as jest.Mock).mockReturnValue({
            isDesktop: false,
            isTablet: true,
            isMobile: false,
        });
        mock_store.common.network_status.class = offline.toLowerCase();
        mock_store.common.network_status.tooltip = offline;

        render(<NetworkStatusToastPopup />, { wrapper });

        expect(screen.queryByText(offline)).not.toBeInTheDocument();
        expect(screen.queryByText(connecting)).not.toBeInTheDocument();
        expect(screen.queryByText(online)).not.toBeInTheDocument();
    });
});
