import React from 'react';
import { useLocation } from 'react-router-dom';

const submission_status_code = {
    selecting: 'selecting',
    submitting: 'submitting',
    complete: 'complete',
} as const;

const service_code = {
    idv: 'idv',
    onfido: 'onfido',
    manual: 'manual',
} as const;

type TSubmissionStatus = keyof typeof submission_status_code;
type TSubmissionService = keyof typeof service_code;

export type TPOIContext = {
    submission_status: TSubmissionStatus;
    setSubmissionStatus: React.Dispatch<React.SetStateAction<TSubmissionStatus>>;
    submission_service: TSubmissionService;
    setSubmissionService: React.Dispatch<React.SetStateAction<TSubmissionService>>;
    selected_country: string;
    setSelectedCountry: React.Dispatch<React.SetStateAction<string>>;
};

export const POIContextInitialState: TPOIContext = {
    submission_status: submission_status_code.selecting,
    setSubmissionStatus: () => submission_status_code.selecting,
    submission_service: service_code.idv,
    setSubmissionService: () => service_code.idv,
    selected_country: '',
    setSelectedCountry: () => '',
};

export const POIContext = React.createContext<TPOIContext>(POIContextInitialState);

export const POIProvider = ({ children }: React.PropsWithChildren) => {
    const [submission_status, setSubmissionStatus] = React.useState<TSubmissionStatus>(
        submission_status_code.selecting
    );
    const [submission_service, setSubmissionService] = React.useState<TSubmissionService>(service_code.idv);
    const [selected_country, setSelectedCountry] = React.useState('');
    const location = useLocation();

    const state = React.useMemo(
        () => ({
            submission_status,
            setSubmissionStatus,
            submission_service,
            setSubmissionService,
            selected_country,
            setSelectedCountry,
        }),
        [selected_country, submission_service, submission_status]
    );

    React.useEffect(() => {
        setSubmissionStatus(submission_status_code.selecting);
        setSubmissionService(service_code.idv);
        setSelectedCountry('');
    }, [location.pathname]);

    return <POIContext.Provider value={state}>{children}</POIContext.Provider>;
};
