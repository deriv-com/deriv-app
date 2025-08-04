import Account from 'Containers/Account/account';
import PersonalDetails from 'Sections/Profile/PersonalDetails';
import DeactivateAccount from 'Sections/Security/DeactivateAccount'; // TODO: Remove once mobile team has changed this link
import { ProofOfAddress, ProofOfAddressFlow } from 'Sections/Verification/ProofOfAddress';
import { ProofOfIdentity, ProofOfIdentityContainer, ProofOfIdentityFlow } from 'Sections/Verification/ProofOfIdentity';
import ProofOfIncome from 'Sections/Verification/ProofOfIncome';
import ProofOfOwnership from 'Sections/Verification/ProofOfOwnership';

import EmploymentTaxInfo from '../Containers/employment-tax-info/employment-tax-info';

// eslint-disable-next-line no-console
console.log(`File Upload Engine hash update: ${Math.random()}`);
export {
    PersonalDetails,
    ProofOfIdentityContainer,
    ProofOfIdentity,
    ProofOfIdentityFlow,
    ProofOfAddress,
    ProofOfAddressFlow,
    ProofOfOwnership,
    ProofOfIncome,
    Account,
    DeactivateAccount,
    EmploymentTaxInfo,
};
