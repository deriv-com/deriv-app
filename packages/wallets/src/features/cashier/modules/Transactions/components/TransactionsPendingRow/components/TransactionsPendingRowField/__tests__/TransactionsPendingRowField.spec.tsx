import React from 'react';
import { useDevice } from '@deriv-com/ui';
import { fireEvent, render, screen } from '@testing-library/react';
import { ModalProvider } from '../../../../../../../../../components/ModalProvider';
import TransactionsPendingRowField from '../TransactionsPendingRowField';
import { APIProvider } from '@deriv/api-v2';
import WalletsAuthProvider from '../../../../../../../../../AuthProvider';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: jest.fn(() => '?modal-open=true'),
    }),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({})),
}));

const mockWindowOpen = jest.fn();
window.open = mockWindowOpen;

describe('TransactionsPendingRowField', () => {
    let $root: HTMLDivElement, $modalContainer: HTMLDivElement;

    beforeEach(() => {
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: true });
        jest.clearAllMocks();
        $root = document.createElement('div');
        $root.id = 'root';
        $modalContainer = document.createElement('div');
        $modalContainer.id = 'wallets_modal_root';
        document.body.appendChild($root);
        document.body.appendChild($modalContainer);
    });

    afterEach(() => {
        document.body.removeChild($root);
        document.body.removeChild($modalContainer);
        jest.clearAllMocks();
    });

    test('should render component with default props', () => {
        const props = {
            hint: {
                link: 'https://example.com',
                text: 'Hint Text',
                tooltipAlignment: 'top' as const,
            },
            name: 'Test Name',
            value: 'Test Value',
        };
        render(
            <APIProvider>
                <WalletsAuthProvider>
                    <ModalProvider>
                        <TransactionsPendingRowField {...props} />
                    </ModalProvider>
                </WalletsAuthProvider>
            </APIProvider>
        );

        expect(screen.getByText('Test Name')).toBeInTheDocument();
        expect(screen.getByText('Test Value')).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Test Value' })).toHaveAttribute('href', 'https://example.com');
    });

    test('should show modal when value is clicked on mobile/responsive', async () => {
        const props = {
            hint: {
                link: 'https://example.com',
                text: 'Hint Text',
                tooltipAlignment: 'top' as const,
            },
            name: 'Test Name',
            value: 'Test Value',
        };
        (useDevice as jest.Mock).mockReturnValue({ isMobile: true });

        render(
            <APIProvider>
                <WalletsAuthProvider>
                    <ModalProvider>
                        <TransactionsPendingRowField {...props} />
                    </ModalProvider>
                </WalletsAuthProvider>
            </APIProvider>,
            { container: $root }
        );
        fireEvent.click(screen.getByText('Test Value'));

        expect(screen.getByText('Transaction details')).toBeInTheDocument();
    });

    test('should open window with hint link when View button in modal is clicked', async () => {
        const props = {
            hint: {
                link: 'https://example.com',
                text: 'Hint Text',
                tooltipAlignment: 'top' as const,
            },
            name: 'Test Name',
            value: 'Test Value',
        };
        (useDevice as jest.Mock).mockReturnValue({ isMobile: true });

        render(
            <APIProvider>
                <WalletsAuthProvider>
                    <ModalProvider>
                        <TransactionsPendingRowField {...props} />
                    </ModalProvider>
                </WalletsAuthProvider>
            </APIProvider>,
            { container: $root }
        );
        fireEvent.click(screen.getByText('Test Value'));

        expect(screen.getByText('Transaction details')).toBeInTheDocument();
        fireEvent.click(screen.getByText('View'));

        expect(mockWindowOpen).toHaveBeenCalledWith('https://example.com');
    });
});
