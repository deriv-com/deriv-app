import React from 'react';
import { render, screen } from '@testing-library/react';
import { useStores } from 'Stores';
import TemporarilyBarredHint from '../temporarily-barred-hint.jsx';

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => ({ general_store: { is_barred: false } })),
}));

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    HintBox: () => <div>HintBox</div>,
}));

describe('<TemporarilyBarredHint/>', () => {
    it('should not render the TemporarilyBarredHint component if is_barred state is false', () => {
        render(<TemporarilyBarredHint />);
        const el_barred_hint = screen.queryByTestId('barred_hint');

        expect(el_barred_hint).not.toBeInTheDocument();
    });

    it('should render the TemporarilyBarredHint component if is_barred state is true', () => {
        useStores.mockImplementation(() => ({
            general_store: { is_barred: true },
        }));
        render(<TemporarilyBarredHint />);
        const el_barred_hint = screen.queryByTestId('barred_hint');

        expect(el_barred_hint).toBeInTheDocument();
    });
});
