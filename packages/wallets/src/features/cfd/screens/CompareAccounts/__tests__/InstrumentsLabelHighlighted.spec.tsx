import React from 'react';
import { render, screen } from '@testing-library/react';
import { getHighlightedIconLabel } from '../compareAccountsConfig';
import InstrumentsLabelHighlighted from '../InstrumentsLabelHighlighted';

jest.mock('../compareAccountsConfig', () => ({
    getHighlightedIconLabel: jest.fn(),
}));

jest.mock('../InstrumentsIconWithLabel', () => ({
    __esModule: true,
    default: ({ text }: { text: string }) => <div data-testid='instrument-icon'>{text}</div>,
}));

describe('InstrumentsLabelHighlighted', () => {
    const defaultProps = {
        isEuRegion: false,
        platform: 'mt5' as const,
    };

    const mockIconData = [{ text: 'Forex' }, { text: 'Stocks' }, { text: 'Indices' }];

    beforeEach(() => {
        (getHighlightedIconLabel as jest.Mock).mockReturnValue(mockIconData);
    });

    it('renders default content and label for given trading instrument', () => {
        render(<InstrumentsLabelHighlighted {...defaultProps} />);

        const container = screen.getByTestId('dt_compare_cfd_account_outline__container');
        expect(container).toBeInTheDocument();

        mockIconData.forEach(item => {
            expect(screen.getByText(item.text)).toBeInTheDocument();
        });
    });

    it('renders InstrumentsIconWithLabel for each item in iconData', () => {
        render(<InstrumentsLabelHighlighted {...defaultProps} />);

        const instrumentIcons = screen.getAllByTestId('instrument-icon');
        expect(instrumentIcons).toHaveLength(mockIconData.length);
        instrumentIcons.forEach((icon, index) => {
            expect(icon).toHaveTextContent(mockIconData[index].text);
        });
    });

    it('handles empty iconData', () => {
        (getHighlightedIconLabel as jest.Mock).mockReturnValue([]);
        render(<InstrumentsLabelHighlighted {...defaultProps} />);

        const container = screen.getByTestId('dt_compare_cfd_account_outline__container');
        expect(container).toBeInTheDocument();
        expect(container).toBeEmptyDOMElement();
    });
});
