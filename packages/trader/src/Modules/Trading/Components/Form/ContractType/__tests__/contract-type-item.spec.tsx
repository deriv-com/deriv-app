import React from 'react';
import { render, screen } from '@testing-library/react';
import ContractTypeItem from '../contract-type-item.jsx';

const contract_types = [
    { value: 'rise_fall', text: 'Rise/Fall' },
    { value: 'high_low', text: 'Higher/Lower' },
];

const MockContractTypeItem = () => <ContractTypeItem contract_types={contract_types} value='rise_fall' />;

describe('ContractTypeItem Component', () => {
    it('should render the text', () => {
        render(<MockContractTypeItem />);
        const text = screen.getByText('Rise/Fall');
        expect(text).toBeInTheDocument();
    });

    it('should render multiple list items when we pass more than one item', () => {
        render(<MockContractTypeItem />);
        const divElement = screen.getAllByTestId('dt_contract_item');
        expect(divElement).toHaveLength(2);
    });

    it('should has "contract-type-item--selected" class when "value === type.value"', () => {
        render(<MockContractTypeItem />);
        const divElement = screen.getAllByTestId('dt_contract_item');
        expect(divElement[0]).toHaveClass('contract-type-item--selected');
    });
});
