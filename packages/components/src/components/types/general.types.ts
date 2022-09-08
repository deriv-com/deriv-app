export type TStyle = {
    [key: string]: string;
};

export type TChildren = React.ReactNode | React.ReactNode[];

export type TTextProps = {
    line_height?: string;
    size?: string;
    children?: TChildren;
    color?: string;
    align?: string;
    weight?: string;
    as?: string;
    className?: string;
    styles?: TStyle;
};
