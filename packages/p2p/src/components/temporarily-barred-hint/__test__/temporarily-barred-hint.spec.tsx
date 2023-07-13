import React from 'react';
import { render, screen } from '@testing-library/react';
import TemporarilyBarredHint from '../temporarily-barred-hint';
import { useStores } from 'Stores/index';

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(),
}));

describe('<TemporarilyBarredHint />', () => {
    it('it should render <TemporarilyBarredHint /> component if client is barred', () => {
        (useStores as jest.Mock).mockReturnValue({
            general_store: {
                is_barred: true,
            },
        });
        render(<TemporarilyBarredHint />);
        expect(screen.getByTestId('dt_temporarily_barred_hint')).toBeInTheDocument();
    });

    it('it should return null when client is not barred', () => {
        (useStores as jest.Mock).mockReturnValue({
            general_store: {
                is_barred: false,
            },
        });
        const { container } = render(<TemporarilyBarredHint />);
        expect(container).toBeEmptyDOMElement();
    });
});
