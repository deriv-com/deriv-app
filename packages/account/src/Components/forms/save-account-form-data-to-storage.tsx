import React from 'react';
import { FormikValues, useFormikContext } from 'formik';
import { isEmptyObject } from '@deriv/shared';
import { useLocalStorageData } from '@deriv/hooks';

const SaveAccountFormDataToStorage = () => {
    const [data, setData] = useLocalStorageData<Record<string, unknown>>('account_form_data');
    const { setValues, values } = useFormikContext<FormikValues>();

    React.useEffect(() => {
        if (!isEmptyObject(data)) {
            setValues({ ...values, ...data });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        setData(values);
    }, [values, setData]);

    return null;
};

export default SaveAccountFormDataToStorage;
