import React from 'react';
import { observer, useStore } from '@deriv/stores';
import SecurityAndPrivacy from './security-and-privacy';

const BotFooterExtensions = observer(() => {
    const { ui } = useStore();
    const { populateFooterExtensions } = ui;
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
