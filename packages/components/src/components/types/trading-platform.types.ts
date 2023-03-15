export interface TTradingPlatformProps<T> {
    icon: T;
    className?: string;
    size?: number;
    onClick?: () => void;
}
