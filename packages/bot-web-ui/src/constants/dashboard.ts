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

export const CONTEXT_MENU = [
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
