export type TReactChangeEvent = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

export type TReactMouseEvent = React.MouseEvent<HTMLElement>;

export type TReactFormEvent = React.FormEvent<HTMLInputElement>;

export type TReactElement = React.ReactElement;

export type TSideNotesProps = Array<string | JSX.Element | JSX.Element[]> | null;

export type TTarget = {
    target: {
        name?: string;
        value: string;
    };
};
