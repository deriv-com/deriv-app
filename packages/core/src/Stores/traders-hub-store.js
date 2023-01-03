import { action, makeObservable, observable, reaction, computed } from 'mobx';
import { getAppstorePlatforms, CFD_PLATFORMS, available_traders_hub_cfd_accounts, formatMoney } from '@deriv/shared';
import BaseStore from './base-store';
import { localize } from '@deriv/translations';

export default class TradersHubStore extends BaseStore {
    available_platforms = [];
    available_cfd_accounts = [];
    available_mt5_accounts = [];
    available_dxtrade_accounts = [];
    combined_cfd_mt5_accounts = [];
    selected_account_type;
    selected_region;
    is_regulators_compare_modal_visible = false;
    is_tour_open = false;
    is_account_type_modal_visible = false;
    account_type_card = '';
    prev_selected_loginid = '';
    selected_platform_type = 'options';
    active_index = 0;
    vrtc_loginid;
    total_platform_demo_balance = { currency: 'USD', balance: 0 };
    total_platform_real_balance = { currency: 'USD', balance: 0 };
    total_cfd_demo_balance = { currency: 'USD', balance: 0 };
    total_cfd_real_balance = { currency: 'USD', balance: 0 };
    cfd_accounts;
    modal_data = {
        active_modal: '',
        data: {},
    };

    constructor(root_store) {
        super({ root_store });

        makeObservable(this, {
            account_type_card: observable,
            available_cfd_accounts: observable,
            available_dxtrade_accounts: observable,
            available_mt5_accounts: observable,
            combined_cfd_mt5_accounts: observable,
            available_platforms: observable,
            is_regulators_compare_modal_visible: observable,
            is_tour_open: observable,
            modal_data: observable,
            prev_selected_loginid: observable,
            selected_account_type: observable,
            selected_platform_type: observable,
            selected_region: observable,
            is_account_type_modal_visible: observable,
            closeModal: action.bound,
            getAccount: action.bound,
            getAvailableCFDAccounts: action.bound,
            getAvailableDxtradeAccounts: action.bound,
            getExistingAccounts: action.bound,
            handleTabItemClick: action.bound,
            has_any_real_account: computed,
            is_demo: computed,
            is_demo_low_risk: computed,
            is_eu_selected: computed,
            is_real: computed,
            can_get_more_cfd_mt5_accounts: computed,
            no_CR_account: computed,
            no_MF_account: computed,
            account_flag: computed,
            openDemoCFDAccount: action.bound,
            openModal: action.bound,
            openRealAccount: action.bound,
            selectAccountType: action.bound,
            selectAccountTypeCard: action.bound,
            selectRegion: action.bound,
            setActiveIndex: action.bound,
            setTogglePlatformType: action.bound,
            startTrade: action.bound,
            toggleAccountTypeModalVisibility: action.bound,
            toggleIsTourOpen: action.bound,
            toggleRegulatorsCompareModal: action.bound,
            setCombinedCFDMT5Accounts: action.bound,
        });

        reaction(
            () => [
                this.selected_account_type,
                this.selected_region,
                this.root_store.client.is_eu,
                this.root_store.client.is_switching,
                this.root_store.client.account_list,
                this.root_store.client.upgradeable_landing_companies,
            ],
            () => {
                this.getDemoLoginId();
                this.getPlatformDemoBalance();
                this.getCFDBalance('demo');
            }
        );

        const login_id = window.localStorage.getItem('active_loginid') ?? '';
        this.selected_account_type = !/^VRT/.test(login_id) ? 'real' : 'demo';

        reaction(
            () => [
                this.selected_account_type,
                this.selected_region,
                this.root_store.client.is_eu,
                this.root_store.client.mt5_login_list,
                this.root_store.client.dxtrade_accounts_list,
                this.is_demo_low_risk,
            ],
            () => {
                this.getAvailablePlatforms();
                this.getAvailableCFDAccounts();
            }
        );

        this.selected_region = 'Non-EU';
    }

    get no_MF_account() {
        const { has_maltainvest_account } = this.root_store.client;
        return this.selected_region === 'EU' && !has_maltainvest_account;
    }

    get no_CR_account() {
        const { active_accounts } = this.root_store.client;
        const result = active_accounts.some(acc => acc.landing_company_shortcode === 'svg');
        return !result && this.selected_region === 'Non-EU';
    }

