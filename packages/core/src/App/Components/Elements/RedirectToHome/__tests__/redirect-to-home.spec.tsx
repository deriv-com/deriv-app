import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import RedirectToHome, { REDIRECT_TO_HOME_DISMISSED_KEY } from '../redirect-to-home';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: () => ({ isMobile: false, isDesktop: true, isTablet: false }),
}));

describe('<RedirectToHome />', () => {
    let modal_root_el: HTMLDivElement;
    const original_location = window.location;
    const assign_mock = jest.fn();

    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
        Object.defineProperty(window, 'location', { configurable: true, value: original_location });
    });

    beforeEach(() => {
        sessionStorage.clear();
        assign_mock.mockClear();
        Object.defineProperty(window, 'location', {
            configurable: true,
            value: { ...original_location, hostname: 'localhost', assign: assign_mock },
        });
    });

    const renderComponent = (client = {}) => {
        const mock = mockStore({
            client: { is_logged_in: true, is_authorize: true, is_client_store_initialized: true, ...client },
        });
        return render(<RedirectToHome />, {
            wrapper: ({ children }: { children: JSX.Element }) => (
                <StoreProvider store={mock}>{children}</StoreProvider>
            ),
        });
    };

    it('should not render anything when the user is not fully logged in', () => {
        renderComponent({ is_authorize: false });
        expect(screen.queryByText('Continue to home.deriv.com')).not.toBeInTheDocument();
        expect(screen.queryByText('Go to home.deriv.com')).not.toBeInTheDocument();
    });

    it('should render the popup when logged in and not dismissed', () => {
        renderComponent();
        expect(screen.getByText('Continue to home.deriv.com')).toBeInTheDocument();
        expect(screen.getByText('Contact support')).toBeInTheDocument();
        expect(screen.getByText(/Same login, new home/)).toBeInTheDocument();
        expect(screen.queryByText('Go to home.deriv.com')).not.toBeInTheDocument();
    });

    it('should redirect to the staging home dashboard when the continue CTA is clicked', async () => {
        renderComponent();
        await userEvent.click(screen.getByText('Continue to home.deriv.com'));
        expect(assign_mock).toHaveBeenCalledWith('https://staging-home.deriv.com/dashboard/');
    });

    it('should redirect to the staging home login with live chat when contact support is clicked', async () => {
        renderComponent();
        await userEvent.click(screen.getByText('Contact support'));
        expect(assign_mock).toHaveBeenCalledWith('https://staging-home.deriv.com/dashboard/login?live_chat=true');
    });

    it('should render the sticky banner (not the popup) when already dismissed in the session', () => {
        sessionStorage.setItem(REDIRECT_TO_HOME_DISMISSED_KEY, 'true');
        renderComponent();
        expect(screen.queryByText('Continue to home.deriv.com')).not.toBeInTheDocument();
        expect(screen.getByText('Go to home.deriv.com')).toBeInTheDocument();
        expect(screen.getByText('Sign in at home.deriv.com with your usual credentials.')).toBeInTheDocument();
    });

    it('should switch to the sticky banner and persist dismissal after the popup is closed', async () => {
        renderComponent();
        await userEvent.click(screen.getByTestId('dt_overlay'));
        expect(sessionStorage.getItem(REDIRECT_TO_HOME_DISMISSED_KEY)).toBe('true');
        expect(screen.getByText('Go to home.deriv.com')).toBeInTheDocument();
        expect(screen.queryByText('Continue to home.deriv.com')).not.toBeInTheDocument();
    });
});
