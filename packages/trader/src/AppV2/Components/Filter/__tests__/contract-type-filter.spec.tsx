import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContractTypeFilter from '../contract-type-filter';

const defaultFilterName = 'Trade types';
const mockProps = {
    onApplyContractTypeFilter: jest.fn(),
    contractTypeFilter: [],
};

describe('ContractTypeFilter', () => {
    it('should change data-state of the dropdown if user clicks on the filter', () => {
        render(<ContractTypeFilter {...mockProps} />);

        const dropdownChevron = screen.getAllByRole('img')[0];
        expect(dropdownChevron).toHaveAttribute('data-state', 'close');

        userEvent.click(screen.getByText(defaultFilterName));
        expect(dropdownChevron).toHaveAttribute('data-state', 'open');
    });

    it('should render correct chip name if contractTypeFilter is with single item', () => {
        const mockContractTypeFilter = ['Multipliers'];

        render(<ContractTypeFilter {...mockProps} contractTypeFilter={mockContractTypeFilter} />);

        expect(screen.queryByText(defaultFilterName)).toBeInTheDocument();
        expect(screen.getByText('(1)')).toBeInTheDocument();
    });

    it('should render correct chip name is contractTypeFilter is with multiple items', () => {
        const mockContractTypeFilter = ['Vanillas', 'Turbos'];
        render(<ContractTypeFilter {...mockProps} contractTypeFilter={mockContractTypeFilter} />);

        expect(screen.queryByText(defaultFilterName)).toBeInTheDocument();
        expect(screen.getByText('(2)')).toBeInTheDocument();
    });

    it('should call onApplyContractTypeFilter and setter (spied on) with array with chosen option after user clicks on contract type and clicks on "Apply" button', () => {
        const mockSetChangedOptions = jest.fn();
        jest.spyOn(React, 'useState')
            .mockImplementationOnce(() => [true, jest.fn()])
            .mockImplementationOnce(() => [[], mockSetChangedOptions]);

        render(<ContractTypeFilter {...mockProps} />);

        userEvent.click(screen.getByText('Accumulators'));
        userEvent.click(screen.getByText('Apply'));

        expect(mockSetChangedOptions).toHaveBeenCalledWith(['Accumulators']);
        expect(mockProps.onApplyContractTypeFilter).toBeCalled();
    });

    it('should call setter (spied on) with array without chosen option if user clicks on it, but it was already in contractTypeFilter', () => {
        const mockContractTypeFilter = ['Rise/Fall', 'Higher/Lower'];
        const mockSetChangedOptions = jest.fn();
        jest.spyOn(React, 'useState')
            .mockImplementationOnce(() => [true, jest.fn()])
            .mockImplementationOnce(() => [mockContractTypeFilter, mockSetChangedOptions]);

        render(<ContractTypeFilter {...mockProps} contractTypeFilter={mockContractTypeFilter} />);

        userEvent.click(screen.getByText('Rise/Fall'));

        expect(mockSetChangedOptions).toHaveBeenCalledWith(['Higher/Lower']);
    });

    it('should call setter (spied on) with empty array if user clicks on "Clear All" button', () => {
        const mockContractTypeFilter = ['Touch/No Touch'];
        const mockSetChangedOptions = jest.fn();
        jest.spyOn(React, 'useState')
            .mockImplementationOnce(() => [true, jest.fn()])
            .mockImplementationOnce(() => [mockContractTypeFilter, mockSetChangedOptions]);

        render(<ContractTypeFilter {...mockProps} contractTypeFilter={mockContractTypeFilter} />);

        userEvent.click(screen.getByText('Clear All'));

        expect(mockSetChangedOptions).toHaveBeenCalledWith([]);
    });
});
