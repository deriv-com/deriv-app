import React from 'react';
import { useHover } from 'usehooks-ts';
import { fireEvent, render, screen } from '@testing-library/react';
import useDevice from '../../../../../../../../../hooks/useDevice';
import TransactionsPendingRowField from '../TransactionsPendingRowField';

jest.mock('usehooks-ts', () => ({
    useHover: jest.fn(),
}));

const mockShow = jest.fn();
jest.mock('../../../../../../../../../components/ModalProvider', () => ({
    ...jest.requireActual('../../../../../../../../../components/ModalProvider'),
    useModal: () => ({
        hide: jest.fn(),
        show: mockShow,
    }),
}));

jest.mock('../../../../../../../../../hooks/useDevice', () => jest.fn());

describe('TransactionsPendingRowField', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should render component with basic props', () => {
        const props = {
            name: 'Test Name',
            value: 'Test Value',
        };

        (useDevice as jest.Mock).mockReturnValue({ isMobile: false });
        render(<TransactionsPendingRowField {...props} />);

        expect(screen.getByText('Test Name')).toBeInTheDocument();
        expect(screen.getByText('Test Value')).toBeInTheDocument();
    });

    test('should render component with hint and shows tooltip on hover', () => {
        const props = {
            hint: {
                link: 'https://example.com',
                text: 'Hint Text',
                tooltipAlignment: 'top' as const,
            },
            name: 'Test Name',
            value: 'Test Value',
        };

        (useHover as jest.Mock).mockReturnValue(true);
        (useDevice as jest.Mock).mockReturnValue({ isMobile: false });

        render(<TransactionsPendingRowField {...props} />);

        expect(screen.getByText('Test Name')).toBeInTheDocument();
        expect(screen.getByText('Test Value')).toBeInTheDocument();

        fireEvent.mouseOver(screen.getByText('Test Value'));

        expect(screen.getByText('Hint Text')).toBeInTheDocument();
    });

    test('should call onValueClick when value is clicked on mobile/responsive', async () => {
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

        render(<TransactionsPendingRowField {...props} />);

        fireEvent.click(screen.getByText('Test Value'));

        expect(mockShow).toHaveBeenCalled();
    });

    test('should call window.open when value is clicked on desktop', async () => {
        const props = {
            hint: {
                link: 'https://example.com',
                text: 'Hint Text',
                tooltipAlignment: 'top' as const,
            },
            name: 'Test Name',
            value: 'Test Value',
        };

        const mockWindowOpen = jest.fn();
        window.open = mockWindowOpen;

        (useDevice as jest.Mock).mockReturnValue({ isMobile: false });

        render(<TransactionsPendingRowField {...props} />);

        expect(screen.getByRole('link', { name: 'Test Value' })).toHaveAttribute('href', 'https://example.com');
    });
});
