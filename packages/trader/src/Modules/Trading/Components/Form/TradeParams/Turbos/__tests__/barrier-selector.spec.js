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

jest.mock('../trade-type-tabs', () => jest.fn(() => <div>Long</div>));

describe('Barriers Selector', () => {
    let current_barrier;
    beforeEach(() => {
        render(<BarrierSelector {...mock_props} />);
        current_barrier = screen.getByTestId('current_barrier');
    });

    it('Barrier Selector component should have Trade Type Tabs inside it', () => {
        const long_tab = screen.getByText('Long');

        expect(long_tab).toBeInTheDocument();
    });

    it('The value of barrier_1 is chosen by default after first render', () => {
        expect(screen.getByText(mock_props.barrier_1)).toBeInTheDocument();
    });

    it('The barrier list is hidden/collapsed by default', () => {
        expect(screen.queryByText('Distance to spot')).not.toBeInTheDocument();
    });

    it('The barrier list is shown after cliking on current barrier', () => {
        userEvent.click(current_barrier);

        expect(screen.getByText('Distance to spot')).toBeInTheDocument();
    });

    it('All the available barriers from turbos_barrier_choices should be rendered in barrier list (when it can be shown)', () => {
        userEvent.click(current_barrier);

        mock_props.turbos_barrier_choices.forEach(barrier => expect(screen.getByTestId(barrier)).toBeInTheDocument());
    });

    it('After user clicked on the one of barriers option, it should be shown as current barrier value for desktop', () => {
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

    it('After clicking on cross icon barrier list should be closed/collapsed', () => {
        userEvent.click(current_barrier);
        const icon_cross = screen.getByText('IcCross');
        userEvent.click(icon_cross);

        expect(screen.queryByText('Distance to spot')).not.toBeInTheDocument();
    });
});
