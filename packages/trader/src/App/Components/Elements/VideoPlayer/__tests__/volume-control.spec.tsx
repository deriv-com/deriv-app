import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import VolumeControl from '../volume-control';

const mocked_props: React.ComponentProps<typeof VolumeControl> = {
    onVolumeChange: jest.fn(),
    volume: 0.5,
    is_mobile: false,
    is_muted: false,
    toggleMute: jest.fn(new_value => (mocked_props.is_muted = new_value)),
};

const volume_bar = 'dt_volume_bar';
const volume_bar_filled = 'dt_volume_bar_filled';
const volume_dot = 'dt_volume_dot';

jest.mock('react-transition-group', () => ({
    ...jest.requireActual('react-transition-group'),
    CSSTransition: jest.fn(({ children, ...props }) => {
        return <div>{props.in ? children : null}</div>;
    }),
}));

describe('<VolumeControl />', () => {
    it('should render the component', () => {
        const { container } = render(<VolumeControl {...mocked_props} />);

        expect(container).not.toBeEmptyDOMElement();
    });

    it('should call toggleMute with proper argument if user clicked on volume button in order to mute/unmute', () => {
        const { rerender } = render(<VolumeControl {...mocked_props} />);

        const volume_button = screen.getByRole('button');
        userEvent.click(volume_button);
        expect(mocked_props.toggleMute).toBeCalledWith(true);

        rerender(<VolumeControl {...mocked_props} />);
        userEvent.click(volume_button);
        expect(mocked_props.toggleMute).toBeCalledWith(false);
    });

    it('should show and hide volume bar parts if user did mouseover/mouseleave', () => {
        render(<VolumeControl {...mocked_props} />);
        const volume_button = screen.getByRole('button');

        expect(screen.queryByTestId(volume_bar)).not.toBeInTheDocument();
        expect(screen.queryByTestId(volume_bar_filled)).not.toBeInTheDocument();
        expect(screen.queryByTestId(volume_dot)).not.toBeInTheDocument();

        fireEvent.mouseOver(volume_button);

        expect(screen.getByTestId(volume_bar)).toBeInTheDocument();
        expect(screen.getByTestId(volume_bar_filled)).toBeInTheDocument();
        expect(screen.getByTestId(volume_dot)).toBeInTheDocument();

        fireEvent.mouseLeave(volume_button);

        expect(screen.queryByTestId(volume_bar)).not.toBeInTheDocument();
        expect(screen.queryByTestId(volume_bar_filled)).not.toBeInTheDocument();
        expect(screen.queryByTestId(volume_dot)).not.toBeInTheDocument();
    });

    it('mouseover/mouseleave functionality should not work for mobile, parts of volume bar should always be hidden', () => {
        render(<VolumeControl {...mocked_props} is_mobile />);
        const volume_button = screen.getByRole('button');

        expect(screen.queryByTestId(volume_bar)).not.toBeInTheDocument();
        expect(screen.queryByTestId(volume_bar_filled)).not.toBeInTheDocument();
        expect(screen.queryByTestId(volume_dot)).not.toBeInTheDocument();

        fireEvent.mouseOver(volume_button);

        expect(screen.queryByTestId(volume_bar)).not.toBeInTheDocument();
        expect(screen.queryByTestId(volume_bar_filled)).not.toBeInTheDocument();
        expect(screen.queryByTestId(volume_dot)).not.toBeInTheDocument();
    });

    it('should call onVolumeChange if user clicked (rewind) on volume bar', () => {
        render(<VolumeControl {...mocked_props} />);
        const volume_button = screen.getByRole('button');

        fireEvent.mouseOver(volume_button);
        userEvent.click(screen.getByTestId(volume_bar));

        expect(mocked_props.onVolumeChange).toBeCalled();
    });

    it('should call onVolumeChange if user drag volume dot', () => {
        render(<VolumeControl {...mocked_props} />);
        const volume_button = screen.getByRole('button');

        fireEvent.mouseOver(volume_button);
        const drag_dot = screen.getByTestId(volume_dot);
        fireEvent.mouseDown(drag_dot);
        fireEvent.mouseMove(drag_dot);
        fireEvent.mouseUp(drag_dot);

        expect(mocked_props.onVolumeChange).toBeCalled();
    });
});
