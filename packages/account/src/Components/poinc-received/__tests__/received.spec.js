import React from 'react';
import { screen, render } from '@testing-library/react';
import { Received } from '../received';

describe('<Received/>', () => {
    it('should render Received component', () => {
        render(<Received />);
        expect(screen.getByText("We've received your proof of income")).toBeInTheDocument();
        expect(
            screen.getByText("We've review your documents and notify you its status whithin 3 days.")
        ).toBeInTheDocument();
    });
});
