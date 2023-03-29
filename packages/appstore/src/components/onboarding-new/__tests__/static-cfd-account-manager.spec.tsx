import React from 'react';
import { render, screen } from '@testing-library/react';
import StaticCfdAccountManager from '../static-cfd-account-manager';

const StaticCfdAccountManagerComponent = StaticCfdAccountManager;

describe('PlatformSwitcher component', () => {
    it('should render <StaticCfdAccountManagerComponent /> component', () => {
        render(
            <StaticCfdAccountManagerComponent
                type='test'
                appname='test'
                is_blurry={{
                    icon: false,
                    item: false,
                    text: false,
                    get: false,
                    topup: false,
                    trade: false,
                    cfd_item: false,
                    cfd_text: false,
                    options_item: false,
                    options_text: false,
                    cfd_description: false,
                    options_description: false,
                    platformlauncher: false,
                }}
                is_onboarding_animated={{
                    text: false,
                    trade: false,
                    topup: false,
                    button: false,
                    get: false,
                }}
                platform='mt5'
                is_eu_user={false}
            />
        );
        const div_element = screen.getByTestId('dt_static_cfd_account_manager');
        expect(div_element).toBeInTheDocument();
    });

    it('is options + financial + is_eu_user', () => {
        render(
            <StaticCfdAccountManagerComponent
                type='financial'
                appname='test'
                is_blurry={{
                    icon: false,
                    item: false,
                    text: false,
                    get: false,
                    topup: false,
                    trade: false,
                    cfd_item: false,
                    cfd_text: false,
                    options_item: false,
                    options_text: false,
                    cfd_description: false,
                    options_description: false,
                    platformlauncher: false,
                }}
                is_onboarding_animated={{
                    text: false,
                    trade: false,
                    topup: false,
                    button: false,
                    get: false,
                }}
                platform='options'
                is_eu_user={true}
            />
        );
        const div_element = screen.getByTestId('dt_static_cfd_account_manager');
        expect(div_element).toHaveClass('static-cfd-account-manager--with-margin');
    });

    it('is options + financial + !is_eu_user', () => {
        render(
            <StaticCfdAccountManagerComponent
                type='financial'
                appname='test'
                is_blurry={{
                    icon: false,
                    item: false,
                    text: false,
                    get: false,
                    topup: false,
                    trade: false,
                    cfd_item: false,
                    cfd_text: false,
                    options_item: false,
                    options_text: false,
                    cfd_description: false,
                    options_description: false,
                    platformlauncher: false,
                }}
                is_onboarding_animated={{
                    text: false,
                    trade: false,
                    topup: false,
                    button: false,
                    get: false,
                }}
                platform='options'
                is_eu_user={false}
            />
        );
        const div_element = screen.getByTestId('dt_static_cfd_account_manager');
        expect(div_element).toHaveClass('static-cfd-account-manager--with-margin');
    });
});
