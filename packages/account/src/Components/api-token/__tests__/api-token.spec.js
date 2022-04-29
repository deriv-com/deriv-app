import React from 'react';
import { act } from 'react-dom/test-utils';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { isDesktop, isMobile, getPropertyValue, useIsMounted } from '@deriv/shared';

import ApiToken from '../api-token';

const footer_portal_root = document.createElement('div');
document.body.appendChild(footer_portal_root);
const overlay_portal_root = document.createElement('div');
document.body.appendChild(overlay_portal_root);

jest.mock('Stores/connect.js', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    getPropertyValue: jest.fn().mockReturnValue([]),
    isMobile: jest.fn(),
    isDesktop: jest.fn(),
    useIsMounted: jest.fn().mockImplementation(() => () => true),
}));

describe('<ApiToken/>', () => {
    const access_description =
        "To access our mobile apps and other third-party apps, you'll first need to generate an API token.";

    let mock_props = {};

    beforeEach(() => {
        isMobile.mockReturnValue(false);
        isDesktop.mockReturnValue(true);

        mock_props = {
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
    });

    const renderCheck = async () => {
        await waitFor(() => {});
    };

    it('should render ApiToken component without app_settings and footer', async () => {
        render(<ApiToken {...mock_props} />);

        expect(mock_props.ws.authorized.apiToken).toHaveBeenCalled();
        expect(
            await screen.findByText(
                "To access your mobile apps and other third-party apps, you'll first need to generate an API token."
            )
        ).toBeInTheDocument();
        expect(await screen.findByText('Select scopes based on the access you need.')).toBeInTheDocument();
        expect(
            await screen.findByText(
                'View account activity such as settings, limits, balance sheets, trade purchase history, and more.'
            )
        ).toBeInTheDocument();
        expect(
            await screen.findByText('Buy and sell contracts, renew expired purchases, and top up demo accounts.')
        ).toBeInTheDocument();
        expect(
            await screen.findByText('Withdraw to payment agents, and transfer funds between accounts.')
        ).toBeInTheDocument();
        expect(
            await screen.findByText('Open accounts, manage settings, manage token usage, and more.')
        ).toBeInTheDocument();
        expect(await screen.findByText('View the trading history.')).toBeInTheDocument();
        expect(
            await screen.findByText("Name your token and click on 'Create' to generate your token.")
        ).toBeInTheDocument();
        expect(await screen.findByText('Copy and paste the token into the app.')).toBeInTheDocument();

        expect(screen.queryByText('Learn more about API token')).not.toBeInTheDocument();
    });

    it('should not render ApiToken component if is not mounted', async () => {
        useIsMounted.mockImplementationOnce(() => () => false);

        const { container } = render(<ApiToken {...mock_props} />);

        expect(mock_props.ws.authorized.apiToken).toHaveBeenCalled();
        expect(
            screen.queryByText(
                "To access your mobile apps and other third-party apps, you'll first need to generate an API token."
            )
        ).not.toBeInTheDocument();
        expect(screen.queryByText('Select scopes based on the access you need.')).not.toBeInTheDocument();
        expect(
            screen.queryByText("Name your token and click on 'Create' to generate your token.")
        ).not.toBeInTheDocument();
        expect(screen.queryByText('Copy and paste the token into the app.')).not.toBeInTheDocument();

        const loader = container.querySelector('.initial-loader');
        expect(loader).toBeInTheDocument();
    });

    it('should render ApiToken component without app_settings and footer for mobile', async () => {
        isMobile.mockReturnValueOnce(true);
        isDesktop.mockReturnValueOnce(false);

        render(<ApiToken {...mock_props} />);

        expect(await screen.findByText('Select scopes based on the access you need.')).toBeInTheDocument();
        expect(
            await screen.findByText(
                'View account activity such as settings, limits, balance sheets, trade purchase history, and more.'
            )
        ).toBeInTheDocument();
        expect(
            await screen.findByText('Buy and sell contracts, renew expired purchases, and top up demo accounts.')
        ).toBeInTheDocument();
        expect(
            await screen.findByText('Withdraw to payment agents, and transfer funds between accounts.')
        ).toBeInTheDocument();
        expect(
            await screen.findByText('Open accounts, manage settings, manage token usage, and more.')
        ).toBeInTheDocument();
        expect(await screen.findByText('View the trading history.')).toBeInTheDocument();
        expect(
            await screen.findByText("Name your token and click on 'Create' to generate your token.")
        ).toBeInTheDocument();
        expect(await screen.findByText('Copy and paste the token into the app.')).toBeInTheDocument();

        expect(screen.queryByText('Learn more about API token')).not.toBeInTheDocument();
    });

    it('should render ApiToken component with app_settings', async () => {
        mock_props.is_app_settings = true;

        render(<ApiToken {...mock_props} />);

        expect(screen.queryByText(access_description)).not.toBeInTheDocument();
    });

    it('should render ApiTokenFooter, show and close ApiTokenOverlay after triggering links', async () => {
        mock_props.footer_ref = footer_portal_root;
        mock_props.overlay_ref = overlay_portal_root;

        render(<ApiToken {...mock_props} />);

        expect(await screen.findByText('Learn more about API token')).toBeInTheDocument();
        expect(screen.queryByText(access_description)).not.toBeInTheDocument();

        fireEvent.click(await screen.findByText('Learn more about API token'));

        expect(await screen.findByText(access_description)).toBeInTheDocument();

        fireEvent.click(await screen.findByText('Done'));
        expect(screen.queryByText(access_description)).not.toBeInTheDocument();
    });

    it('should choose checkbox, enter a valid value and create token', async () => {
        render(<ApiToken {...mock_props} />);

        expect(screen.queryByText('New token name')).not.toBeInTheDocument();

        const checkboxes = await screen.findAllByRole('checkbox');
        const read_checkbox = checkboxes.find(card => card.name === 'read');
        const create_btn = await screen.findByRole('button');
        const token_name_input = await screen.findByLabelText('Token name');

        expect(checkboxes.length).toBe(5);
        expect(read_checkbox.checked).toBeFalsy();
        expect(create_btn).toBeDisabled();
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

        expect(token_name_input.value).toBe('New token name');

        await waitFor(() => {
            expect(create_btn).toBeEnabled();
        });

        fireEvent.click(create_btn);

        const updated_token_name_input = await screen.findByLabelText('Token name');
        expect(updated_token_name_input.value).toBe('');

        const createToken = mock_props.ws.apiToken;
        expect(createToken).toHaveBeenCalledTimes(1);
    });

    it('should render created tokens and trigger delete', async () => {
        jest.setTimeout(11000);

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

        expect(await screen.findByText('Name')).toBeInTheDocument();
        expect(await screen.findByText('Token')).toBeInTheDocument();
        expect(await screen.findByText('Scopes')).toBeInTheDocument();
        expect(await screen.findByText('Last used')).toBeInTheDocument();
        expect(await screen.findByText('Action')).toBeInTheDocument();
        expect(await screen.findByText('First test token')).toBeInTheDocument();
        expect(await screen.findByText('Second test token')).toBeInTheDocument();

        const delete_btns_1 = await screen.findAllByText('Delete');
        expect(delete_btns_1.length).toBe(2);

        fireEvent.click(delete_btns_1[0]);

        const delete_btns_2 = await screen.findAllByText('Delete');
        expect(delete_btns_2.length).toBe(1);

        const no_btn_1 = screen.getByText('No');
        expect(no_btn_1).toBeInTheDocument();

        fireEvent.click(no_btn_1);

        expect(no_btn_1).not.toBeInTheDocument();

        const delete_btns_3 = await screen.findAllByText('Delete');
        expect(delete_btns_3.length).toBe(2);

        fireEvent.click(delete_btns_3[0]);

        const yes_btn_1 = screen.getByText('Yes');
        expect(yes_btn_1).toBeInTheDocument();

        fireEvent.click(yes_btn_1);

        const deleteToken = mock_props.ws.authorized.apiToken;

        expect(deleteToken).toHaveBeenCalled();

        const delete_btns_4 = await screen.findAllByText('Delete');
        expect(delete_btns_4.length).toBe(1);

        fireEvent.click(delete_btns_4[0]);

        const no_btn_2 = screen.getByText('No');
        expect(no_btn_2).toBeInTheDocument();

        const yes_btn_2 = screen.getByText('Yes');
        expect(yes_btn_2).toBeInTheDocument();

        await new Promise(r => setTimeout(r, 10000));

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
                token: 'GBjsG2kM1uxtJtk',
                valid_for_ip: '',
            },
            {
                display_name: 'Second test token',
                last_used: '',
                scopes: ['Read', 'Trade', 'Payments', 'Admin', 'Trading information'],
                token: 'GHjaD2f4gDg5gSE',
                valid_for_ip: '',
            },
            {
                display_name: 'Third test token',
                last_used: '03/02/2022',
                scopes: ['Read', 'Trade', 'Payments', 'Admin'],
                token: 'aSjaD2f4casd5g',
                valid_for_ip: '',
            },
        ]);

        render(<ApiToken {...mock_props} />);

        expect(screen.queryByText('Action')).not.toBeInTheDocument();
        expect(screen.queryByText('Scopes')).not.toBeInTheDocument();
        expect((await screen.findAllByText('Name')).length).toBe(3);
        expect((await screen.findAllByText('Token')).length).toBe(3);
        expect((await screen.findAllByText('Last Used')).length).toBe(3);
        expect((await screen.findAllByText('Scope')).length).toBe(3);
        expect(await screen.findByText('First test token')).toBeInTheDocument();
        expect(await screen.findByText('Second test token')).toBeInTheDocument();
        expect(await screen.findByText('GHjaD2f4gDg5gSE')).toBeInTheDocument();
        const never_used = await screen.findAllByText('Never');
        expect(never_used.length).toBe(2);
        const all_scopes = await screen.findAllByText('All');
        expect(all_scopes.length).toBe(1);
    });

    it('should show token error if exists', async () => {
        mock_props.ws.authorized.apiToken = jest.fn(() =>
            Promise.resolve({
                api_tonen: { tokens: [] },
                error: { message: 'New test error' },
            })
        );

        getPropertyValue.mockReturnValue('New test error');

        render(<ApiToken {...mock_props} />);

        expect(await screen.findByText('New test error')).toBeInTheDocument();
    });
});
