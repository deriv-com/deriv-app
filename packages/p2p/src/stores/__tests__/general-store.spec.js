import GeneralStore from '../general-store';
import RootStore from '..';
import { WS } from '@deriv/shared';
import { mockStore } from '@deriv/stores';
import { waitFor } from '@testing-library/react';

let general_store;
const root_store = new RootStore();

const website_status = {
    p2p_config: {
        fixed_rate_adverts: 1,
        float_rate_adverts: 1,
        float_rate_offset_limit: 1,
        fixed_rate_adverts_end_date: 1,
        override_exchange_rate: 1,
        local_currencies: [],
    },
};

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    WS: {
        p2pSubscribe: () => {
            return {
                exchange_rates: {
                    base_currency: 'USD',
                    date: Date.now(),
                    rates: {
                        IDR: 14989.65,
                    },
                },
            };
        },
        send: request => {
            return 'website_status' in request
                ? { website_status }
                : { error: null, get_account_status: { status: ['authenticated'] } };
        },
        authorized: {
            send: request => {
                return 'website_status' in request
                    ? { website_status }
                    : { error: null, get_account_status: { status: ['authenticated'] } };
            },
        },
    },
}));

describe('<GeneralStore /> onMount()', () => {
    const initialize = () => {
        general_store = new GeneralStore(root_store);
        general_store.setExternalStores(mockStore());
        general_store.setWebsocketInit(WS);
        general_store.getWebsiteStatus();
    };

    beforeEach(() => {
        jest.resetModules();
    });

    afterEach(() => {
        general_store.disposeUserBarredReaction();
    });

    it('should pass initial if check when get_account_status is not empty', async () => {
        initialize();

        await general_store.onMount();

        expect(general_store.is_loading).toBe(true);
        expect(general_store.is_blocked).toBe(false);
        expect(general_store.is_high_risk).toBe(false);
        expect(general_store.is_p2p_blocked_for_pa).toBe(false);
    });

    it('should set is_high_risk, is_blocked and is_p2p_blocked_for_pa to false if get_account_status returns an error', async () => {
        const spySend = jest.spyOn(WS, 'send').mockImplementation(() => ({
            error: 'error',
            get_account_status: { status: ['authenticated'] },
        }));

        const spyAuthorized = jest.spyOn(WS.authorized, 'send').mockImplementation(() => ({
            error: 'error',
            get_account_status: { status: ['authenticated'] },
        }));

        initialize();

        await general_store.onMount();

        expect(general_store.is_high_risk).toBe(false);
        expect(general_store.is_blocked).toBe(false);
        expect(general_store.is_p2p_blocked_for_pa).toBe(false);

        spySend.mockRestore();
        spyAuthorized.mockRestore();
    });

    it('should set is_blocked to true if perm_ban status has been passed in get_account_status', async () => {
        const spySend = jest.spyOn(WS, 'send').mockImplementation(() => ({
            website_status,
            error: null,
            get_account_status: { status: ['authenticated'], p2p_status: 'perm_ban' },
        }));

        const spyAuthorized = jest.spyOn(WS.authorized, 'send').mockImplementation(() => ({
            website_status,
            error: null,
            get_account_status: { status: ['authenticated'], p2p_status: 'perm_ban' },
        }));

        initialize();

        await general_store.onMount();

        await waitFor(() => expect(general_store.is_blocked).toBe(true));

        spySend.mockRestore();
        spyAuthorized.mockRestore();
    });

    it('should set is_blocked to true if user is high risk, authenticated and is status includes is_cashier_locked', async () => {
        const spySend = jest.spyOn(WS, 'send').mockImplementation(() => ({
            website_status,
            error: null,
            get_account_status: { status: ['authenticated', 'cashier_locked'], risk_classification: 'high' },
        }));

        const spyAuthorized = jest.spyOn(WS.authorized, 'send').mockImplementation(() => ({
            website_status,
            error: null,
            get_account_status: { status: ['authenticated', 'cashier_locked'], risk_classification: 'high' },
        }));

        initialize();

        await general_store.onMount();

        await waitFor(() => expect(general_store.is_blocked).toBe(true));

        spySend.mockRestore();
        spyAuthorized.mockRestore();
    });

    it('should set should_show_poa to true if user is high risk, not authenticated and financial assessment has been complete', async () => {
        const spySend = jest.spyOn(WS, 'send').mockImplementation(() => ({
            website_status,
            error: null,
            get_account_status: { status: [], risk_classification: 'high' },
        }));

        const spyAuthorized = jest.spyOn(WS.authorized, 'send').mockImplementation(() => ({
            website_status,
            error: null,
            get_account_status: { status: [], risk_classification: 'high' },
        }));

        initialize();

        await general_store.onMount();

        await waitFor(() => expect(general_store.should_show_poa).toBe(true));

        spySend.mockRestore();
        spyAuthorized.mockRestore();
    });

    it('should set is_high_risk to true if user is high risk and financial assessment is not completed', async () => {
        const spySend = jest.spyOn(WS, 'send').mockImplementation(() => ({
            website_status,
            error: null,
            get_account_status: { status: ['financial_assessment_not_complete'], risk_classification: 'high' },
        }));

        const spyAuthorized = jest.spyOn(WS.authorized, 'send').mockImplementation(() => ({
            website_status,
            error: null,
            get_account_status: { status: ['financial_assessment_not_complete'], risk_classification: 'high' },
        }));

        initialize();

        await general_store.onMount();

        await waitFor(() => expect(general_store.is_high_risk).toBe(true));

        spySend.mockRestore();
        spyAuthorized.mockRestore();
    });

    it('should set is_p2p_blocked_for_pa to true if user has p2p_blocked_for_pa returned in get_account_status', async () => {
        const spySend = jest.spyOn(WS, 'send').mockImplementation(() => ({
            website_status,
            error: null,
            get_account_status: { status: ['p2p_blocked_for_pa'] },
        }));

        const spyAuthorized = jest.spyOn(WS.authorized, 'send').mockImplementation(() => ({
            website_status,
            error: null,
            get_account_status: { status: ['p2p_blocked_for_pa'] },
        }));

        initialize();

        await general_store.onMount();

        await waitFor(() => expect(general_store.is_p2p_blocked_for_pa).toBe(true));

        spySend.mockRestore();
        spyAuthorized.mockRestore();
    });
});
