import { action, makeObservable, observable, reaction, computed } from 'mobx';
import {
    getAppstorePlatforms,
    CFD_PLATFORMS,
    isLandingCompanyEnabled,
    available_traders_hub_cfd_accounts,
} from '@deriv/shared';
import BaseStore from './base-store';
import { localize } from '@deriv/translations';

export default class TradersHubStore extends BaseStore {
    available_platforms = [];
    available_cfd_accounts = [];
    available_mt5_accounts = [];
    available_dxtrade_accounts = [];
    selected_region;
    selected_account_type = 'demo';
    is_regulators_compare_modal_visible = false;
    is_tour_open = false;
    is_account_type_modal_visible = false;
    account_type_card = '';
    selected_platform_type = 'options';
    active_index = 0;

    constructor(root_store) {
        super({ root_store });

        makeObservable(this, {
            available_platforms: observable,
            available_cfd_accounts: observable,
            available_dxtrade_accounts: observable,
            available_mt5_accounts: observable,
            is_regulators_compare_modal_visible: observable,
            selected_account_type: observable,
            account_type_card: observable,
            selected_platform_type: observable,
            selected_region: observable,
            is_tour_open: observable,
            selectAccountType: action.bound,
            selectAccountTypeCard: action.bound,
            selectRegion: action.bound,
            setTogglePlatformType: action.bound,
            setActiveIndex: action.bound,
            toggleIsTourOpen: action.bound,
            toggleAccountTypeModalVisibility: action.bound,
            handleTabItemClick: action.bound,
            toggleRegulatorsCompareModal: action.bound,
            has_any_real_account: computed,
            is_demo: computed,
            is_real: computed,
            is_eu_selected: computed,
            getAvailableDxtradeAccounts: action.bound,
            getAvailableCFDAccounts: action.bound,
            getExistingAccounts: action.bound,
            getAccount: action.bound,
            startTrade: action.bound,
            openDemoCFDAccount: action.bound,
            openRealAccount: action.bound,
        });

        reaction(
            () => [
                this.selected_account_type,
                this.selected_region,
                this.root_store.client.is_eu,
                this.root_store.client.is_switching,
                this.root_store.client.mt5_login_list,
                this.root_store.client.dxtrade_accounts_list,
            ],
            () => {
                this.getAvailablePlatforms();
                this.getAvailableCFDAccounts();
            }
        );

        this.selected_region = 'Non-EU';
    }

