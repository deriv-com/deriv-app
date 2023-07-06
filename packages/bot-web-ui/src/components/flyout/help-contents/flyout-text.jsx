import React from 'react';
import { PropTypes } from 'prop-types';
import { Text } from '@deriv/components';

const FlyoutText = props => {
    const { text } = props;

    return (
        <Text as='p' size='xs' styles={{ lineHeight: '1.3em' }}>
            {text}
        </Text>
    );
};

FlyoutText.propTypes = {
    text: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

export default FlyoutText;
