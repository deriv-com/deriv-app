import React from 'react';
import { render, screen, waitFor, waitForElementToBeRemoved, fireEvent, act } from '@testing-library/react';
import ConnectedApps from '../connected-apps';

const true_oauth_apps_list = {
    oauth_apps: [
        {
            name: 'Local',
            app_markup_percentage: 0,
            app_id: 9999,
            scopes: ['read', 'admin', 'trade', 'payments'],
            last_used: '2021-10-31 06:49:52',
        },
    ],
};

const empty_oauth_apps_list = { oauth_apps: [] };

jest.mock('@deriv/shared/src/services/ws-methods', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    WS: {
        authorized: {
            send: ({ revoke_oauth_app }) => {
                if (revoke_oauth_app) empty_oauth_apps_list;
                return true_oauth_apps_list;
            },
        },
    },
}));

describe('Connected Apps', () => {
    const originalOffsetHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetHeight');
    const originalOffsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth');

    beforeAll(() => {
        Object.defineProperty(HTMLElement.prototype, 'offsetHeight', { configurable: true, value: 50 });
        Object.defineProperty(HTMLElement.prototype, 'offsetWidth', { configurable: true, value: 50 });
        const modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        Object.defineProperty(HTMLElement.prototype, 'offsetHeight', originalOffsetHeight);
        Object.defineProperty(HTMLElement.prototype, 'offsetWidth', originalOffsetWidth);
        let modal_root_el = document.getElementById('modal_root');
        document.body.removeChild(modal_root_el);
    });

    test('renders correctly', async () => {
        const { container } = render(<ConnectedApps />);

        expect(screen.getByText(/Authorised applications/i)).toBeInTheDocument();

        await waitForElementToBeRemoved(() => container.querySelector('.initial-loader'));

        await waitFor(() => {
            expect(screen.getByText('Local')).toBeInTheDocument();
            expect(screen.getByText(true_oauth_apps_list.oauth_apps[0].last_used)).toBeInTheDocument();
            expect(screen.getByText('Revoke access')).toBeInTheDocument();
        });
    });

    test('revoke access when click on confirm', async () => {
        const { container } = render(<ConnectedApps />);

        await waitForElementToBeRemoved(() => container.querySelector('.initial-loader'));
        fireEvent.click(screen.getByText('Revoke access'));

        await waitFor(() => {
            expect(screen.getByText('Confirm')).toBeInTheDocument();
            expect(screen.getByText('Back')).toBeInTheDocument();
        });

        act(() => {
            fireEvent.click(screen.getByText('Confirm'));
        });

        await waitFor(() => {
            expect(screen.queryByText('Local')).not.toBeInTheDocument();
        });
    });
});
