import React from 'react';
import { screen, render } from '@testing-library/react';
import { Expired } from '../expired';

describe('<Expired/>', () => {
    const message = 'New proof of address is needed';
    const text = 'Your documents for proof of address is expired. Please submit again.';
    const onClick = jest.fn();

    it('should render Expired component', () => {
        render(<Expired onClick={onClick} />);

        expect(screen.getByText(message)).toBeInTheDocument();
        expect(screen.getByText(text)).toBeInTheDocument();
        expect(screen.getByText('Resubmit')).toBeInTheDocument();
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render Expired component snapshot check', () => {
        const tree = render(<Expired onClick={onClick} />);

        expect(tree).toMatchSnapshot();
    });
});
