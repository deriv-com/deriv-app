import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import TradeTypeTabs from '../trade-type-tabs';

jest.mock('Stores/connect.js', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

describe('Trade Type Tabs', () => {
    const mock_props = {
        contract_type: 'turboslong',
        onChange: jest.fn(),
    };

    it('should render only if contract_type is turbosshort or turboslong', () => {
        render(<TradeTypeTabs {...mock_props} />);
        const long_tab = screen.getByText('Long');
        const short_tab = screen.getByText('Short');
        [long_tab, short_tab].forEach(tab => {
            expect(tab).toBeInTheDocument();
        });
    });

    it('should not render if contract_type is other than turbosshort or turboslong', () => {
        render(<TradeTypeTabs {...mock_props} contract_type='invalid_type' />);
        const long_tab = screen.queryByText('Long');
        const short_tab = screen.queryByText('Short');
        [long_tab, short_tab].forEach(tab => {
            expect(tab).not.toBeInTheDocument();
        });
    });

    it('should call onChange when a tab is clicked', () => {
        const mockOnChange = jest.fn();
        render(<TradeTypeTabs contract_type='turboslong' onChange={mockOnChange} />);

        const short_tab = screen.getByText('Short');
        userEvent.click(short_tab);

        expect(mockOnChange).toHaveBeenCalled();
    });
});
