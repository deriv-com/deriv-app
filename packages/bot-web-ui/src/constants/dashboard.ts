import { localize } from '@deriv/translations';

export const STRATEGY = {
    OPEN: 'open',
    EDIT: 'edit',
    SAVE: 'save',
    DELETE: 'delete',
    PREVIEW: 'preview',
    PREVIEW_LIST: 'list',
    INIT: 'init',
};

export const MENU_DESKTOP = [
    {
        type: STRATEGY.OPEN,
        icon: 'IcOpen',
    },
    {
        type: STRATEGY.SAVE,
        icon: 'IcSave',
    },
    {
        type: STRATEGY.DELETE,
        icon: 'IcDelete',
    },
];

export const CONTEXT_MENU_MOBILE = [
    {
        type: STRATEGY.OPEN,
        icon: 'IcOpen',
        label: localize('Open'),
    },
    {
        type: STRATEGY.SAVE,
        icon: 'IcSave',
        label: localize('Save'),
    },
    {
        type: STRATEGY.DELETE,
        icon: 'IcDelete',
        label: localize('Delete'),
    },
];
