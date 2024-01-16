import React from 'react';
import { render, screen, within } from '@testing-library/react';
import LabeledQuantityInputMobile from '../labeled-quantity-input-mobile';

describe('LabeledQuantityInputMobile', () => {
    it('should render Stake input', () => {
        render(<LabeledQuantityInputMobile name='amount' input_label='Stake' ariaLabel='Amount' value='' />);

        expect(screen.getByTestId('dt_amount_widget')).toBeInTheDocument();
        const fieldset = screen.getByRole('group');
        expect(fieldset).toHaveClass('amount__fields');
        const input = within(fieldset).getByLabelText('Amount');
        expect(input).toBeEnabled();
        expect(screen.getByRole('heading', { name: 'Stake' })).toBeInTheDocument();
    });
    it('should render Barrier input', () => {
        render(<LabeledQuantityInputMobile name='barrier_1' input_label='Barrier' ariaLabel='Barrier' value='' />);

        expect(screen.getByTestId('dt_barrier_1_widget')).toBeInTheDocument();
        const fieldset = screen.getByRole('group');
        expect(fieldset).toHaveClass('barrier_1__fields');
        const input = within(fieldset).getByLabelText('Barrier');
        expect(input).toBeEnabled();
        expect(screen.getByRole('heading', { name: 'Barrier' })).toBeInTheDocument();
    });
});
