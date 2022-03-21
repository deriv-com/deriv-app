import React from 'react';
import classNames from 'classnames';
import { localize } from '@deriv/translations';
import { Timeline } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import DetailComponent from './detail-component.jsx';
import { Documents } from './documents.jsx';
import { getDocumentIndex, DOCUMENT_TYPES } from './constants';

const checkNimcStep = documents => {
    let has_nimc = false;
    documents.forEach(document => {
        if (document.document_type === DOCUMENT_TYPES.NIMC_SLIP) {
            has_nimc = true;
        }
    });
    return has_nimc;
};

const Unsupported = ({ country_code, ...props }) => {
    const [detail, setDetail] = React.useState(null);
    const toggleDetail = index => setDetail(index);
    const documents = getDocumentIndex({
        setDetail,
        country_code,
    });

    if (detail !== null) {
        return (
            <DetailComponent
                is_onfido_supported={country_code === 'ng' && !checkNimcStep(documents[detail].details.documents)}
                country_code={country_code}
                document={documents[detail]}
                root_class='manual-poi'
                onClickBack={() => setDetail(null)}
                {...props}
            />
        );
    }

    return (
        <Timeline
            className={classNames('manual-poi', {
                'manual-poi--mobile': isMobile(),
            })}
            disabled_items={[2]}
        >
            <Timeline.Item item_title={localize('Please upload one of the following documents:')}>
                <Documents documents={documents} toggleDetail={toggleDetail} />
            </Timeline.Item>
            <Timeline.Item item_title={localize('Upload your selfie')}>
                <div />
            </Timeline.Item>
        </Timeline>
// old code above
// =======
// master below
const UnsupportedIconRow = () => {
    const { is_appstore } = React.useContext(PlatformContext);
    return (
        <div className='poi-icon-row'>
            <div className='poi-icon-row__icon-container'>
                <Icon icon={is_appstore ? 'IcIdentityCardDashboard' : 'IcIdentityCard'} size={90} />
                <Text color='prominent' as='p'>
                    {localize('Identity card')}
                </Text>
                <Text line_height='xs' color='less-prominent' as='p'>
                    {localize('Front and back')}
                </Text>
            </div>
            <div className='poi-icon-row__icon-container'>
                <Icon icon={is_appstore ? 'IcDrivingLicenseDashboard' : 'IcDrivingLicense'} size={90} />
                <Text color='prominent' as='p'>
                    {localize('Driving license')}
                </Text>
                <Text line_height='xs' color='less-prominent' as='p'>
                    {localize('Front and back')}
                </Text>
            </div>
            <div className='poi-icon-row__icon-container'>
                <Icon icon={is_appstore ? 'IcPassportDashboard' : 'IcPassport'} size={90} />
                <Text color='prominent' as='p'>
                    {localize('Passport')}
                </Text>
                <Text line_height='xs' color='less-prominent' as='p'>
                    {localize('Face photo page')}
                </Text>
            </div>
        </div>
    );
};

const UnsupportedNew = () => {
    const { is_appstore } = React.useContext(PlatformContext);
    return (
        <IconMessageContent
            message={localize('Verify your identity')}
            text={
                <Localize
                    i18n_default_text='To continue trading with us, you need to send us a copy of any one of these government-issued photo ID documents via <0>LiveChat</0>.'
                    components={[
                        <span key={0} className='link link--orange' onClick={() => window.LC_API.open_chat_window()} />,
                    ]}
                />
            }
            className={is_appstore && 'dashboard'}
            icon_row={<UnsupportedIconRow />}
        />
    );
};

export default Unsupported;
