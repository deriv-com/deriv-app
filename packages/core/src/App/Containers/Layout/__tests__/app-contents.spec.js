import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { mockStore } from '@deriv/stores';
import { ThemedScrollbars } from '@deriv/components';
import AppContents from '../app-contents';

let child_ref;

const MockComp = ({ children }, ...props) => {
    child_ref = React.useRef();
    return (
        <div {...props} ref={child_ref}>
            {children}
        </div>
    );
};

jest.mock('Stores/connect.js', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn().mockReturnValue(true),
    WS: {
        wait: jest.fn().mockResolvedValue(true),
    },
}));

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    ThemedScrollbars: props => <MockComp {...props} />,
}));

const { client, ui, common } = mockStore({});

const mock_props = {
    is_eu_country: client.is_eu_country,
    is_eu: client.is_eu,
    is_logged_in: client.is_logged_in,
    is_logging_in: client.is_logging_in,
    is_app_disabled: ui.is_app_disabled,
    is_cashier_visible: ui.is_cashier_visible,
    is_dark_mode: ui.is_dark_mode_on,
    is_cfd_page: false,
    is_positions_drawer_on: false,
    is_route_modal_on: false,
    notifyAppInstall: jest.fn(),
    platform: common.platform,
    setAppContentsScrollRef: jest.fn(),
    pushDataLayer: jest.fn(),
    identifyEvent: jest.fn(),
    pageView: jest.fn(),
};

describe('<AppContents/>', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should render the Cookie banner with Accept reject button', () => {
        const new_props = { ...mock_props, is_eu_country: true };
        render(<AppContents {...new_props} />, { wrapper: BrowserRouter });

        waitFor(async () => {
            expect(await screen.findByText('Don’t accept')).toBeInTheDocument();
            expect(await screen.findByText('Accept')).toBeInTheDocument();
        });
    });

    it('should not render the cookie banner when it is not a eu country', () => {
        const new_props = { ...mock_props, is_eu_country: false };
        render(<AppContents {...new_props} />, { wrapper: BrowserRouter });

        waitFor(() => {
            expect(screen.queryByText('Don’t accept')).not.toBeInTheDocument();
            expect(screen.queryByText('Accept')).not.toBeInTheDocument();
        });
    });

    it('should move scroll to top', async () => {
        const new_props = { ...mock_props, is_eu_country: false };
        render(<AppContents {...new_props} />, { wrapper: BrowserRouter });

        await waitFor(() => {
            expect(child_ref.current.scrollTop).toBe(0);
        });
    });
});
