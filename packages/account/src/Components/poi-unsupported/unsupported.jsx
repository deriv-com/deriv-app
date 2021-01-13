import React from 'react';
import { localize } from '@deriv/translations';
import { Timeline } from '@deriv/components';
import { connect } from 'Stores/connect';
import DetailComponent from './detail-component.jsx';
import { Documents } from './documents.jsx';
import { getDocumentIndex } from './constants';

const Unsupported = ({ residence }) => {
    const [detail, setDetail] = React.useState(null);
    const toggleDetail = index => setDetail(index);
    const documents = getDocumentIndex({
        setDetail,
        residence,
    });

    if (detail !== null) {
        return (
            <DetailComponent
                steps={documents[detail].steps}
                root_class='unsupported-country-poi'
                onClickBack={() => setDetail(null)}
            />
        );
    }

    return (
        <Timeline className='unsupported-country-poi' disabled_items={[2]}>
            <Timeline.Item item_title={localize('Please upload one of the following documents:')}>
                <Documents documents={documents} toggleDetail={toggleDetail} />
            </Timeline.Item>
            <Timeline.Item item_title={localize('Upload your selfie')}>
                <div />
            </Timeline.Item>
        </Timeline>
    );
};

export default connect(({ client }) => ({
    residence: client.residence,
}))(Unsupported);
