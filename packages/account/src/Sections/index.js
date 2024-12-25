import Account from 'Containers/Account/account';
import PersonalDetails from 'Sections/Profile/PersonalDetails';
import DeactivateAccount from 'Sections/Security/DeactivateAccount'; // TODO: Remove once mobile team has changed this link
import ProofOfAddress from 'Sections/Verification/ProofOfAddress';
import { ProofOfIdentity, ProofOfIdentityContainer, ProofOfIdentityFlow } from 'Sections/Verification/ProofOfIdentity';
import ProofOfIncome from 'Sections/Verification/ProofOfIncome';
import ProofOfOwnership from 'Sections/Verification/ProofOfOwnership';

import EmploymentTaxInfo from '../Containers/employment-tax-info/employment-tax-info';

export {
    PersonalDetails,
    ProofOfIdentityContainer,
    ProofOfIdentity,
    ProofOfAddress,
    ProofOfOwnership,
    ProofOfIncome,
    Account,
    DeactivateAccount,
    EmploymentTaxInfo,
    ProofOfIdentityFlow,
};
