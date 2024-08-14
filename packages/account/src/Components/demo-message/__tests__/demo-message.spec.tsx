import React from 'react';
import { render, screen } from '@testing-library/react';
import DemoMessage from '../demo-message';

// eslint-disable-next-line react/display-name
jest.mock('Components/icon-with-message', () => () => <div>DemoMessage</div>);

it('should render DemoMessage component', () => {
    render(<DemoMessage />);
    expect(screen.getByText('DemoMessage')).toBeInTheDocument();
});
