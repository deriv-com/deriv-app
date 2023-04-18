import { action, reaction, makeObservable, when } from 'mobx';
import { isEuResidenceWithOnlyVRTC, showDigitalOptionsUnavailableError, routes } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { runIrreversibleEvents, ApiHelpers, DBot } from '@deriv/bot-skeleton';

export default class AppStore {
    constructor(root_store) {
        makeObservable(this, {
            onMount: action.bound,
            onUnmount: action.bound,
        });

        this.root_store = root_store;
        this.dbot_store = null;
        this.api_helpers_store = null;
    }

    getErrorForNonEuClients = () => {
        return {
            text: localize(
                'Unfortunately, this trading platform is not available for EU Deriv account. Please switch to a non-EU account to continue trading.'
            ),
            title: localize('Deriv Bot is unavailable for this account'),
            link: localize('Switch to another account'),
        };
    };

    getErrorForEuClients = is_logged_in => {
        return {
            text: ' ',
            title: is_logged_in
                ? localize('Deriv Bot is not available for EU clients')
                : localize('Deriv Bot is unavailable in the EU'),
            link: is_logged_in ? localize("Back to Trader's Hub") : localize('Login'),
            route: routes.traders_hub,
        };
    };

    handleErrorForEu = (show_default_error = false) => {
        const { client, common, ui } = this.root_store.core;
        if (
            (client.is_eu_country && window.location.pathname === routes.bot) ||
            (client.is_eu && !client.is_low_risk && window.location.pathname === routes.bot)
        ) {
            showDigitalOptionsUnavailableError(common.showError, this.getErrorForEuClients(client.is_logged_in));
        } else if (
            (client.is_eu && !client.is_bot_allowed && window.location.pathname === routes.bot) ||
            isEuResidenceWithOnlyVRTC(client.active_accounts) ||
            client.is_options_blocked
        ) {
            const toggleAccountsDialog = ui?.toggleAccountsDialog;
            if (toggleAccountsDialog) {
                showDigitalOptionsUnavailableError(
                    common.showError,
                    this.getErrorForNonEuClients(),
                    toggleAccountsDialog,
                    false,
                    false
                );
            }
        } else if (show_default_error && common.has_error) {
            common.setError(false, null);
        }
    };

    onMount() {
        const { blockly_store, core, main_content } = this.root_store;
        const { client, common, ui } = core;
        this.showDigitalOptionsMaltainvestError(client, common, ui);

        blockly_store.startLoading();
        DBot.initWorkspace(__webpack_public_path__, this.dbot_store, this.api_helpers_store, ui.is_mobile).then(() => {
            main_content.setContainerSize();
            blockly_store.endLoading();
        });
        this.registerReloadOnLanguageChange(this);
        this.registerCurrencyReaction.call(this);
        this.registerOnAccountSwitch.call(this);
        this.registerLandingCompanyChangeReaction.call(this);
        this.registerResidenceChangeReaction.call(this);

        window.addEventListener('click', this.onClickOutsideBlockly);
        window.addEventListener('beforeunload', this.onBeforeUnload);

        main_content.getCachedActiveTab();

        when(
            () => client?.is_eu_country,
            () => {
                this.showDigitalOptionsMaltainvestError(client, common, ui);
            }
        );
    }

    onUnmount() {
        DBot.terminateBot();
        DBot.terminateConnection();
        if (Blockly.derivWorkspace) {
            clearInterval(Blockly.derivWorkspace.save_workspace_interval);
            Blockly.derivWorkspace.dispose();
        }
        if (typeof this.disposeReloadOnLanguageChangeReaction === 'function') {
            this.disposeReloadOnLanguageChangeReaction();
        }
        if (typeof this.disposeCurrencyReaction === 'function') {
            this.disposeCurrencyReaction();
        }
        if (typeof this.disposeSwitchAccountListener === 'function') {
            this.disposeSwitchAccountListener();
        }
        if (typeof this.disposeLandingCompanyChangeReaction === 'function') {
            this.disposeLandingCompanyChangeReaction();
        }
        if (typeof this.disposeResidenceChangeReaction === 'function') {
            this.disposeResidenceChangeReaction();
        }

        window.removeEventListener('click', this.onClickOutsideBlockly);
        window.removeEventListener('beforeunload', this.onBeforeUnload);

        // Ensure account switch is re-enabled.
        const { ui } = this.root_store.core;

        ui.setAccountSwitcherDisabledMessage(false);
        ui.setPromptHandler(false);
    }

