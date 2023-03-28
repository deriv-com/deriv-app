import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import BarrierSelector from '../barrier-selector';
import { useStore } from '@deriv/stores';

const mocked_root_store: Partial<ReturnType<typeof useStore>> = {
    modules: {
        trade: {
            barrier_1: '16',
            onChange: jest.fn(e => {
                if (mocked_root_store.modules) {
                    mocked_root_store.modules.trade.barrier_1 = e.target.value;
                }
            }),
            setHoveredBarrier: jest.fn(),
            barrier_choices: ['16', '33', '40'],
        },
    },
};

jest.mock('@deriv/stores', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    observer: <T,>(Component: T) => Component,
    useStore: () => mocked_root_store,
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

describe('<BarrierSelector/>', () => {
    const barriers_list_header = 'Barriers';
    let current_barrier: HTMLElement;
    beforeEach(() => {
        render(<BarrierSelector />);
        current_barrier = screen.getByTestId('current_barrier');
    });
    it('should render properly with Barrier inside it', () => {
        const barrier_title = screen.getByText('Barrier');

        expect(barrier_title).toBeInTheDocument();
    });
    it('barrier_1 value is selected by default', () => {
        expect(screen.getByText('16')).toBeInTheDocument();
    });
    it('barrier list should not be rendered by default', () => {
        expect(screen.queryByText(barriers_list_header)).not.toBeInTheDocument();
    });
    it('barrier list is displayed after clicking on the current barrier', () => {
        userEvent.click(current_barrier);

        expect(screen.getByText(barriers_list_header)).toBeInTheDocument();
    });
    it('should render all available barrier values from barrier_choices in barrier list when it is expanded', () => {
        userEvent.click(current_barrier);

        ['16', '33', '40'].forEach(barrier => expect(screen.getByTestId(barrier)).toBeInTheDocument());
    });
    it('onChange should be called with the new barrier option when it is clicked', () => {
        userEvent.click(current_barrier);
        const clicked_barrier = screen.getByTestId('33');
        userEvent.click(clicked_barrier);
        expect(mocked_root_store.modules?.trade.barrier_1).toBe('33');
    });
    it('barrier list should not be rendered when cross icon is clicked', () => {
        userEvent.click(current_barrier);
        const icon_cross = screen.getAllByText('IcCross');
        userEvent.click(icon_cross[0]);

        expect(screen.queryByText(barriers_list_header)).not.toBeInTheDocument();
    });
    it('barrier list should not be rendered when the new barrier option was clicked', () => {
        userEvent.click(current_barrier);
        const clicked_barrier = screen.getByTestId('33');
        userEvent.click(clicked_barrier);

        expect(screen.queryByText(barriers_list_header)).not.toBeInTheDocument();
    });
});
