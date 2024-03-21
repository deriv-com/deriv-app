import React, { useReducer } from 'react';
import { POI_SUBMISSION_STATUS } from '../../constants';
import { POICountrySelector, POIFlowContainer } from '../../containers';
import { TPOIActions } from '../../utils';

export const POI = () => {
    const initialState = {
        selectedCountry: '',
        submissionStatus: '',
    };

    const reducer = (state: typeof initialState, action: TPOIActions) => {
        switch (action.type) {
            case 'setSelectedCountry':
                return { ...state, selectedCountry: action.payload };
            case 'setSubmissionStatus':
                return { ...state, submissionStatus: action.payload };
            default:
                return state;
        }
    };

    const [state, dispatch] = useReducer(reducer, initialState);

    switch (state.submissionStatus) {
        case POI_SUBMISSION_STATUS.COMPLETE:
            return <div>Status to be displayed</div>;
        case POI_SUBMISSION_STATUS.SUBMITTING:
            return <POIFlowContainer countryCode={state.selectedCountry} />;
        default:
            return (
                <POICountrySelector
                    onCountrySelect={value => dispatch({ payload: value, type: 'setSelectedCountry' })}
                />
            );
    }
};
