import React from 'react';
import { render, screen } from '@testing-library/react';
import { TRADE_TYPES } from '@deriv/shared';
import ContractTypeItem from '../contract-type-item';

const contract_types = [
    { value: TRADE_TYPES.RISE_FALL, text: 'Rise/Fall' },
    { value: TRADE_TYPES.HIGH_LOW, text: 'Higher/Lower' },
];

const MockContractTypeItem = () => <ContractTypeItem contract_types={contract_types} value={TRADE_TYPES.RISE_FALL} />;

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
