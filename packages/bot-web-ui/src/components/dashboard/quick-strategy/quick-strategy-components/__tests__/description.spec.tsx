import React from 'react';
import { render, screen } from '@testing-library/react';
import Description from '../description';

describe('Description', () => {
    it('should render Description', () => {
        const { container } = render(<Description description={'Sample Text'} />);

        expect(container).toBeInTheDocument();
        expect(screen.getByText('Sample Text')).toBeInTheDocument();
    });
});
