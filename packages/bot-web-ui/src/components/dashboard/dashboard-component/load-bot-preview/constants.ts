import { localize } from '@deriv/translations';

export const STRATEGY = {
    EDIT: 'edit',
    SAVE: 'save',
    DELETE: 'delete',
    PREVIEW: 'preview',
    PREVIEW_LIST: 'list',
};

export const MENU_DESKTOP = [
    {
        type: STRATEGY.EDIT,
        icon: 'IcEdit',
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
        type: STRATEGY.PREVIEW_LIST,
        icon: 'IcPreview',
        label: localize('Preview'),
    },
    {
        type: STRATEGY.EDIT,
        icon: 'IcEdit',
        label: localize('Edit'),
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
