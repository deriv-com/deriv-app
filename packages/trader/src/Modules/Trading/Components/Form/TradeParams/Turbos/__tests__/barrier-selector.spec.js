import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import BarrierSelector from '../barrier-selector';

const mock_props = {
    barrier_1: '16',
    onChange: jest.fn(),
    setHoveredBarrier: jest.fn(),
    turbos_barrier_choices: ['16', '33', '40'],
};

jest.mock('Stores/connect.js', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => props => Component({ ...props, ...mock_props }),
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
}));

jest.mock('@deriv/components', () => {
    const original_module = jest.requireActual('@deriv/components');
    return {
        ...original_module,
        Icon: jest.fn(() => <div>IcCross</div>),
    };
});

jest.mock('../trade-type-tabs', () => jest.fn(() => <div>TradeTypeTabs</div>));

describe('<BarrierSelector/>', () => {
    const barriers_list_header = 'Barriers';
    let current_barrier;
    beforeEach(() => {
        render(<BarrierSelector {...mock_props} />);
        current_barrier = screen.getByTestId('current_barrier');
    });
    it('should render properly with TradeTypeTabs and Barrier inside it', () => {
        const trade_type_tabs = screen.getByText('TradeTypeTabs');
        const barrier_title = screen.getByText('Barrier');

        expect(trade_type_tabs).toBeInTheDocument();
        expect(barrier_title).toBeInTheDocument();
    });
    it('barrier_1 value is selected by default', () => {
        expect(screen.getByText(mock_props.barrier_1)).toBeInTheDocument();
    });
    it('barrier list should not be rendered by default', () => {
        expect(screen.queryByText(barriers_list_header)).not.toBeInTheDocument();
    });
    it('barrier list is displayed after clicking on the current barrier', () => {
        userEvent.click(current_barrier);

        expect(screen.getByText(barriers_list_header)).toBeInTheDocument();
    });
    it('should render all available barrier values from turbos_barrier_choices in barrier list when it is expanded', () => {
        userEvent.click(current_barrier);

        mock_props.turbos_barrier_choices.forEach(barrier => expect(screen.getByTestId(barrier)).toBeInTheDocument());
    });
    it('onChange should be called with the new barrier option when it is clicked', () => {
        userEvent.click(current_barrier);
        const cliked_barrier = screen.getByTestId(mock_props.turbos_barrier_choices[1]);
        userEvent.click(cliked_barrier);

        expect(mock_props.onChange).toHaveBeenCalledWith({
            target: {
                name: 'barrier_1',
                value: mock_props.turbos_barrier_choices[1],
            },
        });
    });
    it('barrier list should not be rendered when cross icon is clicked', () => {
        userEvent.click(current_barrier);
        const icon_cross = screen.getByText('IcCross');
        userEvent.click(icon_cross);

        expect(screen.queryByText(barriers_list_header)).not.toBeInTheDocument();
    });
});
