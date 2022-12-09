import React from 'react';

export const modals = {
    RatingModal: React.lazy(() =>
        import(/* webpackChunkName: "rating-modal" */ 'Components/modal-manager/modals/rating-modal')
    ),
};
