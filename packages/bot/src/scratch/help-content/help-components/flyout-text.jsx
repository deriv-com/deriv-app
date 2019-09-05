import React            from 'react';
import { PropTypes }    from 'prop-types';
import { translate }    from '../../../utils/lang/i18n';

const FlyoutText = props => {
    const { text } = props;

    return (
        <p className='flyout__item'>{translate(text)}</p>
    );
};

FlyoutText.propTypes = {
    text: PropTypes.string,
};

export default FlyoutText;
