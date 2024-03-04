declare global {
    interface Window {
        sendRequestsStatistic: (is_running: boolean) => void;
        setIsDataDogLoggingEnabled: (is_datadog_logging_enabled: boolean) => void;
    }
}

export {};
