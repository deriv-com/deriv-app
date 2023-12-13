import React from 'react';
import { screen, render } from '@testing-library/react';
import { PoincReceived } from '../received';

describe('<PoincReceived/>', () => {
    it('should render PoincReceived component', () => {
        render(<PoincReceived />);
        expect(screen.getByText("We've received your proof of income")).toBeInTheDocument();
        expect(
            screen.getByText("We'll review your documents and notify you of its status within 7 working days.")
        ).toBeInTheDocument();
    });
});
