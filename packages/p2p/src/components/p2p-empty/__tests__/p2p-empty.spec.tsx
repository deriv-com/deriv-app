import React from 'react';
import { render, screen } from '@testing-library/react';
import P2pEmpty from '../p2p-empty';

describe('<P2PEmpty/>', () => {
    it('renders component with passed title and children', () => {
        render(
            <P2pEmpty title='P2P Test' has_tabs={false} icon={''}>
                <div>Testing P2P Empty</div>
            </P2pEmpty>
        );

        expect(screen.getByText('P2P Test')).toBeInTheDocument();
        expect(screen.getByText('Testing P2P Empty')).toBeInTheDocument();
    });
});
