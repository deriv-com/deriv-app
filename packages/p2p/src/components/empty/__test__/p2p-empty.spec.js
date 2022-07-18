import React from 'react';
import { render, screen } from '@testing-library/react';
import P2pEmpty from '../empty.jsx';

describe('<P2PEmpty/>', () => {
    it('renders component with passed title and children', () => {
        render(
            <P2pEmpty title='P2P Test'>
                <div data-testid='test_child'>Testing P2P Empty</div>
            </P2pEmpty>
        );

        expect(screen.getByText('P2P Test')).toBeInTheDocument();
        expect(screen.getByTestId('test_child')).toBeInTheDocument();
    });
});
