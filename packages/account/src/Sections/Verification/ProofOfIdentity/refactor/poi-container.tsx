import { observer } from '@deriv/stores';
import { useKycAuthStatus } from '../../../../hooks';
import { Loading } from '@deriv/components';
import POISubmission from './poi-submission';

type ProofOfIdentityContainerProps = {
    height: number;
    is_from_external: boolean;
    onStateChange: () => void;
};

// this will render one of the following components based on the identity status:
// 1. POISubmission
// 2. NotRequired
// 3. UploadComplete
// 4. Verified
// 5. Expired
// 6. Limited
// 7. Idv (status)
// 8. Onfido (status)
// 9. Unsupported

const ProofOfIdentityContainer = observer(
    ({ height, is_from_external, onStateChange }: ProofOfIdentityContainerProps) => {
        const { kyc_auth_status, isLoading } = useKycAuthStatus();
        const identity = kyc_auth_status?.identity;

        if (isLoading) {
            return <Loading is_fullscreen={false} />;
        } else if (identity?.status === 'expired') {
            return <div>Expired</div>;
        } else if (identity?.status === 'pending') {
            return <div>Pending</div>;
        } else if (identity?.status === 'rejected') {
            return <div>Rejected</div>;
        } else if (identity?.status === 'suspected') {
            return <div>Suspected</div>;
        } else if (identity?.status === 'verified') {
            return <div>Verified</div>;
        } else if (identity?.status === 'none') {
            return <POISubmission />;
        }
        return <div>ProofOfIdentityContainer</div>;
    }
);

export default ProofOfIdentityContainer;
cccccbhhflncntkffjvfjblddigtgkvudctdb