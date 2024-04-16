import * as Yup from 'yup';

export const validateField = (validationSchema?: Yup.AnySchema) => (value: unknown) => {
    try {
        if (validationSchema) {
            validationSchema.validateSync(value);
        }
    } catch (err: unknown) {
        return (err as Yup.ValidationError).message;
    }
};
