import React from 'react';
import { screen, render } from '@testing-library/react';
import { Icon } from '@deriv/components';
import IconMessageContent from '../icon-message-content';
import { mockStore, StoreProvider } from '@deriv/stores';

jest.mock('@deriv/components', () => {
    const original_module = jest.requireActual('@deriv/components');
    return {
        ...original_module,
        Icon: jest.fn(() => <div data-testid='mockedIcon' />),
    };
});

describe('<IconMessageContent />', () => {
    const props = {
        icon: <Icon icon='sampleIcon' />,
        message: 'sampleMessage',
        text: 'sampleText',
    };

    const mock_store = mockStore({
        ui: {
            is_desktop: true,
        },
    });

    it('should render the IconWithMessage component', () => {
        render(
            <StoreProvider store={mock_store}>
                <IconMessageContent {...props} />
            </StoreProvider>
        );

        expect(screen.getByTestId('mockedIcon')).toBeInTheDocument();
        expect(screen.getByText('sampleMessage')).toBeInTheDocument();
        expect(screen.getByText('sampleText')).toBeInTheDocument();
    });

    it('renders the children', () => {
        render(
            <StoreProvider store={mock_store}>
                <IconMessageContent {...props}>
                    <div>test</div>
                </IconMessageContent>
            </StoreProvider>
        );
        expect(screen.getByText('test')).toBeInTheDocument();
    });
});