    selectAccountType(account_type) {
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

    getAvailablePlatforms() {
        const appstore_platforms = getAppstorePlatforms();
        if (this.selected_region === 'EU') {
            this.available_platforms = appstore_platforms.filter(platform =>
                ['EU', 'All'].some(region => region === platform.availability)
            );
            return;
        } else if (this.root_store.client.is_eu) {
            this.available_platforms = appstore_platforms.filter(platform =>
                ['All'].some(region => region === platform.availability)
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
        const account_desc = this.is_eu_user
            ? localize(
                  'Trade CFDs on forex, stocks, stock indices, synthetic indices, cryptocurrencies, and commodities with leverage.'
              )
            : localize('Trade CFDs on Deriv MT5 with forex, stocks & indices, commodities, and cryptocurrencies.');
        const all_available_accounts = [
            ...available_traders_hub_cfd_accounts,
            {
                name: this.is_eu_user ? localize('CFDs') : localize('Financial'),
                description: account_desc,
                platform: CFD_PLATFORMS.MT5,
                market_type: 'financial',
                icon: this.is_eu_user ? 'CFDs' : 'Financial',
                availability: 'All',
            },
        ];
        this.available_cfd_accounts = all_available_accounts.map(account => {
            return {
                ...account,
                description: account.description,
                is_visible: ['synthetic', 'all'].some(market_type => account.market_type === market_type)
                    ? this.isDerivedVisible(account.platform)
                    : this.isFinancialVisible(account.platform_name),
                // is_disabled: this.has_cfd_account_error(account.platform),
            };
        });
        this.getAvailableDxtradeAccounts();
        this.getAvailableMt5Accounts();
    }
    getAvailableMt5Accounts() {
        if (this.is_eu_user) {
            this.available_mt5_accounts = this.available_cfd_accounts.filter(account =>
                ['EU', 'All'].some(region => region === account.availability)
            );
            return;
        } else if (this.root_store.client.is_eu) {
            this.available_mt5_accounts = this.available_cfd_accounts.filter(account =>
                ['All'].some(region => region === account.availability)
            );
            return;
        }

        this.available_mt5_accounts = this.available_cfd_accounts.filter(
            account => account.platform === CFD_PLATFORMS.MT5
        );
    }

    getAvailableDxtradeAccounts() {
        if (this.is_eu_user) {
            this.available_dxtrade_accounts = this.available_cfd_accounts.filter(
                account =>
                    ['EU', 'All'].some(region => region === account.availability) &&
                    account.platform === CFD_PLATFORMS.DXTRADE
            );
            return;
        } else if (this.root_store.client.is_eu) {
            this.available_dxtrade_accounts = this.available_cfd_accounts.filter(
                account =>
                    ['All'].some(region => region === account.availability) &&
                    account.platform === CFD_PLATFORMS.DXTRADE
            );
            return;
        }
        this.available_dxtrade_accounts = this.available_cfd_accounts.filter(
            account => account.platform === CFD_PLATFORMS.DXTRADE
        );
    }
    hasAccount(cfd_platform, landing_company_short) {
        const current_list_keys = Object.keys(this.root_store.modules.cfd.current_list);
        return current_list_keys.some(key =>
            landing_company_short
                ? key.startsWith(`${cfd_platform}.${this.selected_account_type}`)
                : key.startsWith(`${cfd_platform}.${this.selected_account_type}.${landing_company_short}`)
        );
    }
    isDerivedVisible(platform) {
        const { is_logged_in, is_eu_country, is_eu, landing_companies } = this.root_store.client;
        // Hiding card for logged out EU users

        if ((!is_logged_in && is_eu_country) || (is_eu && this.hasAccount(platform, 'synthetic'))) return false;

        return isLandingCompanyEnabled({ landing_companies, platform, type: 'gaming' }) || !is_logged_in;
    }
    isFinancialVisible(platform) {
        const { client } = this.root_store;
        return (
            !client.is_logged_in ||
            isLandingCompanyEnabled({
                landing_companies: client.landing_companies,
                platform,
                type: 'financial',
            })
        );
    }
    getExistingAccounts(platform, market_type) {
        const { current_list } = this.root_store.modules.cfd;
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
        const { is_eu } = this.root_store.client;
        return this.selected_region === 'EU' || is_eu;
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
        const { client, common, modules } = this.root_store;

        const { setAppstorePlatform } = common;
        const {
            standpoint,
            createCFDAccount,
            enableCFDPasswordModal,
            openAccountNeededModal,
            has_maltainvest_account,
        } = modules.cfd;
        const { is_eu } = client;
        setAppstorePlatform(platform);
        if (is_eu && !has_maltainvest_account && standpoint?.iom) {
            openAccountNeededModal('maltainvest', localize('Deriv Multipliers'), localize('demo CFDs'));
            return;
        }
        createCFDAccount({
            category: 'demo',
            type: account_type,
            platform,
        });
        enableCFDPasswordModal();
    }
    openRealAccount(account_type, platform) {
        const { client, modules, common } = this.root_store;
        const { has_active_real_account } = client;
        const { setAccountType, createCFDAccount, enableCFDPasswordModal, toggleJurisdictionModal } = modules.cfd;
        const { setAppstorePlatform } = common;
        setAppstorePlatform(platform);
        if (has_active_real_account && platform === CFD_PLATFORMS.MT5) {
            toggleJurisdictionModal();
            setAccountType({
                category: 'real',
                type: account_type,
            });
        } else {
            setAccountType({
                category: 'real',
                type: account_type,
            });
            createCFDAccount({
                category: 'real',
                type: account_type,
            });
            enableCFDPasswordModal();
        }
    }
    getAccount(account_type, platform) {
        if (this.is_demo) {
            this.openDemoCFDAccount(account_type, platform);
        } else {
            this.openRealAccount(account_type, platform);
        }
    }
}
