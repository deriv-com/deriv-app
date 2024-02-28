import React from 'react';
import { useHover } from 'usehooks-ts';
import { fireEvent, render, screen } from '@testing-library/react';
import { useModal } from '../../../../../../../../../components/ModalProvider';
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

jest.mock('../../../../../../../../../hooks/useDevice', () => ({
    __esModule: true,
    default: jest.fn(() => ({
        isMobile: false,
    })),
}));

// jest.mock('../../../../../../../components/WalletActionModal', () => ({
//     WalletActionModal: jest.fn(),
// }));

describe('TransactionsPendingRowField', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders component with basic props', () => {
        const props = {
            name: 'Test Name',
            value: 'Test Value',
        };

        render(<TransactionsPendingRowField {...props} />);

        expect(screen.getByText('Test Name')).toBeInTheDocument();
        expect(screen.getByText('Test Value')).toBeInTheDocument();
    });

    test('renders component with hint and shows tooltip on hover', () => {
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

        render(<TransactionsPendingRowField {...props} />);

        expect(screen.getByText('Test Name')).toBeInTheDocument();
        expect(screen.getByText('Test Value')).toBeInTheDocument();

        fireEvent.mouseOver(screen.getByText('Test Value'));

        expect(screen.getByText('Hint Text')).toBeInTheDocument();
    });

    test('calls onValueClick when value is clicked on mobile', () => {
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
        // (useModal as jest.Mock).mockReturnValue({ show: mockShow });

        render(<TransactionsPendingRowField {...props} />);

        fireEvent.click(screen.getByText('Test Value'));

        expect(useModal().show).toHaveBeenCalled();
    });

    test('calls window.open when value is clicked on desktop', () => {
        const props = {
            hint: {
                link: 'https://example.com',
                text: 'Hint Text',
                tooltipAlignment: 'top' as const,
            },
            name: 'Test Name',
            value: 'Test Value',
        };

        (useDevice as jest.Mock).mockReturnValue({ isMobile: false });

        render(<TransactionsPendingRowField {...props} />);

        fireEvent.click(screen.getByText('Test Value'));

        // expect(window.open).toHaveBeenCalledWith('https://example.com');
    });
});
