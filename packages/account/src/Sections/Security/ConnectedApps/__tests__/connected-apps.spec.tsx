import React from 'react';
import { useOAuthConnectedApps, useOAuthRevokeConnectedApps } from '@deriv/hooks';
import { StoreProvider, mockStore } from '@deriv/stores';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConnectedApps from '../connected-apps';

const mock_connected_apps: ReturnType<typeof useOAuthConnectedApps>['data'] = [
    {
        name: 'Local',
        app_markup_percentage: 0,
        app_id: 9999,
        scopes: ['read', 'admin', 'trade', 'payments'],
        last_used: '2021-10-31 06:49:52',
        official: 0,
        appstore: '',
        github: '',
        googleplay: '',
        homepage: '',
        redirect_uri: '',
        verification_uri: '',
        active: 0,
    },
];
jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useOAuthConnectedApps: jest.fn(),
    useOAuthRevokeConnectedApps: jest.fn(),
}));
const mockUseOAuthConnectedApps = useOAuthConnectedApps as jest.Mock;
const mockUseOAuthRevokeConnectedApps = useOAuthRevokeConnectedApps as jest.Mock;
jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Loading: jest.fn(() => <div>Mocked Loading</div>),
}));
jest.mock('../connected-apps-earn-more', () => jest.fn(() => <div>Mocked Earn More</div>));
jest.mock('../connected-apps-empty', () => jest.fn(() => <div>Mocked Empty Apps</div>));
jest.mock('../connected-apps-know-more', () => jest.fn(() => <div>Mocked Know More</div>));

describe('ConnectedApps', () => {
    const originalOffsetHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetHeight');
    const originalOffsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth');
    let modal_root_el: HTMLDivElement;

    beforeAll(() => {
        Object.defineProperty(HTMLElement.prototype, 'offsetHeight', { configurable: true, value: 50 });
        Object.defineProperty(HTMLElement.prototype, 'offsetWidth', { configurable: true, value: 50 });
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    beforeEach(() => {
        mockUseOAuthConnectedApps.mockReturnValue({
            data: mock_connected_apps,
            isLoading: false,
            isError: false,
        });
        mockUseOAuthRevokeConnectedApps.mockReturnValue({ revokeOAuthApp: jest.fn() });
    });

    afterAll(() => {
        Object.defineProperty(HTMLElement.prototype, 'offsetHeight', originalOffsetHeight as PropertyDescriptor);
        Object.defineProperty(HTMLElement.prototype, 'offsetWidth', originalOffsetWidth as PropertyDescriptor);
        document.body.removeChild(modal_root_el);
    });

    const renderComponent = (mock_store = mockStore({})) =>
        render(
            <StoreProvider store={mock_store}>
                <ConnectedApps />
            </StoreProvider>
        );

    it('should render the Loading component initially', async () => {
        mockUseOAuthConnectedApps.mockReturnValue({ data: mock_connected_apps, isLoading: true, isError: false });
        renderComponent();

        expect(screen.getByText(/Mocked Loading/i)).toBeInTheDocument();
    });

    it("should render the 'Know more' component", async () => {
        renderComponent();

        expect(screen.getByText(/Mocked Know More/i)).toBeInTheDocument();
    });

    it("should render the 'Earn more' component", async () => {
        renderComponent();

        await waitFor(() => {
            expect(screen.getByText(/Mocked Earn More/i)).toBeInTheDocument();
        });
    });

    it('should render the app list in Desktop view', async () => {
        renderComponent();
        const mock_permissions = mock_connected_apps[0]?.scopes
            ?.map(scope => scope.charAt(0).toUpperCase().concat(scope.substring(1)))
            .join(', ');

        await waitFor(() => {
            expect(screen.getByText('Name')).toBeInTheDocument();
            expect(screen.getByText(mock_connected_apps[0].name)).toBeInTheDocument();
            expect(screen.getByText('Last login')).toBeInTheDocument();
            if (mock_connected_apps[0]?.last_used) {
                expect(screen.getByText(mock_connected_apps[0].last_used)).toBeInTheDocument();
            } else {
                expect(mock_connected_apps[0].last_used).not.toBeNull();
            }
            expect(screen.getByText('Permission')).toBeInTheDocument();
            if (mock_permissions) {
                expect(screen.getByText(mock_permissions)).toBeInTheDocument();
            } else {
                expect(mock_permissions).not.toBeNull();
            }
            expect(screen.getByRole('button', { name: 'Revoke access' })).toBeInTheDocument();
        });
    });

    it('should render the app list in Mobile view', async () => {
        renderComponent(mockStore({ ui: { is_mobile: true } }));
        const mock_permissions = mock_connected_apps[0]?.scopes
            ?.map(scope => scope.charAt(0).toUpperCase().concat(scope.substring(1)))
            .join(', ');

        await waitFor(() => {
            expect(screen.getByText('Name')).toBeInTheDocument();
            expect(screen.getByText(mock_connected_apps[0].name)).toBeInTheDocument();
            expect(screen.getByText('Last login')).toBeInTheDocument();
            if (mock_connected_apps[0]?.last_used) {
                expect(screen.getByText(mock_connected_apps[0].last_used)).toBeInTheDocument();
            } else {
                expect(mock_connected_apps[0].last_used).not.toBeNull();
            }
            expect(screen.getByText('Permission')).toBeInTheDocument();
            if (mock_permissions) {
                expect(screen.getByText(mock_permissions)).toBeInTheDocument();
            } else {
                expect(mock_permissions).not.toBeNull();
            }
            expect(screen.getByRole('button', { name: 'Revoke access' })).toBeInTheDocument();
        });
    });

    it('should open the modal to revoke access on clicking the button', async () => {
        const mockRevokeOAuthApp = jest.fn();
        mockUseOAuthRevokeConnectedApps.mockReturnValue({ revokeOAuthApp: mockRevokeOAuthApp });
        renderComponent();

        const revoke_button = screen.getByRole('button', { name: 'Revoke access' });
        act(() => {
            userEvent.click(revoke_button);
        });
        await waitFor(() => {
            expect(screen.getByText(/Confirm revoke access\?/i)).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument();
        });

        const confirm_button = screen.getByRole('button', { name: 'Confirm' });
        act(() => {
            userEvent.click(confirm_button);
        });
        await waitFor(() => {
            expect(confirm_button).toBeInTheDocument();
            expect(mockRevokeOAuthApp).toHaveBeenCalledTimes(1);
        });
    });

    it('should render the empty apps informative text component if there are no connected apps', async () => {
        mockUseOAuthConnectedApps.mockReturnValue({ data: [], isLoading: false, isError: false });
        renderComponent();

        await waitFor(() => {
            expect(screen.getByText(/Mocked Empty Apps/i)).toBeInTheDocument();
        });
    });
});
