import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TimePicker from '../time-picker';
import moment from 'moment';
import { mockStore } from '@deriv/stores';
import TraderProviders from '../../../../../trader-providers';

jest.mock('../dialog', () => jest.fn(() => 'TimePickerDialog'));
jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Icon: jest.fn(() => <div>Mocked Icon</div>),
}));
jest.mock('react-transition-group', () => ({
    CSSTransition: jest.fn(({ children, ...props }) =>
        props.in ? <div>{children}</div> : <div>CSSTransitionElement</div>
    ),
}));

describe('<TimePicker />', () => {
    let default_mocked_store: ReturnType<typeof mockStore>;
    const mocked_props = {
        end_times: [moment('2023-11-22T12:00:00')],
        is_nativepicker: false,
        name: 'testTimePicker',
        onChange: jest.fn(),
        placeholder: '',
        selected_time: '23:45',
        start_times: [moment('2023-11-21T08:00:00')],
        validation_errors: ['error', 'error1'],
    };
    beforeEach(() => {
        default_mocked_store = {
            ...mockStore({
                ui: {
                    current_focus: '',
                    setCurrentFocus: jest.fn(),
                },
            }),
        };
    });
    const mockTimePicker = () => {
        return (
            <TraderProviders store={default_mocked_store}>
                <TimePicker {...mocked_props} />
            </TraderProviders>
        );
    };
    it('should render CSS Transition Element, mocked Icon and input with selected_time if is_native_picker is false and input is not clicked', () => {
        render(mockTimePicker());
        expect(screen.getByRole('textbox')).toHaveValue('23:45 GMT');
        expect(screen.getByText(/mocked icon/i)).toBeInTheDocument();
        expect(screen.getByText(/csstransitionelement/i)).toBeInTheDocument();
    });
    it('should render TimePickerDialog if input is clicked', () => {
        render(mockTimePicker());
        userEvent.click(screen.getByRole('textbox'));
        expect(screen.getByText(/timepickerdialog/i)).toBeInTheDocument();
    });
    it('should render native html input if is_native_picker is true', () => {
        mocked_props.is_nativepicker = true;
        render(mockTimePicker());
        const input = screen.getByTestId('dt_testTimePicker_input');
        expect(input).toHaveValue('23:45');
        expect(input).toHaveAttribute('min', '08:00');
        expect(input).toHaveAttribute('max', '12:00');
    });
});
