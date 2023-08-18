import React from 'react';
import { render, screen } from '@testing-library/react';
import ContractTypeList from '../contract-type-list';

const list = [
    { contract_types: [], label: 'first-item', icon: 'first-icon', key: 'All' },
    { contract_types: [], label: 'second-item', icon: 'second-icon', key: 'Options' },
];
const MockContractTypeList = () => <ContractTypeList list={list} />;

describe('ContractTypeList Component', () => {
    it('should render label text', () => {
        render(<MockContractTypeList />);
        const spanElement = screen.getByText(/first-item/i);
        expect(spanElement).toBeInTheDocument();
    });

    it('should render multiple list items when we pass more than one item', () => {
        render(<MockContractTypeList />);
        const divElement = screen.getAllByTestId(/contract_list/i);
        expect(divElement).toHaveLength(2);
    });
});
