import React from 'react';
import { connect } from 'Stores/connect';
import { DesktopWrapper, MobileWrapper } from '@deriv/components';

const NewSideNote = ({ children, is_mobile }) => {
    return (
        <>
            {is_mobile && <MobileWrapper>{children}</MobileWrapper>}
            {!is_mobile && <DesktopWrapper>{children}</DesktopWrapper>}
        </>
    );
};

export default connect(() => ({}))(NewSideNote);
