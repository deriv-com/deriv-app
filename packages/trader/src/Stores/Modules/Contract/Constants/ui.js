import React        from 'react';
import { localize } from 'App/i18n';
import Icon         from 'Assets/icon.jsx';

export const getHeaderConfig = () => ({
    purchased: { title: localize('Contract Purchased'), icon: <Icon icon='IconTick' /> },
    won      : { title: localize('Contract Won'),       icon: <Icon icon='ContractIconFlag' /> },
    lost     : { title: localize('Contract Lost'),      icon: <Icon icon='ContractIconFlag' /> },
});
