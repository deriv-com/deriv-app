import React from 'react';
import { render, screen } from '@testing-library/react';
import ContractTypeDialog from '../contract-type-dialog.jsx';

const list = [
    { contract_types: [{ value: 'first-value' }], label: 'first-item' },
    { contract_types: [{ value: 'second-value' }], label: 'second-item' },
];

describe('ContractTypeDialog Component', () => {
    it('should render "children" when passed in', () => {
        render(
            <ContractTypeDialog is_open categories={[]} list={list}>
                <div data-testid='dt_child' />
            </ContractTypeDialog>
        );
        const child = screen.getByTestId('dt_child');
        expect(child).toBeInTheDocument();
    });
});
