import React from 'react';
import { render, screen } from '@testing-library/react';
import { TRADE_TYPES } from '@deriv/shared';
import ContractTypeItem from '../contract-type-item';

const contract_types = [
    { value: [TRADE_TYPES.RISE_FALL, TRADE_TYPES.RISE_FALL_EQUAL], text: 'Rise/Fall' },
    { value: TRADE_TYPES.HIGH_LOW, text: 'Higher/Lower' },
];

describe('ContractTypeItem component', () => {
    const mockProps = {
        contract_types,
        value: TRADE_TYPES.RISE_FALL,
    };
    it('should render the text', () => {
        render(<ContractTypeItem {...mockProps} />);
        const text = screen.getByText('Rise/Fall');
        expect(text).toBeInTheDocument();
    });
    it('should render multiple list items when we pass more than one item', () => {
        render(<ContractTypeItem {...mockProps} />);
        const divElement = screen.getAllByTestId('dt_contract_item');
        expect(divElement).toHaveLength(2);
    });
    it('should have "contract-type-item--selected" class when type.value array includes value', () => {
        render(<ContractTypeItem {...mockProps} value={TRADE_TYPES.RISE_FALL_EQUAL} />);
        const divElement = screen.getAllByTestId('dt_contract_item');
        expect(divElement[0]).toHaveClass('contract-type-item--selected');
    });
    it('should have "contract-type-item--selected" class when type.value is a string equal to value', () => {
        render(<ContractTypeItem {...mockProps} value={TRADE_TYPES.HIGH_LOW} />);
        const divElement = screen.getAllByTestId('dt_contract_item');
        expect(divElement[1]).toHaveClass('contract-type-item--selected');
    });
});
