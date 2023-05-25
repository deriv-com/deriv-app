import React from 'react';
import { render, screen } from '@testing-library/react';
import Dp2pBlockedChecklist from '..';
import { useStores } from 'Stores/index';

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(),
}));

describe('<Dp2pBlockedChecklist />', () => {
    it('it should render <Dp2pBlockedChecklist /> component if client is high risk and not blocked', () => {
        (useStores as jest.Mock).mockReturnValue({
            general_store: {
                is_high_risk: true,
                is_blocked: false,
            },
        });
        render(<Dp2pBlockedChecklist />);
        expect(screen.getByText('Complete the financial assessment form')).toBeInTheDocument();
    });

    it('it should return null when client is not high risk', () => {
        (useStores as jest.Mock).mockReturnValue({
            general_store: {
                is_high_risk: false,
                is_blocked: false,
            },
        });
        const { container } = render(<Dp2pBlockedChecklist />);
        expect(container).toBeEmptyDOMElement();
    });
});
