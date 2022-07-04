import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { getPropertyValue, isDesktop, isMobile, useIsMounted } from '@deriv/shared';
import ApiToken from '../api-token';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    getPropertyValue: jest.fn().mockReturnValue([]),
    isDesktop: jest.fn(() => true),
    isMobile: jest.fn(() => false),
    useIsMounted: jest.fn().mockImplementation(() => () => true),
}));

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Loading: () => <div>Loading</div>,
}));

describe('<ApiToken/>', () => {
    const admin_description = 'Open accounts, manage settings, manage token usage, and more.';
    const learn_more_title = 'Learn more about API token';
    const our_access_description =
        "To access our mobile apps and other third-party apps, you'll first need to generate an API token.";
    const payments_description = 'Withdraw to payment agents, and transfer funds between accounts.';
    const select_scopes_msg = 'Select scopes based on the access you need.';
    const token_creation_description = "Name your token and click on 'Create' to generate your token.";
    const token_using_description = 'Copy and paste the token into the app.';
    const trade_description = 'Buy and sell contracts, renew expired purchases, and top up demo accounts.';
    const trading_info_description = 'View the trading history.';
    const view_activity_msg =
        'View account activity such as settings, limits, balance sheets, trade purchase history, and more.';
    const your_access_description =
        "To access your mobile apps and other third-party apps, you'll first need to generate an API token.";

    const mock_props = {
        footer_ref: undefined,
        is_app_settings: false,
        is_switching: false,
        overlay_ref: undefined,
        setIsOverlayShown: jest.fn(),
        ws: {
            apiToken: jest.fn(() =>
                Promise.resolve({
                    api_token: {
                        tokens: [],
                    },
                })
            ),
            authorized: {
                apiToken: jest.fn(() =>
                    Promise.resolve({
                        api_token: {
                            tokens: [],
                        },
                    })
                ),
            },
        },
    };

    it('should render ApiToken component without app_settings and footer', async () => {
        render(<ApiToken {...mock_props} />);

        expect(mock_props.ws.authorized.apiToken).toHaveBeenCalled();

        expect(await screen.findByText(admin_description)).toBeInTheDocument();
        expect(await screen.findByText(payments_description)).toBeInTheDocument();
        expect(await screen.findByText(select_scopes_msg)).toBeInTheDocument();
        expect(await screen.findByText(token_creation_description)).toBeInTheDocument();
        expect(await screen.findByText(token_using_description)).toBeInTheDocument();
        expect(await screen.findByText(trade_description)).toBeInTheDocument();
        expect(await screen.findByText(trading_info_description)).toBeInTheDocument();
        expect(await screen.findByText(your_access_description)).toBeInTheDocument();
        expect(await screen.findByText(view_activity_msg)).toBeInTheDocument();
        expect(screen.queryByText(learn_more_title)).not.toBeInTheDocument();
    });

    it('should not render ApiToken component if is not mounted', () => {
        useIsMounted.mockImplementationOnce(() => () => false);

        render(<ApiToken {...mock_props} />);

        expect(mock_props.ws.authorized.apiToken).toHaveBeenCalled();
        expect(screen.getByText('Loading')).toBeInTheDocument();

        expect(screen.queryByText(admin_description)).not.toBeInTheDocument();
        expect(screen.queryByText(learn_more_title)).not.toBeInTheDocument();
        expect(screen.queryByText(payments_description)).not.toBeInTheDocument();
        expect(screen.queryByText(select_scopes_msg)).not.toBeInTheDocument();
        expect(screen.queryByText(token_creation_description)).not.toBeInTheDocument();
        expect(screen.queryByText(token_using_description)).not.toBeInTheDocument();
        expect(screen.queryByText(trade_description)).not.toBeInTheDocument();
        expect(screen.queryByText(trading_info_description)).not.toBeInTheDocument();
        expect(screen.queryByText(your_access_description)).not.toBeInTheDocument();
        expect(screen.queryByText(view_activity_msg)).not.toBeInTheDocument();
    });

    it('should render ApiToken component without app_settings and footer for mobile', async () => {
        isMobile.mockReturnValueOnce(true);
        isDesktop.mockReturnValueOnce(false);

        render(<ApiToken {...mock_props} />);

        expect(await screen.findByText(admin_description)).toBeInTheDocument();
        expect(await screen.findByText(payments_description)).toBeInTheDocument();
        expect(await screen.findByText(select_scopes_msg)).toBeInTheDocument();
        expect(await screen.findByText(token_creation_description)).toBeInTheDocument();
        expect(await screen.findByText(token_using_description)).toBeInTheDocument();
        expect(await screen.findByText(trade_description)).toBeInTheDocument();
        expect(await screen.findByText(trading_info_description)).toBeInTheDocument();
        expect(await screen.findByText(view_activity_msg)).toBeInTheDocument();
        expect(screen.queryByText(learn_more_title)).not.toBeInTheDocument();
    });

    it('should render ApiToken component with app_settings', async () => {
        mock_props.is_app_settings = true;

        render(<ApiToken {...mock_props} />);

        await waitFor(() => {
            expect(screen.queryByText(our_access_description)).not.toBeInTheDocument();
        });
    });

    it('should render ApiTokenFooter, show and close ApiTokenOverlay after triggering links', async () => {
        const footer_portal_root_el = document.createElement('div');
        document.body.appendChild(footer_portal_root_el);
        const overlay_portal_root_el = document.createElement('div');
        document.body.appendChild(overlay_portal_root_el);

        mock_props.footer_ref = footer_portal_root_el;
        mock_props.overlay_ref = overlay_portal_root_el;

        render(<ApiToken {...mock_props} />);

        expect(await screen.findByText(learn_more_title)).toBeInTheDocument();
        expect(screen.queryByText(our_access_description)).not.toBeInTheDocument();

        fireEvent.click(await screen.findByText(learn_more_title));
        expect(await screen.findByText(our_access_description)).toBeInTheDocument();

        fireEvent.click(await screen.findByRole('button', { name: /done/i }));
        expect(screen.queryByText(our_access_description)).not.toBeInTheDocument();

        document.body.removeChild(footer_portal_root_el);
        document.body.removeChild(overlay_portal_root_el);
    });

    it('should choose checkbox, enter a valid value and create token', async () => {
        render(<ApiToken {...mock_props} />);

        expect(screen.queryByText('New token name')).not.toBeInTheDocument();

        const checkboxes = await screen.findAllByRole('checkbox');
        const create_btn = await screen.findByRole('button');
        const read_checkbox = checkboxes.find(card => card.name === 'read');
        const token_name_input = await screen.findByLabelText('Token name');

        expect(checkboxes.length).toBe(5);
        expect(create_btn).toBeDisabled();
        expect(read_checkbox.checked).toBeFalsy();
        expect(token_name_input.value).toBe('');

        fireEvent.click(read_checkbox);
        expect(read_checkbox.checked).toBeTruthy();

        fireEvent.change(token_name_input, { target: { value: '@#$' } });
        expect(await screen.findByText('Only letters, numbers, and underscores are allowed.')).toBeInTheDocument();

        fireEvent.change(token_name_input, { target: { value: 'N' } });
        expect(await screen.findByText(/length of token name must be between/i)).toBeInTheDocument();

        fireEvent.change(token_name_input, { target: { value: 'New test extra long name for erorr' } });
        expect(await screen.findByText(/maximum/i)).toBeInTheDocument();

        fireEvent.change(token_name_input, { target: { value: 'New token name' } });
        await waitFor(() => {
            expect(token_name_input.value).toBe('New token name');
        });
        expect(create_btn).toBeEnabled();

        fireEvent.click(create_btn);
        const updated_token_name_input = await screen.findByLabelText('Token name');
        expect(updated_token_name_input.value).toBe('');

        const createToken = mock_props.ws.apiToken;
        expect(createToken).toHaveBeenCalledTimes(1);
    });

    it('should render created tokens and trigger delete', async () => {
        jest.useFakeTimers();

        getPropertyValue.mockReturnValue([
            {
                display_name: 'First test token',
                last_used: '',
                scopes: ['Read', 'Trade'],
                token: 'GBjsG2kM1uxtJtk',
                valid_for_ip: '',
            },
            {
                display_name: 'Second test token',
                last_used: '',
                scopes: ['Read', 'Payments', 'rade'],
                token: 'GHjaD2f4gDg5gSE',
                valid_for_ip: '',
            },
        ]);

        render(<ApiToken {...mock_props} />);

        expect(await screen.findByText('Action')).toBeInTheDocument();
        expect(await screen.findByText('First test token')).toBeInTheDocument();
        expect(await screen.findByText('Last used')).toBeInTheDocument();
        expect(await screen.findByText('Name')).toBeInTheDocument();
        expect(await screen.findByText('Token')).toBeInTheDocument();
        expect(await screen.findByText('Scopes')).toBeInTheDocument();
        expect(await screen.findByText('Second test token')).toBeInTheDocument();

        const delete_btns_1 = await screen.findAllByRole('button', { name: /delete/i });
        expect(delete_btns_1.length).toBe(2);

        fireEvent.click(delete_btns_1[0]);
        const delete_btns_2 = await screen.findAllByRole('button', { name: /delete/i });
        expect(delete_btns_2.length).toBe(1);
        const no_btn_1 = screen.getByRole('button', { name: /no/i });
        expect(no_btn_1).toBeInTheDocument();

        fireEvent.click(no_btn_1);
        expect(no_btn_1).not.toBeInTheDocument();

        const delete_btns_3 = await screen.findAllByRole('button', { name: /delete/i });
        expect(delete_btns_3.length).toBe(2);

        fireEvent.click(delete_btns_3[0]);
        const yes_btn_1 = screen.getByRole('button', { name: /yes/i });
        expect(yes_btn_1).toBeInTheDocument();

        fireEvent.click(yes_btn_1);
        const deleteToken = mock_props.ws.authorized.apiToken;
        expect(deleteToken).toHaveBeenCalled();
        const delete_btns_4 = await screen.findAllByRole('button', { name: /delete/i });
        expect(delete_btns_4.length).toBe(1);

        fireEvent.click(delete_btns_4[0]);
        const no_btn_2 = screen.getByRole('button', { name: /no/i });
        expect(no_btn_2).toBeInTheDocument();
        const yes_btn_2 = screen.getByRole('button', { name: /yes/i });
        expect(yes_btn_2).toBeInTheDocument();

        act(() => jest.advanceTimersByTime(10000));

        expect(no_btn_2).not.toBeInTheDocument();
        expect(yes_btn_2).not.toBeInTheDocument();
    });

    it('should render created tokens for mobile', async () => {
        isMobile.mockReturnValue(true);
        isDesktop.mockReturnValue(false);

        getPropertyValue.mockReturnValue([
            {
                display_name: 'First test token',
                last_used: '',
                scopes: ['Read', 'Trade'],
                token: 'FirstTokenID',
                valid_for_ip: '',
            },
            {
                display_name: 'Second test token',
                last_used: '',
                scopes: ['Read', 'Trade', 'Payments', 'Admin', 'Trading information'],
                token: 'SecondTokenID',
                valid_for_ip: '',
            },
            {
                display_name: 'Third test token',
                last_used: '03/02/2022',
                scopes: ['Read', 'Trade', 'Payments', 'Admin'],
                token: 'ThirdTokenID',
                valid_for_ip: '',
            },
        ]);

        render(<ApiToken {...mock_props} />);

        expect((await screen.findAllByText('Name')).length).toBe(3);
        expect((await screen.findAllByText('Last Used')).length).toBe(3);
        expect((await screen.findAllByText('Token')).length).toBe(3);
        expect((await screen.findAllByText('Scope')).length).toBe(3);
        expect(await screen.findByText('First test token')).toBeInTheDocument();
        expect(await screen.findByText('Second test token')).toBeInTheDocument();
        expect(await screen.findByText('SecondTokenID')).toBeInTheDocument();
        expect(screen.queryByText('Action')).not.toBeInTheDocument();
        expect(screen.queryByText('Scopes')).not.toBeInTheDocument();
        const all_scopes = await screen.findAllByText('All');
        expect(all_scopes.length).toBe(1);
        const never_used = await screen.findAllByText('Never');
        expect(never_used.length).toBe(2);
    });

    it('should show token error if exists', async () => {
        mock_props.ws.authorized.apiToken = jest.fn(() =>
            Promise.resolve({
                api_token: { tokens: [] },
                error: { message: 'New test error' },
            })
        );

        getPropertyValue.mockReturnValue('New test error');

        render(<ApiToken {...mock_props} />);

        expect(await screen.findByText('New test error')).toBeInTheDocument();
    });
});
