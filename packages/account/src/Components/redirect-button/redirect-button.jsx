import React from 'react';
import { Button } from '@deriv/components';
import { localize } from '@deriv/translations';

export const RedirectButton = ({ onClick }) => (
    <Button onClick={onClick} primary>
        {localize('Go back P2P')}
    </Button>
);
