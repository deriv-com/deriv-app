import React from 'react';
import { render, screen } from '@testing-library/react';
import InputGroup from '../input-group';

describe('InputGroup', () => {
    const children = 'This is children';
    it('should render InputGroup with children passed inside', () => {
        render(<InputGroup>{children}</InputGroup>);
        expect(screen.getByText(/This is children/)).toBeInTheDocument();
    });

    it('should have children_class passed into the component', () => {
        render(<InputGroup className='children_class'>{children}</InputGroup>);
        const children_text = screen.getByText(/This is children/);
        expect(children_text).toHaveClass('children_class');
    });
});
