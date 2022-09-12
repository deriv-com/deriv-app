export type TFormValidation = {
    warnings: { [key: string]: string };
    errors: { [key: string]: string };
};

export type TToken = {
    display_name: string;
    last_used: string;
    scopes: string[];
    token: string;
};
