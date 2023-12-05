import React from 'react';
import { render, screen } from '@testing-library/react';
import ListItem from '../list-item';
import { StoreProvider, mockStore } from '@deriv/stores';

describe('<ListItem/>', () => {
    const store_config = mockStore({});

    const renderComponent = (props: React.ComponentProps<typeof ListItem>) =>
        render(
            <StoreProvider store={store_config}>
                <ListItem {...props} />
            </StoreProvider>
        );

    it('should render ListItem component', () => {
        renderComponent({ text: 'test' });
        expect(screen.getByText('test')).toBeInTheDocument();
    });

    it('should render ListItem component with index', () => {
        renderComponent({ text: 'test', index: 1 });
        expect(screen.getByText('1.')).toBeInTheDocument();
        expect(screen.getByText('test')).toBeInTheDocument();
    });
});
