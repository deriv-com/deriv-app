import React from 'react';
import { render, screen } from '@testing-library/react';
import PageReturn from '../page-return';

describe('<PageReturn/>', () => {
    it('renders component with passed props', () => {
        render(<PageReturn page_title='Page Title' onClick={jest.fn()} />);

        expect(screen.getByText('Page Title')).toBeInTheDocument();
    });
});