    async selectAccountType(account_type) {
        const { account_list, switchAccount, prev_real_account_loginid } = this.root_store.client;

        if (account_type === 'demo') {
            await switchAccount(account_list.find(acc => acc.is_virtual && !acc.is_disabled)?.loginid);
        } else if (account_type === 'real') {
            if (prev_real_account_loginid) {
                await switchAccount(prev_real_account_loginid);
            } else {
                await switchAccount(account_list.find(acc => !acc.is_virtual && !acc.is_disabled)?.loginid);
            }
        }
        this.selected_account_type = account_type;
    }

    selectAccountTypeCard(account_type_card) {
        this.account_type_card = account_type_card;
    }

    selectRegion(region) {
        this.selected_region = region;
    }

    toggleIsTourOpen(is_tour_open) {
        this.is_tour_open = is_tour_open;
    }

    get is_demo_low_risk() {
        const { is_low_risk } = this.root_store.client;
        return this.is_demo && is_low_risk;
    }

    get account_flag() {
        const { is_logged_in, upgradeable_landing_companies } = this.root_store.client;

        if (is_logged_in) {
            if (this.is_demo && upgradeable_landing_companies?.includes('svg')) {
                return 'cr_demo_content';
            } else if (
                upgradeable_landing_companies.includes('svg') &&
                upgradeable_landing_companies.includes('maltainvest') &&
                !this.is_demo
            ) {
                if (this.is_eu_user) return 'low_risk_cr_eu_content';
                return 'low_risk_cr_non_eu_content';
            } else if (
                upgradeable_landing_companies.length === 1 &&
                upgradeable_landing_companies.includes('maltainvest')
            ) {
                if (this.is_demo) return 'eu_demo_content';
                return 'eu_real_content';
            } else if (
                upgradeable_landing_companies.length === 1 &&
                upgradeable_landing_companies.includes('svg') &&
                !this.is_eu_user
            ) {
                return 'high_risk_cr_content';
            }
            return null;
        }
        return null;
    }

    getAvailablePlatforms() {
        const appstore_platforms = getAppstorePlatforms();
        if (this.is_eu_user && !this.is_demo_low_risk) {
            this.available_platforms = appstore_platforms.filter(platform =>
                ['EU', 'All'].some(region => region === platform.availability)
            );
            return;
        } else if (this.selected_region === 'Non-EU' || this.is_demo_low_risk) {
            this.available_platforms = appstore_platforms.filter(platform =>
                ['Non-EU', 'All'].some(region => region === platform.availability)
            );
            return;
        }
        this.available_platforms = appstore_platforms;
    }

    toggleAccountTypeModalVisibility() {
        this.is_account_type_modal_visible = !this.is_account_type_modal_visible;
    }
    get is_eu_selected() {
        return this.selected_region === 'EU';
    }

    toggleRegulatorsCompareModal() {
        this.is_regulators_compare_modal_visible = !this.is_regulators_compare_modal_visible;
    }

    get has_any_real_account() {
        return this.selected_account_type === 'real' && this.root_store.client.has_active_real_account;
    }

    setTogglePlatformType(platform_type) {
        this.selected_platform_type = platform_type;
    }

    getAvailableCFDAccounts() {
        const account_desc =
            !this.is_eu_user || this.is_demo_low_risk
                ? localize('Trade CFDs on MT5 with forex, stocks, stock indices, commodities, and cryptocurrencies.')
                : localize(
                      'Trade CFDs on forex, stocks, stock indices, synthetic indices, cryptocurrencies, and commodities with leverage.'
                  );

        const all_available_accounts = [
            ...available_traders_hub_cfd_accounts,
            {
                name: !this.is_eu_user || this.is_demo_low_risk ? localize('Financial') : localize('CFDs'),
                description: account_desc,
                platform: CFD_PLATFORMS.MT5,
                market_type: 'financial',
                icon: !this.is_eu_user || this.is_demo_low_risk ? 'Financial' : 'CFDs',
                availability: 'All',
            },
        ];
        this.available_cfd_accounts = all_available_accounts.map(account => {
            return {
                ...account,
                description: account.description,
            };
        });
        this.getAvailableDxtradeAccounts();
        this.getAvailableMt5Accounts();
        this.setCombinedCFDMT5Accounts();
    }

    getAvailableMt5Accounts() {
        if (this.is_eu_user && !this.is_demo_low_risk) {
            this.available_mt5_accounts = this.available_cfd_accounts.filter(account =>
                ['EU', 'All'].some(region => region === account.availability)
            );
            return;
        }

        this.available_mt5_accounts = this.available_cfd_accounts.filter(
            account => account.platform === CFD_PLATFORMS.MT5
        );
    }

