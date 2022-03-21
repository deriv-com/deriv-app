import React from 'react';
import { PropTypes } from 'prop-types';
import { localize } from '@deriv/translations';
import { Text } from '@deriv/components';

const FlyoutText = props => {
    const { text } = props;

    return (
        <Text as='p' size='xs' styles={{ lineHeight: '1.3em' }}>
            {localize(text)}
        </Text>
    );
};

FlyoutText.propTypes = {
    text: PropTypes.string,
};

export default FlyoutText;
