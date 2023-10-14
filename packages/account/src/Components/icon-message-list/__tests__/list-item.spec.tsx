import React from 'react';
import { render, screen } from '@testing-library/react';
import ListItem from '../list-item';

describe('<ListItem/>', () => {
    it('should render ListItem component', () => {
        render(<ListItem text='test' />);
        expect(screen.getByText('test')).toBeInTheDocument();
    });

    it('should render ListItem component with index', () => {
        render(<ListItem text='test' index={1} />);
        expect(screen.getByText('1.')).toBeInTheDocument();
        expect(screen.getByText('test')).toBeInTheDocument();
    });
});
