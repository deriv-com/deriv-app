import { Analytics } from '@deriv-com/analytics';

declare global {
    interface Window {
        performance_metrics: {
            create_ctrader_account_time: number;
            create_dxtrade_account_time: number;
            create_mt5_account_time: number;
            load_cashier_time: number;
            login_time: number;
            redirect_from_deriv_com_time: number;
            signup_time: number;
            switch_currency_accounts_time: number;
            switch_from_demo_to_real_time: number;
            switch_from_real_to_demo_time: number;
        };
    }
}

// action type will be updated based on the type from Analytics package when it will be updated
export const startPerformanceEventTimer = (action: keyof typeof global.Window.prototype.performance_metrics) => {
    if (!window.performance_metrics) {
        window.performance_metrics = {
            create_ctrader_account_time: 0,
            create_dxtrade_account_time: 0,
            create_mt5_account_time: 0,
            load_cashier_time: 0,
            login_time: 0,
            redirect_from_deriv_com_time: 0,
            signup_time: 0,
            switch_currency_accounts_time: 0,
            switch_from_demo_to_real_time: 0,
            switch_from_real_to_demo_time: 0,
        };
    }

    window.performance_metrics[action] = Date.now();
};

export const setPerformanceValue = (action: keyof typeof global.Window.prototype.performance_metrics) => {
    if (window.performance_metrics?.[action]) {
        const value = (Date.now() - window.performance_metrics[action]) / 1000;
        window.performance_metrics[action] = 0;

        const event_name = 'ce_performance_metrics';
        // @ts-expect-error types will be added in the next version of analytics package
        Analytics.trackEvent(event_name, {
            action,
            value,
        });
    }
};
