import React from 'react';
import { screen, render, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ApiTokenContext from '../api-token-context';
import ApiTokenDeleteButton from '../api-token-delete-button';

const modal_root_el = document.createElement('div');
modal_root_el.setAttribute('id', 'modal_root');
document.body.appendChild(modal_root_el);

describe('ApiTokenDeleteButton', () => {
    const mock_props = {
        api_tokens: undefined,
        deleteToken: jest.fn(() => Promise.resolve()),
        footer_ref: document.createElement('div'),
        overlay_ref: document.createElement('div'),
        toggleOverlay: jest.fn(),
    };
    const mock_token = {
        token: {
            display_name: 'Token 1',
            last_used: '12/31/2022',
            scopes: ['read', 'trade'],
            token: '1234567',
        },
    };

    const renderAPiDeleteButton = () => {
        render(
            <ApiTokenContext.Provider value={mock_props}>
                <ApiTokenDeleteButton {...mock_token} />
            </ApiTokenContext.Provider>
        );
    };

    it('should render ApiTokenDeleteButton', () => {
        renderAPiDeleteButton();
        expect(screen.getByTestId('dt_token_delete_icon')).toBeInTheDocument();
        expect(screen.queryByText('Delete this token')).not.toBeInTheDocument();
    });

    it('should display Delete this token when mouse enter', () => {
        renderAPiDeleteButton();
        const delete_icon = screen.getByTestId('dt_token_delete_icon');
        userEvent.hover(delete_icon);
        expect(screen.getByText('Delete this token')).toBeInTheDocument();
    });

    it('should not Delete this token when mouse leave', () => {
        renderAPiDeleteButton();
        const delete_icon = screen.getByTestId('dt_token_delete_icon');
        userEvent.hover(delete_icon);
        expect(screen.getByText('Delete this token')).toBeInTheDocument();
        userEvent.unhover(delete_icon);
        expect(screen.queryByText('Delete this token')).not.toBeInTheDocument();
    });

    it('should display Popup when delete icon is clicked', () => {
        renderAPiDeleteButton();
        const delete_icon = screen.getByTestId('dt_token_delete_icon');
        userEvent.click(delete_icon);
        expect(screen.getByText('Delete token')).toBeInTheDocument();
        expect(screen.getByText('Are you sure you want to delete this token?')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Yes, delete' })).toBeInTheDocument();
    });

    it('should close the modal when clicked on Cancel', async () => {
        renderAPiDeleteButton();
        const delete_icon = screen.getByTestId('dt_token_delete_icon');
        userEvent.click(delete_icon);
        expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
        const cancel_button = screen.getByRole('button', { name: 'Cancel' });
        userEvent.click(cancel_button);
        await waitFor(() => expect(screen.queryByText('Delete token')).not.toBeInTheDocument());
        expect(screen.queryByText('Are you sure you want to delete this token?')).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Cancel' })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Yes, delete' })).not.toBeInTheDocument();
    });

    it('should should trigger deleteToken when clicked on Yes, delete', async () => {
        renderAPiDeleteButton();
        const delete_icon = screen.getByTestId('dt_token_delete_icon');
        userEvent.click(delete_icon);
        expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
        const delete_token_button = screen.getByRole('button', { name: 'Yes, delete' });
        act(() => {
            userEvent.click(delete_token_button);
        });
        expect(mock_props.deleteToken).toBeCalled();
    });
});
