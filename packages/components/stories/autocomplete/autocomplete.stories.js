import { Formik, Field } from 'formik';
import { storiesOf } from '@storybook/react';
import Autocomplete from 'Components/autocomplete';
import React from 'react';
import notes from './README.md';
import './autocomplete.stories.scss';

storiesOf('AutoComplete', module).add(
    'Main function',
    () => {
        const data = [
            { text: 'Malaysia', value: 'ML' },
            { text: 'China', value: 'CH' },
            { text: 'USA', value: 'US' },
            { text: 'Canada', value: 'CA' },
            { text: 'Sweden', value: 'SE' },
            { text: 'Norway', value: 'NO' },
        ];
        return (
            <React.Fragment>
                <div className={'autocomplete__wrapper'}>
                    <Formik initialValues={{ citizen: '' }}>
                        {({ setFieldValue }) => (
                            <Field name='citizen'>
                                {({ field }) => (
                                    <Autocomplete
                                        {...field}
                                        type='text'
                                        label={'Place of birth'}
                                        list_items={data}
                                        onItemSelection={({ value, text }) => {
                                            setFieldValue('citizen', value ? text : '');
                                        }}
                                        required
                                    />
                                )}
                            </Field>
                        )}
                    </Formik>
                </div>
            </React.Fragment>
        );
    },
    {
        notes,
    }
);
