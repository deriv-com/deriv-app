import * as RudderAnalytics from 'rudder-sdk-js';
import { isMobile } from '@deriv/shared';

type SignupProvider = 'email' | 'phone' | 'google' | 'facebook' | 'apple';

type VirtualSignupFormAction = {
    action:
        | 'open'
        | 'started'
        | 'email_confirmed'
        | 'signup_continued'
        | 'country_selection_screen_opened'
        | 'password_screen_opened'
        | 'signup_done'
        | 'signup_flow_error'
        | 'go_to_login';
    signup_provider?: SignupProvider;
    form_source?: string;
    form_name?: string;
    error_message?: string;
};

type RealAccountSignupFormAction = {
    action:
        | 'open'
        | 'step_passed'
        | 'save'
        | 'restore'
        | 'close'
        | 'real_signup_error'
        | 'other_error'
        | 'real_signup_finished';
    step_codename?: string;
    step_num?: number;
    user_choice?: string;
    source?: string;
    form_name?: string;
    real_signup_error_message?: string;
    landing_company: string;
};

type VirtualSignupEmailConfirmationAction = {
    action: 'received' | 'expired' | 'confirmed' | 'error';
    signup_provider?: SignupProvider;
    form_source?: string;
    email_md5?: string;
    error_message?: string;
};

type IndicatorsTypesFormAction = {
    action:
        | 'open'
        | 'close'
        | 'add_active'
        | 'clean_all_active'
        | 'delete_active'
        | 'edit_active'
        | 'search'
        | 'info_open'
        | 'info_close';
    form_name?: string;
    indicator_type_name?: string;
    indicators_category_name?: string;
    search_string?: string;
    subform_name?: string;
    account_type: string;
    device_type: string;
};

type MarketTypesFormAction = {
    action:
        | 'open'
        | 'close'
        | 'choose_market_type'
        | 'search'
        | 'info_redirect'
        | 'add_to_favorites'
        | 'delete_from_favorites';
    form_name: string;
    market_type_name: string;
    search_string?: string;
    tab_market_name?: string;
    account_type: string;
    device_type: string;
};

type ChartTypesFormAction = {
    action: 'open' | 'close' | 'choose_chart_type' | 'choose_time_interval';
    form_name: string;
    chart_type_name: string;
    time_interval_name: string;
    account_type: string;
    device_type: string;
};

type TradeTypesFormAction =
    | {
          action: 'open' | 'close' | 'info_close';
          trade_type_name?: string;
          tab_name?: string;
          form_source?: string;
          form_name?: string;
          subform_name?: string;
      }
    | {
          action: 'choose_trade_type';
          subform_name: 'info_old' | 'info_new';
          form_name: string;
          trade_type_name: string;
      }
    | {
          action: 'choose_trade_type';
          subform_name: 'trade_type';
          tab_name: string;
          form_name: string;
          trade_type_name: string;
      }
    | {
          action: 'search';
          search_string: string;
      }
    | {
          action: 'info_open';
          tab_name: string;
          trade_type_name: string;
      }
    | {
          action: 'info-switcher';
          info_switcher_mode: string;
          trade_type_name: string;
      };

type IdentifyAction = {
    language: string;
};

type ReportsFormAction =
    | {
          action: 'choose_report_type';
          form_name: string;
          subform_name: 'open_positions_form' | 'statement_form' | 'trade_table_form';
          trade_type_filter?: string;
          growth_type_filter?: string;
          start_date_filter?: string;
          end_date_filter?: string;
          transaction_type_filter?: string;
      }
    | {
          action: 'filter_trade_type';
          form_name: string;
          subform_name: 'open_positions_form';
          trade_type_filter: string;
      }
    | {
          action: 'filter_growth_rate';
          form_name: string;
          subform_name: 'open_positions_form';
          growth_type_filter: string;
      }
    | {
          action: 'filter_dates';
          form_name: string;
          subform_name: 'trade_table_form' | 'statement_form';
          start_date_filter?: string;
          end_date_filter?: string;
      }
    | {
          action: 'filter_transaction_type';
          form_name: string;
          subform_name: 'statement_form';
          transaction_type_filter: string;
      }
    | {
          action: 'open';
          form_name: string;
          subform_name: string;
          form_source: string;
      }
    | {
          action: 'close';
          form_name: string;
          subform_name: string;
      }
    | {
          action: 'open_contract_details';
          form_name: string;
          form_source: string;
      };

type TEvents = {
    ce_chart_types_form: ChartTypesFormAction;
    ce_indicators_types_form: IndicatorsTypesFormAction;
    ce_market_types_form: MarketTypesFormAction;
    ce_real_account_signup_form: RealAccountSignupFormAction;
    ce_reports_form: ReportsFormAction;
    ce_trade_types_form: TradeTypesFormAction;
    ce_virtual_signup_email_confirmation: VirtualSignupEmailConfirmationAction;
    ce_virtual_signup_form: VirtualSignupFormAction;
    identify: IdentifyAction;
};

export class RudderStack {
    has_identified = false;
    has_initialized = false;
    current_page = '';
    account_type = '';

    constructor() {
        this.init();
    }

    init() {
        const is_production = process.env.CIRCLE_JOB === 'release_production';
        const is_staging = process.env.CIRCLE_JOB === 'release_staging';

        if (!is_production && !is_staging) return;

        const RUDDERSTACK_KEY = is_production
            ? process.env.RUDDERSTACK_PRODUCTION_KEY
            : process.env.RUDDERSTACK_STAGING_KEY;
        const RUDDERSTACK_URL = process.env.RUDDERSTACK_URL;

        if (RUDDERSTACK_KEY && RUDDERSTACK_URL) {
            RudderAnalytics.load(RUDDERSTACK_KEY, RUDDERSTACK_URL);
            RudderAnalytics.ready(() => {
                this.has_initialized = true;
            });
        }
    }

    setAccountType(account_type: string) {
        this.account_type = account_type;
    }

    identifyEvent = (user_id: string, payload: TEvents['identify']) => {
        if (this.has_initialized) {
            RudderAnalytics.identify(user_id, payload);
            this.has_identified = true;
        }
    };

    /**
     * Pushes page view track event to rudderstack
     */
    pageView(current_page: string) {
        if (this.has_initialized && this.has_identified && current_page !== this.current_page) {
            RudderAnalytics.page('Deriv App', current_page);
            this.current_page = current_page;
        }
    }

    /**
     * Pushes reset event to rudderstack
     */
    reset() {
        if (this.has_initialized) {
            RudderAnalytics.reset();
            this.has_identified = false;
        }
    }

    /**
     * Pushes track events to rudderstack
     */
    track<T extends keyof TEvents>(event: T, payload: TEvents[T]) {
        if (this.has_initialized && this.has_identified) {
            RudderAnalytics.track(event, {
                ...payload,
                account_type: this.account_type,
                device_type: isMobile() ? 'mobile' : 'desktop',
            });
        }
    }
}

export default new RudderStack();
