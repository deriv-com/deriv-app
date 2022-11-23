import React from 'react';

export const modals = {
    FilterModal: React.lazy(() =>
        import(/* webpackChunkName: "filter-modal" */ 'Components/modal-manager/modals/filter-modal')
    ),
};
