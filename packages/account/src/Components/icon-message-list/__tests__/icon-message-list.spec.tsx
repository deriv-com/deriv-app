import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Icon } from '@deriv/components';
import { StoreProvider, mockStore } from '@deriv/stores';
import IconMessageList from '../icon-message-list';

jest.mock('@deriv/components', () => {
    const original_module = jest.requireActual('@deriv/components');
    return {
        ...original_module,
        Icon: jest.fn(props => <div data-testid='mocked_icon'>{props.icon}</div>),
    };
});
describe('<IconMessageList/>', () => {
    const messages_list = ['DataComparisonDocumentNumbers', 'CompromisedDocument', 'VisualAuthenticityFonts'];

    const mock_props: React.ComponentProps<typeof IconMessageList> = {
        icon: <Icon icon='sampleIcon' />,
        message: 'Lorem Ipsom',
        message_list: messages_list,
        onContinue: jest.fn(),
    };

    const store_config = mockStore({ ui: { is_desktop: true } });

    const renderComponent = ({ props = mock_props, store = store_config }) =>
        render(
            <StoreProvider store={store}>
                <IconMessageList {...props} />
            </StoreProvider>
        );

    it('should render IconMessageList component', () => {
        renderComponent({});
        expect(screen.getByTestId('dt_icon_message_list')).toBeInTheDocument();
    });

    it('should render icon passed to the component', () => {
        renderComponent({});
        expect(screen.getByText('sampleIcon')).toBeInTheDocument();
        expect(screen.getByText('IcAlertDanger')).toBeInTheDocument();
    });

    it('should show message passed to the component', () => {
        renderComponent({});
        expect(screen.getByText(/lorem ipsom/i)).toBeInTheDocument();
    });

    it('should render the messages based on Onfido Error codes', () => {
        const new_props = {
            ...mock_props,
            message_list: ['DataComparisonDocumentNumbers', 'CompromisedDocument'],
        };
        renderComponent({ props: new_props });
        expect(screen.getByText('Your document appears to be invalid.')).toBeInTheDocument();
        expect(screen.getByText('Your document failed our verification checks.')).toBeInTheDocument();
    });

    it('should show continue_btn if OnContinue is passed', () => {
        const onContinuefn = jest.fn();
        const new_props = {
            ...mock_props,
            messages_list: ['DataComparisonDocumentNumbers'],
            onContinue: onContinuefn,
        };
        renderComponent({ props: new_props });
        const upload_btn = screen.queryByRole('button', { name: /verify again/i });
        expect(upload_btn).toBeInTheDocument();
        if (upload_btn) {
            userEvent.click(upload_btn);
        }
        expect(onContinuefn).toHaveBeenCalled();
    });
});
