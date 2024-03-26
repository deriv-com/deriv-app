import React from 'react';
import { render, screen } from '@testing-library/react';
import ResultOverlay from '../result-overlay';

const default_mocked_props = {
    currency: 'USD',
    contract_id: 1987232323,
    getCardLabels: () => ({ CLOSED: 'Closed' }),
    getContractPath: jest.fn(),
    is_positions: true,
    is_visible: true,
    onClick: jest.fn(),
    onClickRemove: jest.fn(),
    payout_info: 4.05,
    result: 'won',
};

jest.mock('react-transition-group', () => ({
    CSSTransition: jest.fn(({ children }) => <div>{children}</div>),
}));
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    NavLink: jest.fn(({ children }) => <div>{children}</div>),
}));

describe('<ResultOverlay/>', () => {
    it('should render component with plus inside if payout_info is positive', () => {
        render(<ResultOverlay {...default_mocked_props} />);

        expect(screen.getByText(default_mocked_props.getCardLabels().CLOSED)).toBeInTheDocument();
        expect(screen.getByText('+')).toBeInTheDocument();
        expect(screen.getByText('4.05 USD')).toBeInTheDocument();
    });
    it('should render component with minus inside if payout_info is negative', () => {
        render(<ResultOverlay {...default_mocked_props} payout_info={-6} />);

        expect(screen.getByText(default_mocked_props.getCardLabels().CLOSED)).toBeInTheDocument();
        expect(screen.getByText('-')).toBeInTheDocument();
        expect(screen.getByText('6.00 USD')).toBeInTheDocument();
    });
});
