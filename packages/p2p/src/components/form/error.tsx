import React from 'react';
import './form.scss';
import { Text } from '@deriv/components';

type FormSubmitErrorMessageProps = {
    message: string
};

const FormSubmitErrorMessage = (
    {
        message
    }: FormSubmitErrorMessageProps
) => <Text as='p' color='loss-danger' size='xxs' className='dp2p-form-error'>
    {message}
</Text>;

export default FormSubmitErrorMessage;
