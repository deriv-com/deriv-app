const errorKeyMapping = {
    date_of_birth: 'dateOfBirth',
    first_name: 'firstName',
    last_name: 'lastName',
};

export const mapErrorDetails = (errorDetails: Record<string, unknown> | string) => {
    if (typeof errorDetails === 'object' && errorDetails !== null) {
        return Object.keys(errorDetails).map(key => {
            const camelCaseKey = errorKeyMapping[key as keyof typeof errorKeyMapping] ?? key;
            return camelCaseKey;
        });
    }

    return [String(errorDetails)];
};
