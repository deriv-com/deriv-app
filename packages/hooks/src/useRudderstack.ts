import { useStore } from '@deriv/stores';

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
          tab_name: string;
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

type RSEvents = {
    ce_virtual_signup_form: VirtualSignupFormAction;
    ce_real_account_signup_form: RealAccountSignupFormAction;
    ce_virtual_signup_email_confirmation: VirtualSignupEmailConfirmationAction;
    ce_trade_types_form: TradeTypesFormAction;
};

const useRudderstack = () => {
    const { rudderstack } = useStore();

    const track = <EventType extends keyof RSEvents, EventPayload extends RSEvents[EventType]>(
        event_type: EventType,
        payload: EventPayload
    ) => {
        rudderstack.track(event_type, payload);
    };

    return {
        track,
        identifyEvent: rudderstack.identifyEvent,
        pageView: rudderstack.pageView,
        reset: rudderstack.reset,
    };
};

export default useRudderstack;
