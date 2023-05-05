import React from 'react';
import { render, screen, within } from '@testing-library/react';
import SuccessDialog from '../success-dialog';
import userEvent from '@testing-library/user-event';

type TModal = React.FC<{
    children: React.ReactNode;
    is_open: boolean;
    has_close_icon: boolean;
    toggleModal: () => void;
    title: string;
}> & {
    Body?: React.FC<{
        children: React.ReactNode;
    }>;
    Footer?: React.FC<{
        children: React.ReactNode;
    }>;
};

jest.mock('@deriv/components', () => {
    const original_module = jest.requireActual('@deriv/components');
    const Icon = jest.fn(() => <div>Checkmark</div>);
    const Modal: TModal = jest.fn(({ children, is_open, has_close_icon, toggleModal, title }) => {
        if (is_open)
            return (
                <div data-testid='modal'>
                    <h3>{title}</h3>
                    {has_close_icon && <span onClick={toggleModal}>IcCross</span>}
                    {children}
                </div>
            );

        return null;
    });
    Modal.Body = jest.fn(({ children }) => <div>{children}</div>);
    Modal.Footer = jest.fn(({ children }) => <div>{children}</div>);

    return {
        ...original_module,
        Modal,
        Icon,
    };
});

describe('<SuccessDialog />', () => {
    const modal_root_el = document.createElement('div');
    modal_root_el.setAttribute('id', 'modal_root');
    document.body.appendChild(modal_root_el);
    const mock_message = 'mockMessage';

    let props: React.ComponentProps<typeof SuccessDialog>;
    beforeEach(() => {
        props = {
            classNameMessage: 'classNameMessage',
            has_cancel: false,
            has_submit: true,
            icon: <div>Icon</div>,
            message: mock_message,
            heading: '',
            is_open: true,
            toggleModal: jest.fn(() => {
                props.is_open = !props.is_open;
            }),
            title: 'mockTitle',
            text_cancel: 'Cancel',
            text_submit: 'Submit',
            has_close_icon: true,
            width: '384px',
        };
    });
    it('should return null when is_open is false', () => {
        props.is_open = false;
        const { container } = render(<SuccessDialog {...props} />);
        expect(container).toBeEmptyDOMElement();
    });
    it('should close after close button (IcCross) is clicked in the modal', () => {
        const { rerender } = render(<SuccessDialog {...props} />);
        const close_icon = within(screen.getByTestId('modal')).getByText('IcCross');
        userEvent.click(close_icon);
        expect(props.toggleModal).toBeCalled();
        expect(props.is_open).toBeFalsy();

        rerender(<SuccessDialog {...props} />);
        expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });
    it('should render title, icon and checkmark', () => {
        render(<SuccessDialog {...props} />);
        expect(screen.getByText('mockTitle')).toBeInTheDocument();
        expect(screen.getByText('Icon')).toBeInTheDocument();
        expect(screen.getByText('Checkmark')).toBeInTheDocument();
    });
    it('should render Success! message when heading is empty', () => {
        render(<SuccessDialog {...props} />);
        expect(screen.getByText(/success!/i)).toBeInTheDocument();
    });
    it('should not render Success message when heading is not empty', () => {
        props.heading = 'MockHeading';
        render(<SuccessDialog {...props} />);
        expect(screen.queryByText(/success!/i)).not.toBeInTheDocument();
        expect(screen.getByText(/mockheading/i)).toBeInTheDocument();
    });
    it('should render the mockMessage when message is a string', () => {
        render(<SuccessDialog {...props} />);
        expect(screen.getByText(mock_message)).toBeInTheDocument();
        expect(screen.getByText(mock_message)).toHaveClass('classNameMessage');
    });
    it('should not render when the mockMessage when message is an element', () => {
        props.message = <div>mockMessage</div>;
        render(<SuccessDialog {...props} />);
        expect(screen.getByText(mock_message)).not.toHaveClass('classNameMessage');
    });
    it('should not render Cancel Button when has_cancel = false and Submit button should be rendered when has_submit = true', () => {
        render(<SuccessDialog {...props} />);
        expect(screen.getByText(/submit/i)).toBeInTheDocument();
        expect(screen.queryByText(/cancel/i)).not.toBeInTheDocument();
    });
    it('should be rendered when has_cancel = true ', () => {
        props.has_cancel = true;
        render(<SuccessDialog {...props} />);
        expect(screen.getByText(/cancel/i)).toBeInTheDocument();
    });

    it('should not be rendered when has_submit = false', () => {
        props.has_submit = false;
        render(<SuccessDialog {...props} />);
        expect(screen.queryByText(/submit/i)).not.toBeInTheDocument();
    });
    it('should render Maybe Later when text_cancel is empty string and has_cancel is true', () => {
        props.has_cancel = true;
        props.text_cancel = '';
        render(<SuccessDialog {...props} />);
        expect(screen.getByText(/maybe later/i)).toBeInTheDocument();
    });
});
