import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { StoreProvider, mockStore } from '@deriv/stores';
import { Analytics } from '@deriv/analytics';
import useAnalytics, { TTrackRealAccountSignup } from '../useAnalytics';
import { TStores } from '@deriv/stores/types';

describe('useAnalytics', () => {
    let mock_store: TStores;

    beforeAll(() => {
        mock_store = mockStore({
            client: {
                loginid: 'CR12345',
            },
            ui: {
                is_mobile: true,
                real_account_signup_target: 'svg',
            },
        });
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
        <StoreProvider store={mock_store}>{children}</StoreProvider>
    );

    it('should set attributes correctly on mount', () => {
        renderHook(() => useAnalytics(), { wrapper });

        expect(Analytics.setAttributes).toHaveBeenCalledWith({
            device_type: 'mobile',
            account_type: 'CR',
        });
    });

    it('should track real account signup', () => {
        const { result } = renderHook(() => useAnalytics(), { wrapper });

        const payload: TTrackRealAccountSignup = {
            action: 'open',
            step_codename: 'step1',
            step_num: 1,
            user_choice: 'choice',
            form_source: 'https://deriv.com',
        };

        result.current.trackRealAccountSignup(payload);

        expect(Analytics.trackEvent).toHaveBeenCalledWith('ce_real_account_signup_form', {
            action: 'open',
            step_codename: 'step1',
            step_num: 1,
            user_choice: JSON.stringify('choice'),
            form_name: 'real_account_signup_form',
            form_source: 'https://deriv.com',
            landing_company: 'svg',
        });
    });

    it('should not call trackEvent if real signup target is maltainvest', () => {
        mock_store = mockStore({
            ui: {
                real_account_signup_target: 'maltainvest',
            },
        });

        const { result } = renderHook(() => useAnalytics(), {
            wrapper,
        });

        const payload: TTrackRealAccountSignup = {
            action: 'open',
        };

        expect(result.current.trackRealAccountSignup(payload)).toBe(undefined);
    });
});
