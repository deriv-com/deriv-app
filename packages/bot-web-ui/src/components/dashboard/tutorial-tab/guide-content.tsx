import React from 'react';
import { Icon, Dialog, Text } from '@deriv/components';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';
import { localize } from '@deriv/translations';

type TGuideContent = {
    dialog_options: { [key: string]: string };
    faq_search_value: string;
    is_dialog_open: boolean;
    onOkButtonClick: () => void;
    showVideoDialog: (type: string, component: HTMLElement) => void;
};

type TContentArray = {
    id: number;
    type: string;
    content: string;
    url?: string;
};

const contentArray: TContentArray[] = [
    {
        id: 1,
        type: 'DBotVideo',
        content: localize('DBot -- your automated trading partner'),
        url: 'https://www.youtube.com/embed/Bb0HnaYNUx4',
    },
    {
        id: 2,
        type: 'DBotTour',
        content: localize('How to build your bot from scratch using a simple strategy.'),
    },
];

const GuideContent = ({
    dialog_options,
    faq_search_value,
    is_dialog_open,
    onOkButtonClick,
    showVideoDialog,
}: TGuideContent) => {
    const [finalContentArray, setFinalContentArray] = React.useState<TContentArray[]>(contentArray);

    React.useEffect(() => {
        if (faq_search_value) {
            const filteredArray = contentArray.filter(data => {
                return data.content.toLowerCase().includes(faq_search_value);
            });
            return setFinalContentArray(filteredArray);
        }
        return setFinalContentArray(contentArray);
    }, [faq_search_value]);

    return (
        <div className='tutorials-wrap'>
            <Text align='center' weight='bold' color='prominent' line_height='s'>
                Guides
            </Text>
            <div className='tutorials-wrap__group'>
                {finalContentArray.length > 0 ? (
                    finalContentArray.map(items => {
                        const { id, content, type, url } = items;
                        return (
                            <div className='tutorials-wrap__group__cards' key={id}>
                                <div className='tutorials-wrap__placeholder'>
                                    <div className='tutorials-wrap__placeholder__button-group'>
                                        <Icon
                                            className='tutorials-wrap__placeholder__button-group--play'
                                            width='4rem'
                                            height='4rem'
                                            icon={'IcPlayOutline'}
                                            onClick={() => {
                                                showVideoDialog(
                                                    type,
                                                    <React.Fragment>
                                                        <iframe
                                                            width='100%'
                                                            height='100%'
                                                            src={url}
                                                            frameBorder='0'
                                                            allowFullScreen
                                                        />
                                                    </React.Fragment>
                                                );
                                            }}
                                        />
                                    </div>
                                </div>
                                <Text align='center' color='prominent' line_height='s' size='s'>
                                    {content}
                                </Text>
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
                    onCancel={onOkButtonClick}
                    confirm_button_text={localize('OK')}
                    onConfirm={onOkButtonClick}
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
    showVideoDialog: dashboard.showVideoDialog,
    dialog_options: dashboard.dialog_options,
    toggleLoadModal: load_modal.toggleLoadModal,
}))(GuideContent);
