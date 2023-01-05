import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Icon } from '@deriv/components';
import IconMessageList from '../icon-message-list';

jest.mock('@deriv/components', () => {
    const original_module = jest.requireActual('@deriv/components');
    return {
        ...original_module,
        Icon: jest.fn(props => <div data-testid='mocked_icon'>{props.icon}</div>),
    };
});
describe('<IconMessageList/>', () => {
    const messages_list = ['Sample Text1', 'Sample Text2', 'Sample Text3', 'Sample Text4'];
    it('should render IconMessageList component', () => {
        render(<IconMessageList />);
        expect(screen.getByTestId('dt_icon_message_list')).toBeInTheDocument();
    });

    it('should render icon passed to the component', () => {
        render(<IconMessageList icon={<Icon icon='sampleIcon' />} />);
        expect(screen.getByTestId('mocked_icon')).toBeInTheDocument();
    });
    it('should show message passed to the component', () => {
        render(<IconMessageList message={'Lorem Ipsom'} />);
        expect(screen.getByText(/lorem ipsom/i)).toBeInTheDocument();
    });
    it('when the length of message_list is less than 3, it should show messages with icons ', () => {
        render(<IconMessageList message_list={['Sample Text1', 'Sample Text2']} />);
        expect(screen.getByText(/Sample Text1/i)).toBeInTheDocument();
        expect(screen.getByText(/Sample Text2/i)).toBeInTheDocument();
        expect(screen.getAllByText(/icclosecircle/i).length).toBe(2);
    });

    it('should show first 3 msgs and show_more_btn when the message_list is more than 3', () => {
        render(<IconMessageList message_list={messages_list} />);
        expect(screen.getByText(/sample text1/i)).toBeInTheDocument();
        expect(screen.getByText(/sample text2/i)).toBeInTheDocument();
        expect(screen.getByText(/sample text3/i)).toBeInTheDocument();
        expect(screen.queryByText(/sample text4/i)).not.toBeInTheDocument();
        expect(
            screen.getByRole('button', {
                name: /show more/i,
            })
        ).toBeInTheDocument();
        expect(
            screen.queryByRole('button', {
                name: /show less/i,
            })
        ).not.toBeInTheDocument();
    });

    it('should show all messages and show_less_btn when show_more btn is clicked', () => {
        render(<IconMessageList message_list={messages_list} />);

        const show_more_btn = screen.getByRole('button', {
            name: /show more/i,
        });

        fireEvent.click(show_more_btn);
        expect(screen.getByText(/sample text1/i)).toBeInTheDocument();
        expect(screen.getByText(/sample text2/i)).toBeInTheDocument();
        expect(screen.getByText(/sample text3/i)).toBeInTheDocument();
        expect(screen.getByText(/sample text4/i)).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /show less/i })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /show more/i })).not.toBeInTheDocument();
    });

    it('should show continue_btn if OnContinue is passed', () => {
        const onContinuefn = jest.fn();
        render(<IconMessageList message_list={['Sample Text1']} onContinue={onContinuefn} />);
        const upload_btn = screen.queryByRole('button', { name: /upload document/i });
        expect(upload_btn).toBeInTheDocument();
        fireEvent.click(upload_btn);
        expect(onContinuefn).toHaveBeenCalled();
    });
});
