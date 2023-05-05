import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { HintBox, Text } from '@deriv/components';
import { useStores } from 'Stores';
import { Localize } from '../i18next';

const TemporarilyBarredHint = () => {
    const { general_store } = useStores();

    if (general_store.is_barred) {
        return (
            <div className='temporarily-barred-hint'>
                <HintBox
                    icon='IcAlertWarning'
                    message={
                        <Text size='xxxs' color='prominent' line_height='xs'>
                            <Localize
                                i18n_default_text="You've been temporarily barred from using our services due to multiple cancellation attempts. Try again after {{date_time}} GMT."
                                values={{ date_time: general_store.blocked_until_date_time }}
                            />
                        </Text>
                    }
                    is_warn
                />
            </div>
        );
    }

    return null;
};

export default observer(TemporarilyBarredHint);
