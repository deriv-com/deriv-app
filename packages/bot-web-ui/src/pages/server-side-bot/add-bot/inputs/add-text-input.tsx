import React from 'react';
import { useFormikContext } from 'formik';
import { Popover } from '@deriv/components';
import { useStore } from '@deriv/stores';
import { TFormData } from 'Stores/server-bot-store';
import './add-text-input.scss';

export default function QsTextInput({ name, field }: { name: string; field: any }) {
    const { values, setFieldTouched, setFieldValue, errors } = useFormikContext<TFormData>();
    const [has_focus, setFocus] = React.useState(false);
    const {
        ui: { is_desktop },
    } = useStore();
    const error = errors[name];
    return (
        <div className='ssb-qs-text'>
            <Popover
                alignment='bottom'
                message={errors[name]}
                is_open={!is_desktop ? !!error : !!error && has_focus}
                zIndex='9999'
                classNameBubble='ssb-add__warning-bubble'
                has_error
                should_disable_pointer_events
            >
                <div
                    className={`${error ? 'ssb-qs-text__error' : ''}`}
                    onMouseEnter={() => setFocus(true)}
                    onMouseLeave={() => setFocus(false)}
                >
                    <input
                        name={name}
                        className='dc-input__field'
                        {...field}
                        onChange={e => {
                            const trimmedValue = e.target.value.replace(/^\s+/, '');
                            setFieldValue(name, trimmedValue, true);
                            setFieldTouched(name, true, false);
                        }}
                        value={values[name]}
                    />
                </div>
            </Popover>
        </div>
    );
}
