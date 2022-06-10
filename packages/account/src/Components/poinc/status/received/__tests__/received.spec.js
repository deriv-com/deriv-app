import React from 'react';
import { screen, render } from '@testing-library/react';
import { PoincReceived } from '../received';

describe('<PoincReceived/>', () => {
    it('should render PoincReceived component', () => {
        render(<PoincReceived />);
        expect(screen.getByText("We've received your proof of income")).toBeInTheDocument();
        expect(
            screen.getByText("We've review your documents and notify you its status whithin 3 days.")
        ).toBeInTheDocument();
    });
});
