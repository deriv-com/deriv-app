export type TButtonCommonProps = {
    has_effect: boolean;
    is_disabled: boolean;
    is_loading: boolean;
    is_submit_success: boolean;
    large: boolean;
    medium: boolean;
    primary: boolean;
    primary_light: boolean;
    rounded: boolean;
    secondary: boolean;
    small: boolean;
    transparent: boolean;
};
export type TButtonProps = React.PropsWithChildren<React.ButtonHTMLAttributes<HTMLButtonElement>> &
    TButtonCommonProps & {
        classNameSpan: string;
        type: 'button' | 'submit' | 'reset';
        wrapperClassName: string;
    };

export type TButtonGroupProps = {
    children: React.ReactNode | React.ReactNode[];
    className?: string;
};
