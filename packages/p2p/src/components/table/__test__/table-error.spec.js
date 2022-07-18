import React from 'react';
import { render, screen } from '@testing-library/react';
import { TableError } from '../table-error.jsx';

describe('<TableError/>', () => {
    it('should render message passed as props', () => {
        render(<TableError message='Test message' />);

        expect(screen.getByText('Test message')).toBeInTheDocument();
    });
});