    getAvailableDxtradeAccounts() {
        if (this.is_eu_user && !this.is_demo_low_risk) {
            this.available_dxtrade_accounts = this.available_cfd_accounts.filter(
                account =>
                    ['EU', 'All'].some(region => region === account.availability) &&
                    account.platform === CFD_PLATFORMS.DXTRADE
            );
            return;
        }
        this.available_dxtrade_accounts = this.available_cfd_accounts.filter(
            account => account.platform === CFD_PLATFORMS.DXTRADE
        );
    }
    hasCFDAccount(platform, category, type) {
        const current_list_keys = Object.keys(this.root_store.modules.cfd.current_list);
        return current_list_keys.some(key => key.startsWith(`${platform}.${category}.${type}`));
    }

    getExistingAccounts(platform, market_type) {
        const current_list = this.root_store.modules?.cfd?.current_list || [];
        const current_list_keys = Object.keys(current_list);
        const selected_account_type = this.selected_account_type;
        const existing_accounts = current_list_keys
            .filter(key => {
                if (platform === CFD_PLATFORMS.MT5) {
                    return key.startsWith(`${platform}.${selected_account_type}.${market_type}`);
                }
                if (platform === CFD_PLATFORMS.DXTRADE && market_type === 'all') {
                    return key.startsWith(`${platform}.${selected_account_type}.${platform}@${market_type}`);
                }
                return key.startsWith(`${platform}.${selected_account_type}.${market_type}@${market_type}`);
            })
            .reduce((_acc, cur) => {
                _acc.push(current_list[cur]);
                return _acc;
            }, []);
        return existing_accounts;
    }

    startTrade(platform, account) {
        const { common, modules } = this.root_store;
        const { toggleMT5TradeModal, setMT5TradeAccount } = modules.cfd;
        const { setAppstorePlatform } = common;
        setAppstorePlatform(platform);
        toggleMT5TradeModal();
        setMT5TradeAccount(account);
    }

    get is_demo() {
        return this.selected_account_type === 'demo';
    }
    get is_real() {
        return this.selected_account_type === 'real';
    }
    get is_eu_user() {
        // const { is_eu } = this.root_store.client;
        return this.selected_region === 'EU';
    }

    setActiveIndex(active_index) {
        this.active_index = active_index;
    }

    handleTabItemClick(idx) {
        this.setActiveIndex(idx);
        if (idx === 0) {
            this.selected_region = 'Non-EU';
        } else {
            this.selected_region = 'EU';
        }
    }

    openDemoCFDAccount(account_type, platform) {
        const { client, modules, ui } = this.root_store;
        const { standpoint, createCFDAccount, enableCFDPasswordModal, has_maltainvest_account } = modules.cfd;

        const { openAccountNeededModal } = ui;
        const { is_eu } = client;
        if (is_eu && !has_maltainvest_account && standpoint?.iom) {
            openAccountNeededModal('maltainvest', localize('Deriv Multipliers'), localize('demo CFDs'));
            return;
        }
        createCFDAccount({ ...account_type, platform });
        enableCFDPasswordModal();
    }

    openRealAccount(account_type, platform) {
        const { client, modules } = this.root_store;
        const { has_active_real_account } = client;
        const { createCFDAccount, enableCFDPasswordModal, toggleJurisdictionModal } = modules.cfd;
        if (has_active_real_account && platform === CFD_PLATFORMS.MT5) {
            toggleJurisdictionModal();
        } else {
            createCFDAccount({ ...account_type, platform });
            enableCFDPasswordModal();
        }
    }

    openModal(modal_id, props = {}) {
        this.modal_data = {
            active_modal: modal_id,
            data: props,
        };
    }

    closeModal() {
        this.modal_data = {
            active_modal: '',
            data: {},
        };
    }

    selectRealLoginid(loginid) {
        const { accounts } = this.root_store.client;
        if (Object.keys(accounts).includes(loginid)) {
            this.selected_loginid = loginid;
        }
    }

    getAccount() {
        const { modules, common } = this.root_store;
        const { account_type } = modules.cfd;
        const { platform } = common;
        if (this.is_demo) {
            this.openDemoCFDAccount(account_type, platform);
        } else {
            this.openRealAccount(account_type, platform);
        }
    }

