import React from 'react';
import { render, screen } from '@testing-library/react';
import DemoMessage from '../demo-message';

jest.mock('Stores/connect.js', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

it('should render "switch to real account" button when property "has_button" is passed', () => {
    render(<DemoMessage has_button />);
    expect(screen.getByRole('button')).toBeInTheDocument();
});
