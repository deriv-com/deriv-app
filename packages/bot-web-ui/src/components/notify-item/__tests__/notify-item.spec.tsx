// eslint-disable-next-line import/no-extraneous-dependencies
import { render, screen } from '@testing-library/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import userEvent from '@testing-library/user-event';
import { getIcon, messageWithButton, messageWithImage } from '../notify-item';

const messageWithButtonMockProps = {
    unique_id: '123',
    type: 'error',
    message: 'sample text',
    btn_text: 'ok',
    onClick: jest.fn(),
};

describe('messageWithButtonMockProps', () => {
    it('should render messageWithButton', () => {
        const { container } = render(messageWithButton({ ...messageWithButtonMockProps }));
        expect(container).toBeInTheDocument();
        expect(screen.getByText('sample text')).toBeInTheDocument();
    });

    it('should call function of the button on click of the button', () => {
        render(messageWithButton({ ...messageWithButtonMockProps }));
        userEvent.click(screen.getByRole('button'));
        expect(messageWithButtonMockProps.onClick).toHaveBeenCalled();
    });

    it('should get appropriate icon when getIcon is called', () => {
        expect(getIcon('warn')).toEqual('IcAlertWarning');
        expect(getIcon('info')).toEqual('IcAlertInfo');
        expect(getIcon('error')).toEqual('IcAlertDanger');
        expect(getIcon('')).toEqual('IcAlertWarning');
    });

    it('should render messageWithImage', () => {
        const { container } = render(messageWithImage('sample text', ''));
        expect(container).toBeInTheDocument();
        expect(screen.getByText('sample text')).toBeInTheDocument();
        expect(screen.getByRole('img')).toBeInTheDocument();
    });
});
