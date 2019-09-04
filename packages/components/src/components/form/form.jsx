import React                          from 'react';
import { Formik, Form as FormikForm } from 'formik';

const Form = (props) => (
    <Formik { ...props }>
        {
            (renderProps) => (
                <FormikForm>
                    {
                        props.children(renderProps)
                    }
                </FormikForm>
            )
        }
    </Formik>
);

export default Form;
