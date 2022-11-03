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

export type TPoaStatusProps = {
    needs_poi: boolean;
    is_description_enabled?: boolean;
};
