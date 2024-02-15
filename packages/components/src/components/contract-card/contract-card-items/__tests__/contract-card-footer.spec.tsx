import React from 'react';
import { render, screen } from '@testing-library/react';
import { mockContractInfo, getCardLabels, isValidToSell } from '@deriv/shared';
import moment from 'moment';
import CardFooter from '../contract-card-footer';

type TCardFooter = React.ComponentProps<typeof CardFooter>;

jest.mock('react-transition-group', () => ({
    ...jest.requireActual('react-transition-group'),
    CSSTransition: jest.fn(({ children }) => <div>{children}</div>),
}));
jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    hasContractEntered: jest.fn().mockReturnValue(true),
    isOpen: jest.fn().mockReturnValue(true),
    isValidToSell: jest.fn(),
}));

describe('<CardFooter />', () => {
    const mockProps: TCardFooter = {
        contract_info: mockContractInfo(),
        getCardLabels: () => getCardLabels(),
        is_multiplier: false,
        is_positions: false,
        is_sell_requested: false,
        is_lookbacks: true,
        onClickCancel: jest.fn(),
        onClickSell: jest.fn(),
        onFooterEntered: jest.fn(),
        server_time: moment(new Date()).utc(),
        should_show_transition: false,
    };

    it('should render note for Lookbacks contract if it is valid to sell', () => {
        (isValidToSell as jest.Mock).mockReturnValue(true);
        render(<CardFooter {...mockProps} />);

        expect(screen.getByText(/Note:/i)).toBeInTheDocument();
    });

    it('should not render note for Lookbacks contract if it is NOT valid to sell', () => {
        (isValidToSell as jest.Mock).mockReturnValue(false);
        render(<CardFooter {...mockProps} />);

        expect(screen.queryByText(/Note:/i)).not.toBeInTheDocument();
    });

    it('should not render note if it is not Lookbacks contract', () => {
        render(<CardFooter {...mockProps} is_lookbacks={false} />);

        expect(screen.queryByText(/Note:/i)).not.toBeInTheDocument();
    });
});
