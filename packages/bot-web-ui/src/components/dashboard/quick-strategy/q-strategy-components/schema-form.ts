import * as Yup from 'yup';

export const SchemaFields = Yup.object().shape({
    'quick-strategy__profit': Yup.number()
        .min(2, 'Should be minimum 2 digit long')
        .max(10, 'should not exceed 3 digits')
        .required('Required'),
});
