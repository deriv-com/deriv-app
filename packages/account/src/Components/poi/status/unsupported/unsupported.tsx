import React from 'react';
import { FormikValues } from 'formik';
import { Button, Text } from '@deriv/components';
import { AUTH_STATUS_CODES, getPlatformRedirect, isMobile, platforms } from '@deriv/shared';
import { TStores } from '@deriv/stores/types';
import { Localize } from '@deriv/translations';
import {
    getPOIStatusMessages,
    getUploadCompleteStatusMessages,
    TPoiStatus,
} from '../../../../Sections/Verification/ProofOfIdentity/proof-of-identity-configs';
import { DOCUMENT_TYPES, getDocumentIndex } from './constants';
import DetailComponent from './detail-component';
import { Documents } from './documents';
import VerificationStatus from '../../../verification-status/verification-status';
import FormFooter from '../../../form-footer';

const checkNimcStep = (documents: FormikValues) => {
    let has_nimc = false;
    documents.forEach((document: FormikValues) => {
        if (document.document_type === DOCUMENT_TYPES.NIMC_SLIP) {
            has_nimc = true;
        }
    });
    return has_nimc;
};

type TUnsupported = {
    country_code: string;
    handlePOIforMT5Complete: () => void;
    manual?: {
        status: TPoiStatus;
    };
    redirect_button: React.ReactElement;
    needs_poa: boolean;
    handleBack: () => void;
    handleRequireSubmission: () => void;
    handleViewComplete: () => void;
    allow_poi_resubmission: boolean;
    onfido?: {
        submissions_left: number;
    };
    is_for_mt5?: boolean;
    app_routing_history: TStores['common']['app_routing_history'];
    routeBackTo: (redirect_route: string) => void;
};

const Unsupported = ({
    country_code,
    handlePOIforMT5Complete,
    manual,
    redirect_button,
    needs_poa,
    handleBack,
    handleRequireSubmission,
    allow_poi_resubmission,
    handleViewComplete,
    onfido,
    routeBackTo,
    app_routing_history = [],
    is_for_mt5,
    ...props
}: TUnsupported) => {
    const [detail, setDetail] = React.useState<number | null>(null);
    const toggleDetail = (index: number) => setDetail(index);

    const documents = getDocumentIndex({
        country_code,
    });

    const from_platform = getPlatformRedirect(app_routing_history);

    const onClickRedirectButton = () => {
        const platform = platforms[from_platform?.ref as keyof typeof platforms];
        const { is_hard_redirect = false, url = '' } = platform ?? {};
        if (is_hard_redirect) {
            window.location.href = url;
            window.sessionStorage.removeItem('config.platform');
        } else {
            routeBackTo?.(from_platform.route);
        }
    };

    const status_content = getPOIStatusMessages(
        manual?.status ?? AUTH_STATUS_CODES.NONE,
        { needs_poa },
        !!redirect_button
    );

    const upload_complete_status_content = getUploadCompleteStatusMessages(
        AUTH_STATUS_CODES.PENDING,
        { needs_poa, is_manual_upload: true },
        !!redirect_button
    );

    if (manual) {
        let content: typeof status_content | typeof upload_complete_status_content = {
            title: null,
            icon: '',
            description: null,
            action_button: null,
        };
        if (manual?.status === AUTH_STATUS_CODES.PENDING) {
            content = upload_complete_status_content;
        } else if (
            manual?.status === AUTH_STATUS_CODES.VERIFIED ||
            manual?.status === AUTH_STATUS_CODES.EXPIRED ||
            ([AUTH_STATUS_CODES.REJECTED, AUTH_STATUS_CODES.SUSPECTED].some(status => status === manual.status) &&
                !allow_poi_resubmission)
        ) {
            content = status_content;
        }

        const onClickHandler = () => {
            if (manual?.status === AUTH_STATUS_CODES.VERIFIED || manual?.status === AUTH_STATUS_CODES.PENDING) {
                return onClickRedirectButton;
            } else if (manual?.status === AUTH_STATUS_CODES.EXPIRED) {
                return handleRequireSubmission;
            }
        };

        return (
            <VerificationStatus
                icon={content.icon}
                is_mobile={isMobile()}
                status_description={content.description}
                status_title={content.title}
            >
                {content.action_button?.({ onClick: onClickHandler(), platform_name: from_platform.name })}
            </VerificationStatus>
        );
    }

    if (detail !== null) {
        const is_onfido_supported =
            country_code === 'ng' &&
            !checkNimcStep(documents[detail ?? 0].details.documents) &&
            onfido &&
            onfido.submissions_left > 0;
        return (
            <DetailComponent
                is_onfido_supported={is_onfido_supported}
                country_code_key={country_code}
                document={documents[detail]}
                root_class='manual-poi'
                onClickBack={() => setDetail(null)}
                handlePOIforMT5Complete={handlePOIforMT5Complete}
                handleComplete={handleViewComplete}
                {...props}
            />
        );
    }

    return (
        <div className='manual-poi'>
            <Text as='h2' color='prominent' size='xs' className='manual-poi__title'>
                <Localize i18n_default_text='Please upload one of the following documents:' />
            </Text>
            <Documents documents={documents} toggleDetail={toggleDetail} />
            {!is_for_mt5 && (
                <FormFooter className='proof-of-identity__footer'>
                    <Button className='back-btn' onClick={handleBack} type='button' has_effect large secondary>
                        <Localize i18n_default_text='Back' />
                    </Button>
                </FormFooter>
            )}
        </div>
    );
};
export default Unsupported;