    onBeforeUnload = event => {
        const { is_stop_button_visible } = this.root_store.run_panel;

        if (is_stop_button_visible) {
            event.returnValue = true;
        }
    };
    registerReloadOnLanguageChange() {
        this.disposeReloadOnLanguageChangeReaction = reaction(
            () => this.root_store.common.current_language,
            () => {
                // temporarily added this to refresh just dbot in case of changing language,
                // otherwise it should change language without refresh.
                const { pathname } = window.location;
                const is_bot =
                    /^\/bot/.test(pathname) || (/^\/(br_)/.test(pathname) && pathname.split('/')[2] === 'bot');
                if (is_bot) window.location.reload();
            }
        );
    }
    registerCurrencyReaction() {
        // Syncs all trade options blocks' currency with the client's active currency.
        this.disposeCurrencyReaction = reaction(
            () => this.root_store.core.client.currency,
            currency => {
                if (!Blockly.derivWorkspace) return;

                const trade_options_blocks = Blockly.derivWorkspace
                    .getAllBlocks()
                    .filter(
                        b =>
                            b.type === 'trade_definition_tradeoptions' ||
                            b.type === 'trade_definition_multiplier' ||
                            (b.isDescendantOf('trade_definition_multiplier') && b.category_ === 'trade_parameters')
                    );

                trade_options_blocks.forEach(trade_options_block => trade_options_block.setCurrency(currency));
            }
        );
    }

    registerOnAccountSwitch() {
        const { client, common } = this.root_store.core;

        this.disposeSwitchAccountListener = reaction(
            () => client.switch_broadcast,
            switch_broadcast => {
                if (!switch_broadcast) return;
                this.showDigitalOptionsMaltainvestError(client, common);

                const { active_symbols, contracts_for } = ApiHelpers.instance;

                if (Blockly.derivWorkspace) {
                    active_symbols.retrieveActiveSymbols(true).then(() => {
                        contracts_for.disposeCache();
                        Blockly.derivWorkspace
                            .getAllBlocks()
                            .filter(block => block.type === 'trade_definition_market')
                            .forEach(block => {
                                runIrreversibleEvents(() => {
                                    const fake_create_event = new Blockly.Events.Create(block);
                                    Blockly.Events.fire(fake_create_event);
                                });
                            });
                    });
                }
            }
        );
    }

    registerLandingCompanyChangeReaction() {
        const { client } = this.root_store.core;

        this.disposeLandingCompanyChangeReaction = reaction(
            () => client.landing_company_shortcode,
            () => this.handleErrorForEu()
        );
    }

    registerResidenceChangeReaction() {
        const { client } = this.root_store.core;

        this.disposeResidenceChangeReaction = reaction(
            () => client.account_settings.country_code,
            () => this.handleErrorForEu()
        );
    }

    setDBotEngineStores() {
        // DO NOT pass the rootstore in, if you need a prop define it in dbot-skeleton-store ans pass it through.
        const {
            core: { client },
            flyout,
            toolbar,
            save_modal,
            quick_strategy,
            load_modal,
            blockly_store,
            summary_card,
        } = this.root_store;
        const { handleFileChange } = load_modal;
        const { toggleStrategyModal } = quick_strategy;
        const { startLoading, endLoading } = blockly_store;
        const { setContractUpdateConfig } = summary_card;

        this.dbot_store = {
            is_mobile: false,
            client,
            flyout,
            toolbar,
            save_modal,
            startLoading,
            setContractUpdateConfig,
            endLoading,
            toggleStrategyModal,
            handleFileChange,
        };

        this.api_helpers_store = {
            server_time: this.root_store.server_time,
            ws: this.root_store.ws,
        };
    }

    onClickOutsideBlockly = event => {
        if (document.querySelector('.injectionDiv')) {
            const path = event.path || (event.composedPath && event.composedPath());
            const is_click_outside_blockly = !path.some(el => el.classList && el.classList.contains('injectionDiv'));

            if (is_click_outside_blockly) {
                Blockly?.hideChaff(/* allowToolbox */ false);
            }
        }
    };

    showDigitalOptionsMaltainvestError = () => {
        this.handleErrorForEu(true);
    };
}
