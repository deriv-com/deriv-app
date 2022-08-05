import React from 'react';
import { render, screen } from '@testing-library/react';
import OrderInfoBlock from '../order-info-block.jsx';

describe('<OrderInfoBlock/>', () => {
    it('should render the component with the passed label and value', () => {
        render(<OrderInfoBlock label='P2P' value='Test' />);

        expect(screen.getByText('P2P')).toBeInTheDocument();
        expect(screen.getByText('Test')).toBeInTheDocument();
    });
});
