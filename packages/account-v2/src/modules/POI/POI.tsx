import React, { useEffect, useReducer } from 'react';
import { useKycAuthStatus } from '@deriv/api-v2';
import { Loader } from '@deriv-com/ui';
import { AUTH_STATUS_CODES, POI_SUBMISSION_STATUS } from '../../constants';
import { POICountrySelector, POIFlowContainer } from '../../containers';
import { TPOIActions } from '../../utils';

export const POI = () => {
    const { isLoading, kyc_auth_status: kycAuthStatus } = useKycAuthStatus();

    const poiStatus = kycAuthStatus?.identity.status;

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

    useEffect(() => {
        if (!isLoading && poiStatus !== AUTH_STATUS_CODES.NONE) {
            dispatch({ payload: POI_SUBMISSION_STATUS.COMPLETE, type: 'setSubmissionStatus' });
        }
    }, [poiStatus, isLoading]);

    if (isLoading) {
        return <Loader />;
    }

    switch (state.submissionStatus) {
        case POI_SUBMISSION_STATUS.COMPLETE:
            return <div>Status to be displayed</div>;
        case POI_SUBMISSION_STATUS.SUBMITTING:
            return (
                <POIFlowContainer
                    countryCode={state.selectedCountry}
                    onCancel={() => dispatch({ payload: POI_SUBMISSION_STATUS.SELECTING, type: 'setSubmissionStatus' })}
                />
            );
        default:
            return (
                <POICountrySelector
                    handleNext={() =>
                        dispatch({ payload: POI_SUBMISSION_STATUS.SUBMITTING, type: 'setSubmissionStatus' })
                    }
                    onCountrySelect={value => {
                        dispatch({ payload: value, type: 'setSelectedCountry' });
                    }}
                />
            );
    }
};
