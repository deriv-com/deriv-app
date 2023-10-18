import { AutoHeightWrapper } from '@deriv/components';
import ProofOfIdentityContainer from './proof-of-identity-container.jsx';
import React from 'react';
import { changeMetaTagWithOG } from '@deriv/shared';
import { withRouter } from 'react-router-dom';

const ProofOfIdentity = ({ is_from_external, onStateChange }) => {
    // next useEffect implements seo requirements
    React.useEffect(() => {
        const description_content = 'Submit your proof of identity documents to verify your account and start trading';
        const title_content = 'Account Verification | Deriv app';

        const restoreMetaTagWithOGDescription = changeMetaTagWithOG('description', description_content);
        const restoreMetaTagWithOGTitle = changeMetaTagWithOG('title', title_content);

        return () => {
            restoreMetaTagWithOGDescription();
            restoreMetaTagWithOGTitle();
        };
    }, []);

    return (
        <AutoHeightWrapper default_height={200}>
            {({ setRef, height }) => (
                <div ref={setRef} className='proof-of-identity'>
                    <div className='proof-of-identity__main-container'>
                        <ProofOfIdentityContainer
                            height={height}
                            is_from_external={is_from_external}
                            onStateChange={onStateChange}
                        />
                    </div>
                </div>
            )}
        </AutoHeightWrapper>
    );
};

export default withRouter(ProofOfIdentity);
