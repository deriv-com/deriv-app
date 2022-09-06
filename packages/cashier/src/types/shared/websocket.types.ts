export type TServerError = {
    code: string;
    message: string;
    details?: { [key: string]: string };
};
