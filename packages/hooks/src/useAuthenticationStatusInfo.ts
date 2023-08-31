import { useGetAccountStatus } from '@deriv/api';
import { useIsAccountStatusPresent } from './useIsAccountStatusPresent';

type TAcknowledgeStatuses = ('pending' | 'verified')[];
type TFailedCases = ('rejected' | 'expired' | 'suspected')[];

const useAuthenticationStatusInfo = () => {
    const { data: account_status, ...rest } = useGetAccountStatus();

    const is_idv_revoked = useIsAccountStatusPresent('idv_revoked');
    const is_authenticated_with_idv_photoid = useIsAccountStatusPresent('authenticated_with_idv_photoid');

    const STATUSES: {
        NONE: 'none';
        PENDING: 'pending';
        VERIFIED: 'verified';
        REJECTED: 'rejected';
        EXPIRED: 'expired';
        SUSPECTED: 'suspected';
    } = {
        NONE: 'none',
        PENDING: 'pending',
        VERIFIED: 'verified',
        REJECTED: 'rejected',
        EXPIRED: 'expired',
        SUSPECTED: 'suspected',
    };

    const { NONE, PENDING, VERIFIED, REJECTED, EXPIRED, SUSPECTED } = STATUSES;
    const poa_status = account_status?.authentication?.document?.status;
    const poi_status = account_status?.authentication?.identity?.status;

    const risk_classification = account_status?.risk_classification;

    const services = account_status?.authentication?.identity?.services ?? {};
    const {
        idv: { status: idv_status } = {},
        onfido: { status: onfido_status } = {},
        manual: { status: manual_status } = {},
    } = services;

    const acknowledged_status: TAcknowledgeStatuses = [PENDING, VERIFIED];
    const failed_cases: TFailedCases = [REJECTED, EXPIRED, SUSPECTED];

    const poa_not_submitted = poa_status === NONE;
    const need_poa_resubmission = failed_cases.includes(poa_status as TFailedCases[number]);
    const poa_verified = poa_status === VERIFIED;

    const poi_not_submitted = poi_status === NONE;
    const poi_or_poa_not_submitted = poa_not_submitted || poi_not_submitted;
    const poi_and_poa_not_submitted = poa_not_submitted && poi_not_submitted;

    //maltainvest

    // mf = maltainvest: only require onfido and manual
    const mf_jurisdiction_statuses = [onfido_status, manual_status];
    // bvi_labuan_vanuatu jurisdictions: require idv, onfido and manual
    const bvi_labuan_vanuatu_jurisdiction_statuses = [idv_status, onfido_status, manual_status];

    const poi_verified_for_maltainvest = mf_jurisdiction_statuses.includes(VERIFIED);
    const poi_acknowledged_for_maltainvest = mf_jurisdiction_statuses.some(status =>
        acknowledged_status.includes(status as TAcknowledgeStatuses[number])
    );
    const poi_pending_for_maltainvest =
        mf_jurisdiction_statuses.some(status => status === PENDING) && !poi_verified_for_maltainvest;

    const need_poi_for_maltainvest = !poi_acknowledged_for_maltainvest;
    const poi_not_submitted_for_maltainvest = mf_jurisdiction_statuses.every(status => status === NONE);

    const poi_resubmit_for_maltainvest =
        !poi_pending_for_maltainvest && !poi_not_submitted_for_maltainvest && !poi_verified_for_maltainvest;

    const poi_poa_verified_for_maltainvest = poi_verified_for_maltainvest && poa_verified;

    //bvi-labuan-vanuatu
    let poi_acknowledged_for_bvi_labuan_vanuatu;
    if (risk_classification === 'high') {
        poi_acknowledged_for_bvi_labuan_vanuatu = Boolean(
            onfido_status && acknowledged_status.includes(onfido_status as TAcknowledgeStatuses[number])
        );
    } else {
        poi_acknowledged_for_bvi_labuan_vanuatu = bvi_labuan_vanuatu_jurisdiction_statuses.some(status =>
            acknowledged_status.includes(status as TAcknowledgeStatuses[number])
        );
    }
    const need_poi_for_bvi_labuan_vanuatu = !poi_acknowledged_for_bvi_labuan_vanuatu;
    const poi_not_submitted_for_bvi_labuan_vanuatu = bvi_labuan_vanuatu_jurisdiction_statuses.every(
        status => status === NONE
    );

    const poi_verified_for_bvi_labuan_vanuatu = bvi_labuan_vanuatu_jurisdiction_statuses.includes(VERIFIED);

    const poi_pending_for_bvi_labuan_vanuatu =
        bvi_labuan_vanuatu_jurisdiction_statuses.includes(PENDING) && !poi_verified_for_bvi_labuan_vanuatu;

    const poi_resubmit_for_bvi_labuan_vanuatu =
        !poi_pending_for_bvi_labuan_vanuatu &&
        !poi_not_submitted_for_bvi_labuan_vanuatu &&
        !poi_verified_for_bvi_labuan_vanuatu;

    const poi_poa_verified_for_bvi_labuan_vanuatu = poi_verified_for_bvi_labuan_vanuatu && poa_verified;

    // TODO: Check if this status can be removed outside the hook
    const poa_resubmit_for_labuan = is_authenticated_with_idv_photoid;

    const config = {
        // flags and statuses related to POA
        poa: {
            status: poa_status,
            need_resubmission: need_poa_resubmission,

            // flags and statuses related to POA for labuan
            poa_resubmit_for_labuan,
        },

        // flags and statuses related to POI
        poi: {
            status: poi_status,

            maltainvest: {
                verified: poi_verified_for_maltainvest,
                pending: poi_pending_for_maltainvest,
                not_submitted: poi_not_submitted_for_maltainvest,
                need_submission: need_poi_for_maltainvest,
                need_resubmission: poi_resubmit_for_maltainvest,
                acknowledged: poi_acknowledged_for_maltainvest,
            },
            bvi_labuan_vanuatu: {
                verified: poi_verified_for_bvi_labuan_vanuatu,
                pending: poi_pending_for_bvi_labuan_vanuatu,
                not_submitted: poi_not_submitted_for_bvi_labuan_vanuatu,
                need_submission: need_poi_for_bvi_labuan_vanuatu,
                need_resubmission: poi_resubmit_for_bvi_labuan_vanuatu,
                acknowledged: poi_acknowledged_for_bvi_labuan_vanuatu,
            },
        },

        poi_poa: {
            verified_for_maltainvest: poi_poa_verified_for_maltainvest,
            verified_for_bvi_labuan_vanuatu: poi_poa_verified_for_bvi_labuan_vanuatu,
        },

        identity_status: {
            idv: idv_status,
            onfido: onfido_status,
            manual: manual_status,
        },

        // to check if either POI or POA is not submitted
        poi_or_poa_not_submitted,
        // to check if both POI and POA are not submitted
        poi_and_poa_not_submitted,
        is_idv_revoked,
        STATUSES,
        ...rest,
    };

    return config;
};

export default useAuthenticationStatusInfo;
