import React from 'react';
import { Button } from '@deriv/components';
import classNames from 'classnames';
import { localize } from '@deriv/translations';
import { TQStrategyFooter } from './q-strategy-components.types';

const QStrategyFooter = ({
    is_onscreen_keyboard_active,
    is_mobile,
    is_submit_enabled,
    is_stop_button_visible,
    setFieldValue,
    submitForm,
}: TQStrategyFooter) => (
    <div
        className={classNames('quick-strategy__form-footer', {
            'quick-strategy__form-footer--active-keyboard': is_onscreen_keyboard_active,
        })}
    >
        <Button.Group>
            {!is_mobile && (
                <Button
                    type='button'
                    id='db-quick-strategy__button-edit'
                    text={localize('Create and edit')}
                    is_disabled={!is_submit_enabled}
                    secondary
                    large
                    onClick={() => {
                        setFieldValue('button', 'edit');
                        submitForm();
                    }}
                />
            )}
            <Button
                type='button'
                id='db-quick-strategy__button-run'
                text={localize('Run')}
                is_disabled={!is_submit_enabled || is_stop_button_visible}
                primary
                large
                onClick={() => {
                    setFieldValue('button', 'run');
                    submitForm();
                }}
            />
        </Button.Group>
    </div>
);

export default React.memo(QStrategyFooter);
