import * as RudderAnalytics from 'rudder-sdk-js';

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

type TEvents = {
    ce_virtual_signup_form: VirtualSignupFormAction;
    ce_real_account_signup_form: RealAccountSignupFormAction;
    ce_virtual_signup_email_confirmation: VirtualSignupEmailConfirmationAction;
    ce_trade_types_form: TradeTypesFormAction;
    identify: IdentifyAction;
};

export class RudderStack {
    has_identified = false;
    has_initialized = false;
    current_page = '';

    constructor() {
        this.init();
    }

    init() {
        const isProduction = process.env.CIRCLE_JOB === 'release_production';
        const isStaging = process.env.CIRCLE_JOB === 'release_staging';

        let RUDDERSTACK_KEY;
        if (isProduction) {
            RUDDERSTACK_KEY = process.env.RUDDERSTACK_PRODUCTION_KEY;
        } else if (isStaging) {
            RUDDERSTACK_KEY = process.env.RUDDERSTACK_STAGING_KEY;
        }

        const RUDDERSTACK_URL = process.env.RUDDERSTACK_URL;
        if (RUDDERSTACK_KEY && RUDDERSTACK_URL) {
            RudderAnalytics.load(RUDDERSTACK_KEY, RUDDERSTACK_URL);
            RudderAnalytics.ready(() => {
                this.has_initialized = true;
            });
        }
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
            RudderAnalytics.track(event, payload);
        }
    }
}

export default new RudderStack();
