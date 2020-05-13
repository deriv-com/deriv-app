// TODO lazy-load these components
import ProofOfIdentityContainer from 'Sections/Verification/ProofOfIdentity/proof-of-identity-container.jsx';
import { FormSubHeader, FormBody, FormFooter } from 'Components/layout-components.jsx';
import MultiStep from 'Components/multistep.jsx';
import { poa_status_codes } from 'Sections/Verification/ProofOfAddress/proof-of-address-container.jsx';
import {
    Expired,
    NeedsReview,
    Unverified,
    Verified,
    Submitted,
} from 'Sections/Verification/ProofOfAddress/proof-of-address-messages.jsx';
import FileUploaderContainer from 'Sections/Verification/ProofOfAddress/file-uploader-container.jsx';

export default {
    ProofOfIdentityContainer,
    FormBody,
    FormFooter,
    MultiStep,
    Expired,
    NeedsReview,
    Unverified,
    Verified,
    Submitted,
    poa_status_codes,
    FileUploaderContainer,
    FormSubHeader,
};
