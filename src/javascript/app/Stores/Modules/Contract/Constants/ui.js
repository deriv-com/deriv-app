import React        from 'react';
import { localize } from '_common/localize';
import Icon         from 'Assets/Common';

export const getHeaderConfig = () => ({
    purchased: { title: localize('Contract Purchased'), icon: <Icon icon='IconTick' /> },
    won      : { title: localize('Contract Won'),       icon: <Icon icon='IconFlag' /> },
    lost     : { title: localize('Contract Lost'),      icon: <Icon icon='IconFlag' /> },
});
