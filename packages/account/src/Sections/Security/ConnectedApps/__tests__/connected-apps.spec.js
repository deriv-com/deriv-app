import React from 'react';
import { render, screen, waitFor, waitForElementToBeRemoved, fireEvent } from '@testing-library/react';
import ConnectedApps from '../connected-apps';

const oauth_apps_list = [
    {
        name: 'Local',
        app_markup_percentage: 0,
        app_id: 9999,
        scopes: ['read', 'admin', 'trade', 'payments'],
        last_used: '2021-10-31 06:49:52.054529',
    },
];

jest.mock('@deriv/shared/src/services/ws-methods', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    WS: {
        authorized: {
            send: ({ oauth_apps, revoke_oauth_app }) => {
                if (revoke_oauth_app) oauth_apps_list.pop();
                return { oauth_apps: oauth_apps_list };
            },
        },
    },
}));

const modalRoot = document.createElement('div');
modalRoot.setAttribute('id', 'modal_root');
document.body.appendChild(modalRoot);

describe('Connected Apps', () => {
    const originalOffsetHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetHeight');
    const originalOffsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth');

    beforeAll(() => {
        Object.defineProperty(HTMLElement.prototype, 'offsetHeight', { configurable: true, value: 50 });
        Object.defineProperty(HTMLElement.prototype, 'offsetWidth', { configurable: true, value: 50 });
    });

    afterAll(() => {
        Object.defineProperty(HTMLElement.prototype, 'offsetHeight', originalOffsetHeight);
        Object.defineProperty(HTMLElement.prototype, 'offsetWidth', originalOffsetWidth);
    });

    test('renders correctly', () => {
        render(<ConnectedApps />);
    });

    test('shows the title correctly', () => {
        render(<ConnectedApps />);
        expect(screen.getByText(/Authorised applications/i)).toBeInTheDocument();
    });

    test('loads and render the list', async () => {
        const { container } = render(<ConnectedApps />);

        await waitForElementToBeRemoved(() => container.querySelector('.initial-loader'));

        await waitFor(() => {
            expect(screen.getByText('Local')).toBeInTheDocument();
            expect(screen.getByText('2021-10-31 06:49:52')).toBeInTheDocument;
            expect(screen.getByText('Revoke access')).toBeInTheDocument();
        });
    });

    test('opens confirm modal on revoke access click', async () => {
        const { container } = render(<ConnectedApps />);

        await waitForElementToBeRemoved(() => container.querySelector('.initial-loader'));
        fireEvent.click(screen.getByText('Revoke access'));

        await waitFor(() => {
            expect(screen.getByText('Confirm')).toBeInTheDocument();
            expect(screen.getByText('Back')).toBeInTheDocument();
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

        fireEvent.click(screen.getByText('Confirm'));

        expect(screen.queryByText('Local')).not.toBeInTheDocument();
    });
});
