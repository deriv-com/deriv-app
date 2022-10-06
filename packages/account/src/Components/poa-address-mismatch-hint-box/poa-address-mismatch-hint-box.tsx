import React from 'react';
import { Text, HintBox } from '@deriv/components';
import { Localize } from '@deriv/translations';
import './poa-address-mismatch-hint-box.scss';

const POAAddressMismatchHintBox = () => {
    const ref = React.useRef<HTMLDivElement | null>(null);

    React.useEffect(() => {
        // To make scrolling work on mobile we need to add a delay.
        setTimeout(() => ref?.current?.scrollIntoView(), 0);
    }, []);

    return (
        <div className='poa-address-mismatch-hint-box--wrapper' ref={ref}>
            <HintBox
                icon='IcAlertWarning'
                message={
                    <Text size='xxxs' color='prominent' line_height='xs'>
                        <Localize
                            i18n_default_text='It appears that the address in your document doesn’t match the address
    in your Deriv profile. Please update your personal details now with the
    correct address.'
                        />
                    </Text>
                }
                is_warn
            />
        </div>
    );
};

export default POAAddressMismatchHintBox;
