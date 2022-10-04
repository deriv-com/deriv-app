import React from 'react';
import { Icon, Dialog, Text } from '@deriv/components';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/root-store';
import { localize } from '@deriv/translations';

type TGuideContent = {
    faq_search_value: string;
    is_dialog_open: boolean;
    is_running: boolean;
    closeResetDialog: () => void;
    onOkButtonClick: () => void;
    showVideoDialog: (type: string, url?: string) => void;
    dialog_options: { [key: string]: string };
};

const GuideContent = ({
    faq_search_value,
    is_dialog_open,
    onOkButtonClick,
    closeResetDialog,
    showVideoDialog,
    dialog_options,
}: TGuideContent) => {
    type TcontentArray = {
        id: number;
        type: string;
        content: string;
        url?: string;
    };

    const contentArray: TcontentArray[] = [
        {
            id: 1,
            type: 'DBotVideo',
            content: 'DBot -- your automated trading partner',
            url: 'https://www.youtube.com/watch?v=tvBiEIq3G7k',
        },
        {
            id: 2,
            type: 'DBotTour',
            content: 'How to build your bot from scratch using a simple strategy.',
        },
    ];
    const [finalContentArray, setfinalContentArray] = React.useState(contentArray);

    React.useEffect(() => {
        if (faq_search_value) {
            const filteredArray = contentArray.filter(data => {
                return data.content.toLowerCase().includes(faq_search_value);
            });
            setfinalContentArray(filteredArray);
        }
    }, [faq_search_value]);

    return (
        <div className='dc-tabs__inner-content'>
            <h1 className='dc-tabs__inner-content--heading'>Guides</h1>
            <div className='dc-tabs__inner-content--card'>
                {finalContentArray.length > 0 ? (
                    finalContentArray.map(items => {
                        const { id, content, type, url } = items;
                        return (
                            <div className='dc-tabs__inner-content--card-holder' key={id}>
                                <div className='dc-tabs__inner-content--card-holder-placeholder'>
                                    <div className='dc-tabs__inner-content--card-holder-placeholder--button-group'>
                                        <Icon
                                            className='dc-tabs__inner-content--card-holder-placeholder--button-group-play'
                                            width='4rem'
                                            height='4rem'
                                            icon={'IcPlayOutline'}
                                            onClick={() => {
                                                showVideoDialog(type, url);
                                            }}
                                        />
                                    </div>
                                </div>
                                <span className='dc-tabs__inner-content--card-holder-label'>{content}</span>
                            </div>
                        );
                    })
                ) : (
                    <Text as='h1' weight='bold' line_height='xxs'>
                        {localize('No results found "{{ faq_search_value }}"', {
                            faq_search_value,
                        })}
                    </Text>
                )}
                <Dialog
                    title={dialog_options.title}
                    is_visible={is_dialog_open}
                    cancel_button_text={localize('Cancel')}
                    onCancel={closeResetDialog}
                    confirm_button_text={localize('OK')}
                    onConfirm={onOkButtonClick || onOkButtonClick}
                    is_mobile_full_width
                    className={'dc-dialog dc-dialog__wrapper-guide--fixed'}
                    has_close_icon
                    onClose={onOkButtonClick}
                >
                    {dialog_options.message}
                </Dialog>
            </div>
        </div>
    );
};

export default connect(({ dashboard, load_modal }: RootStore) => ({
    faq_search_value: dashboard.faq_search_value,
    is_dialog_open: dashboard.is_dialog_open,
    onOkButtonClick: dashboard.onCloseDialog,
    closeResetDialog: dashboard.onCloseDialog,
    showVideoDialog: dashboard.showVideoDialog,
    dialog_options: dashboard.dialog_options,
    toggleLoadModal: load_modal.toggleLoadModal,
}))(GuideContent);
