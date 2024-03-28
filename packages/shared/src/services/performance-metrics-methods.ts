// import { Analytics } from '@deriv-com/analytics';

declare global {
    interface Window {
        performance_metrics: {
            create_cfds_time: number;
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

export const startPerformanceEventTimer = (action: keyof typeof global.Window.prototype.performance_metrics) => {
    if (!window.performance_metrics) {
        window.performance_metrics = {
            create_cfds_time: 0,
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
    if (window.performance_metrics && window.performance_metrics[action]) {
        const value = window.performance_metrics ? Date.now() - window.performance_metrics[action] : undefined;

        // console.log('action = ', action, ', ms = ', value);
        window.performance_metrics[action] = 0;

        // const event_name = 'ce_performance_metrics';
        // Analytics.trackEvent(event_name, {
        //     action,
        //     some_data,
        // });
    }
};
