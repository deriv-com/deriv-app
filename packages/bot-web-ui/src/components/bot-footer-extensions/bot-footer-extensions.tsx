import React from 'react';
import { useStore, observer } from '@deriv/stores';
import SecurityAndPrivacy from './security-and-privacy';

const BotFooterExtensions = observer(() => {
    const {
        ui: { populateFooterExtensions },
    } = useStore();
    React.useEffect(() => populateFooter(), []);
    React.useEffect(() => () => populateFooterExtensions([]), [populateFooterExtensions]);

    const populateFooter = () => {
        populateFooterExtensions([
            // TODO: need to import an icon on the left side of this footer extension
            {
                position: 'right',
                Component: SecurityAndPrivacy,
                has_right_separator: true,
            },
        ]);
    };

    return null;
});

export default BotFooterExtensions;