    async getDemoLoginId() {
        const { account_list } = this.root_store.client;
        if (account_list || account_list.length) {
            this.vrtc_loginid = account_list.find(account => account.is_virtual)?.loginid;
        }
    }

    getPlatformDemoBalance() {
        const { accounts } = this.root_store.client;
        if (accounts && this.vrtc_loginid in accounts && this.vrtc_loginid) {
            const { balance, currency } = accounts[this.vrtc_loginid];
            this.total_platform_demo_balance = {
                currency,
                balance,
            };
        }
    }

    getCFDBalance(account_type) {
        const { mt5_login_list } = this.root_store.client;
        const demo_mt5_accounts = mt5_login_list.filter(mt5_account => mt5_account.account_type === account_type);
        if (demo_mt5_accounts.length > 0) {
            const { currency } = demo_mt5_accounts[0];
            const balance = this.getTotalBalance(demo_mt5_accounts);
            this.total_cfd_demo_balance = { currency, balance };
        }
    }

    getTotalBalance(accounts, base_currency) {
        const { getExchangeRate } = this.root_store.common;
        const total_balance = accounts.reduce(
            async (total, account) => {
                const { balance, currency } = account;

                let exchange_rate = 1;
                if (currency !== base_currency) {
                    exchange_rate = await getExchangeRate(currency, base_currency);
                }

                total.balance += balance * exchange_rate || 0;
                return total;
            },
            { balance: 0 }
        );
        return total_balance.balance;
    }
    get can_get_more_cfd_mt5_accounts() {
        const {
            client: { isEligibleForMoreRealMt5 },
        } = this.root_store;
        return (
            this.is_real &&
            !this.is_eu_user &&
            (this.hasCFDAccount(CFD_PLATFORMS.MT5, 'real', 'synthetic') ||
                this.hasCFDAccount(CFD_PLATFORMS.MT5, 'real', 'financial')) &&
            (isEligibleForMoreRealMt5('synthetic') || isEligibleForMoreRealMt5('financial'))
        );
    }
    getServerName = account => {
        if (account) {
            const server_region = account.server_info?.geolocation?.region;
            if (server_region) {
                return `${server_region} ${
                    account?.server_info?.geolocation?.sequence === 1 ? '' : account?.server_info?.geolocation?.sequence
                }`;
            }
        }
        return '';
    };

    getShortCodeAndRegion(account) {
        let short_code_and_region;
        if (this.is_real && !this.is_eu_user) {
            const short_code =
                account.landing_company_short &&
                account.landing_company_short !== 'svg' &&
                account.landing_company_short !== 'bvi'
                    ? account.landing_company_short?.charAt(0).toUpperCase() + account.landing_company_short?.slice(1)
                    : account.landing_company_short?.toUpperCase();

            const region =
                account.market_type !== 'financial' && account.landing_company_short !== 'bvi'
                    ? ` - ${this.getServerName(account)}`
                    : '';

            short_code_and_region = `${short_code}${region}`;
        }
        return short_code_and_region;
    }
    setCombinedCFDMT5Accounts() {
        this.combined_cfd_mt5_accounts = [];
        this.available_mt5_accounts?.forEach(account => {
            const existing_accounts = this.getExistingAccounts(account.platform, account.market_type);
            const has_existing_accounts = existing_accounts.length > 0;
            if (has_existing_accounts) {
                existing_accounts.forEach(existing_account => {
                    this.combined_cfd_mt5_accounts = [
                        ...this.combined_cfd_mt5_accounts,
                        {
                            ...existing_account,
                            icon: account.icon,
                            sub_title: account.name,
                            name: `${formatMoney(existing_account.currency, existing_account.display_balance, true)} ${
                                existing_account.currency
                            }`,
                            short_code_and_region: this.getShortCodeAndRegion(existing_account),
                            platform: account.platform,
                            description: existing_account.display_login,
                            key: `trading_app_card_${existing_account.display_login}`,
                            type: 'transfer_trade',
                            availability: this.selected_region,
                            market_type: account.market_type,
                        },
                    ];
                });
            } else {
                this.combined_cfd_mt5_accounts = [
                    ...this.combined_cfd_mt5_accounts,
                    {
                        icon: account.icon,
                        name: account.name,
                        platform: account.platform,
                        description: account.description,
                        key: `trading_app_card_${account.name}`,
                        type: 'get',
                        availability: this.selected_region,
                        market_type: account.market_type,
                    },
                ];
            }
        });
    }
}
