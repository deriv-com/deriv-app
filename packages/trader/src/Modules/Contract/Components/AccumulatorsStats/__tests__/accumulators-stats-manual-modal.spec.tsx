import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { AccumulatorsStatsManualModal } from '../accumulators-stats-manual-modal';
import userEvent from '@testing-library/user-event';

type TModal = React.ComponentType<{
    children: React.ReactNode;
    is_open: boolean;
    title: string;
    toggleModal: () => void;
}> & {
    Body?: React.ComponentType<{
        children: React.ReactNode;
    }>;
};

jest.mock('@deriv/components', () => {
    const original_module = jest.requireActual('@deriv/components');
    const Modal: TModal = jest.fn(({ children, is_open, title, toggleModal }) =>
        is_open ? (
            <div data-testid='modal'>
                <h3>{title}</h3>
                <div onClick={toggleModal}>IcCross</div>
                {children}
            </div>
        ) : null
    );
    Modal.Body = jest.fn(({ children }) => <div>{children}</div>);
    return {
        ...original_module,
        Icon: jest.fn(({ icon, onClick }) => <div onClick={onClick}>{icon}</div>),
        Modal,
    };
});

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    getUrlBase: jest.fn(() => 'video_src.mp4'),
}));

describe('AccumulatorsStatsManualModal', () => {
    const modal_root_el = document.createElement('div');
    modal_root_el.setAttribute('id', 'modal_root');
    document.body.appendChild(modal_root_el);

    let props: React.ComponentProps<typeof AccumulatorsStatsManualModal>;
    beforeEach(() => {
        props = {
            title: 'Stats',
            icon_classname: 'info',
            is_manual_open: false,
            toggleManual: jest.fn(() => {
                props.is_manual_open = !props.is_manual_open;
            }),
        };
    });

    it('should open when info icon (IcInfoOutline) is clicked', () => {
        const { rerender } = render(<AccumulatorsStatsManualModal {...props} />);
        const info_icon = screen.getByText('IcInfoOutline');
        userEvent.click(info_icon);
        expect(props.toggleManual).toBeCalled();
        expect(props.is_manual_open).toBeTruthy();

        rerender(<AccumulatorsStatsManualModal {...props} />);
        expect(screen.getByRole('heading', { name: 'Stats' })).toBeInTheDocument();
        expect(screen.getByTestId('dt_accumulators_stats_manual_video')).toBeInTheDocument();
        expect(screen.getByText(/stats show the history of consecutive tick counts/i)).toBeInTheDocument();
    });
    it('should close after close button (IcCross) is clicked in the modal', () => {
        props.is_manual_open = true;
        const { rerender } = render(<AccumulatorsStatsManualModal {...props} />);
        const close_icon = within(screen.getByTestId('modal')).getByText('IcCross');
        userEvent.click(close_icon);
        expect(props.toggleManual).toBeCalled();
        expect(props.is_manual_open).toBeFalsy();

        rerender(<AccumulatorsStatsManualModal {...props} />);
        expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });
});
