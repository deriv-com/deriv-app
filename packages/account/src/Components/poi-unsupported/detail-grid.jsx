import PropTypes from 'prop-types';
import React from 'react';
import { Card, Icon, Text } from '@deriv/components';
import { localize } from '@deriv/translations';

const DetailGrid = ({ root_class }) => {
    return (
        <div className={`${root_class}__upload-icons`}>
            <Card
                className={`${root_class}__upload-icons--no-margin`}
                renderContent={() => (
                    <React.Fragment>
                        <Icon icon='IcPoiClearPhoto' size={24} />
                        <Text as='p' size='xxs' weight='bold'>
                            {localize('A clear colour photo or scanned image')}
                        </Text>
                    </React.Fragment>
                )}
            />
            <Card
                className={`${root_class}__upload-icons--no-margin`}
                renderContent={() => (
                    <React.Fragment>
                        <Icon icon='IcPoiFileFormat' size={24} />
                        <Text as='p' size='xxs' weight='bold'>
                            {localize('JPEG, JPG, PNG, PDF, or GIF')}
                        </Text>
                    </React.Fragment>
                )}
            />
            <Card
                className={`${root_class}__upload-icons--no-margin`}
                renderContent={() => (
                    <React.Fragment>
                        <Icon icon='IcPoiFileSize' size={24} />
                        <Text as='p' size='xxs' weight='bold'>
                            {localize('Less than 8MB')}
                        </Text>
                    </React.Fragment>
                )}
            />
            <Card
                className={`${root_class}__upload-icons--no-margin`}
                renderContent={() => (
                    <React.Fragment>
                        <Icon icon='IcPoiDocExpiry' size={24} />
                        <Text as='p' size='xxs' weight='bold'>
                            {localize('Must be valid for at least 6 months')}
                        </Text>
                    </React.Fragment>
                )}
            />
        </div>
    );
};

DetailGrid.propTypes = {
    root_class: PropTypes.string,
};

export default DetailGrid;
