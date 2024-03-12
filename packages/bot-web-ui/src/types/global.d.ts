declare global {
    interface Window {
        sendRequestsStatistic: (is_running: boolean) => void;
        is_datadog_logging_enabled: boolean;
        DD_RUM: object | undefined;
    }
}

export {};
