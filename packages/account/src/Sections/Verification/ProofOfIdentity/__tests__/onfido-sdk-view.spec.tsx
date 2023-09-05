import React from 'react';
import { act, render, screen } from '@testing-library/react';
import OnfidoSdkView from '../onfido-sdk-view';

jest.mock('react-transition-group', () => {
    const FakeTransition = jest.fn(({ children }) => children);
    const FakeCSSTransition = jest.fn(({ children, ...props }) =>
        props.in && props.appear ? <FakeTransition>{children}</FakeTransition> : null
    );
    return { CSSTransition: FakeCSSTransition };
});

describe('<OnfidoSdkView/>', () => {
    const mock_props = {
        data_testid: 'dt_onfido_element',
        is_confirmed: false,
        is_onfido_container_hidden: false,
        is_onfido_initialized: true,
        is_onfido_disabled: true,
    };

    const hint_message = 'Hit the checkbox above to choose your document.';
    const success_message = 'Your personal details have been saved successfully.';

    it('should render OnfidoSdkView component with disabled onfido', () => {
        render(<OnfidoSdkView {...mock_props} />);

        const onfido_el = screen.getByTestId(mock_props.data_testid);
        expect(onfido_el).toBeInTheDocument();
        expect(onfido_el).toHaveClass('onfido-container__disabled');
        expect(screen.getByText(hint_message)).toBeInTheDocument();
        expect(screen.queryByText(success_message)).not.toBeInTheDocument();
    });

    it('should render OnfidoSdkView component after confirming the form and show success message for 5 seconds', () => {
        jest.useFakeTimers();

        mock_props.is_confirmed = true;
        mock_props.is_onfido_disabled = false;

        render(<OnfidoSdkView {...mock_props} />);

        const onfido_el = screen.getByTestId(mock_props.data_testid);
        expect(onfido_el).toBeInTheDocument();
        expect(onfido_el).not.toHaveClass('onfido-container__disabled');
        expect(screen.queryByText(hint_message)).not.toBeInTheDocument();
        expect(screen.queryByText(success_message)).not.toBeInTheDocument();

        act(() => {
            jest.advanceTimersByTime(800);
        });

        expect(screen.queryByText(hint_message)).not.toBeInTheDocument();
        expect(screen.getByText(success_message)).toBeInTheDocument();

        act(() => {
            jest.advanceTimersByTime(5000);
        });

        expect(screen.queryByText(hint_message)).not.toBeInTheDocument();
        expect(screen.queryByText(success_message)).not.toBeInTheDocument();

        jest.useRealTimers();
    });
});
