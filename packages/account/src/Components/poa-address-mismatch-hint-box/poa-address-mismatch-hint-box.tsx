import { useRef, useEffect } from 'react';
import { InlineMessage } from '@deriv/components';
import { Localize } from '@deriv/translations';
import './poa-address-mismatch-hint-box.scss';

const POAAddressMismatchHintBox = () => {
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        // To make scrolling work on mobile we need to add a delay.
        setTimeout(() => ref?.current?.scrollIntoView(), 0);
    }, []);

    return (
        <div className='poa-address-mismatch-hint-box--wrapper' ref={ref}>
            <InlineMessage
                type='warning'
                size='xs'
                message={
                    <Localize i18n_default_text='It appears that the address in your document doesn’t match the address in your Deriv profile. Please update your personal details now with the correct address.' />
                }
            />
        </div>
    );
};

export default POAAddressMismatchHintBox;
