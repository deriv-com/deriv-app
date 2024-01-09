declare global {
    interface Window {
        sendRequestsStatistic: (is_running: boolean) => void;
    }
}

export {};
