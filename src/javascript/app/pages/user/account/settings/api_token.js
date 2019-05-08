const showLocalTimeOnHover = require('../../../../base/clock').showLocalTimeOnHover;
const BinarySocket         = require('../../../../base/socket');
const Dialog               = require('../../../../common/attach_dom/dialog');
const FlexTableUI          = require('../../../../common/attach_dom/flextable');
const FormManager          = require('../../../../common/form_manager');
const localize             = require('../../../../../_common/localize').localize;

const APIToken = (() => {
    const error_class = 'errorfield';
    const form_id     = '#token_form';
    const max_tokens  = 30;

    let $table_container,
        $form;

    const onLoad = () => {
        $table_container = $('#tokens_list');
        $form            = $(form_id);

        BinarySocket.send({ api_token: 1 }).then(populateTokensList);

        const regex_msg = localize('Only [_1] are allowed.', [...localize(['letters', 'numbers', 'space']), '_'].join(', '));
        FormManager.init(form_id, [
            { selector: '#txt_name',           request_field: 'new_token',        validations: ['req', ['regular', { regex: /^[\w\s]+$/, message: regex_msg }], ['length', { min: 2, max: 32 }]] },
            { selector: '[id*="chk_scopes_"]', request_field: 'new_token_scopes', validations: [['req', { message: localize('Please select at least one scope') }]], value: getScopes },

            { request_field: 'api_token', value: 1 },
        ]);
        FormManager.handleSubmit({
            form_selector       : form_id,
            fnc_response_handler: newTokenResponse,
            enable_button       : true,
        });
    };

    const newTokenResponse = (response) => {
        if (response.error) {
            showFormMessage(response.error.message, false);
            return;
        }
        showFormMessage(localize('New token created.'), true);
        $('#txt_name').val('');

        populateTokensList(response);
    };

    const getScopes = () => (
        $form.find('[id*="chk_scopes_"]:checked').map(function () { return $(this).val(); }).get()
    );

    // -----------------------
    // ----- Tokens List -----
    // -----------------------
    const populateTokensList = (response) => {
        if ('error' in response) {
            showErrorMessage(response.error.message);
            return;
        }

        clearMessages();

        const tokens = response.api_token.tokens;
        if (tokens.length === 0) {
            $table_container.setVisibility(0);
            return;
        } else if (tokens.length >= max_tokens) {
            $form.setVisibility(0);
            showErrorMessage(localize('The maximum number of tokens ([_1]) has been reached.', max_tokens));
        } else {
            $form.setVisibility(1);
        }

        $table_container.setVisibility(1).empty();

        FlexTableUI.init({
            id       : 'tokens_table',
            container: $table_container,
            header   : localize(['Name', 'Token', 'Scopes', 'Last Used', 'Action']),
            cols     : ['name', 'token', 'scopes', 'last-used', 'action'],
            data     : tokens,
            formatter: formatToken,
            style    : ($row, token) => {
                if (token.display_name === response.echo_req.new_token) {
                    $row.addClass('new');
                }
                $row.attr('id', token.token);
                createDeleteButton($row, token);
            },
        });
        showLocalTimeOnHover('td.last-used');
    };

    const createDeleteButton = ($row, token) => {
        const message = localize('Are you sure that you want to permanently delete the token');
        const $button = $('<button/>', { class: 'button btn_delete', text: localize('Delete') });
        $button.click((e) => {
            e.preventDefault();
            e.stopPropagation();
            Dialog.confirm({
                id               : 'delete_token_dialog',
                localized_message: `${message}: "${token.display_name}"?`,
                onConfirm        : () => {
                    deleteToken(token.token);
                },
            });
        });
        $row.children('.action').html($button);
    };

    const formatToken = (token) => {
        const last_used_text   = (token.last_used ? `${token.last_used} GMT` : localize('Never Used'));
        const localized_scopes = token.scopes.map(scope => $form.find(`label[for='chk_scopes_${scope}'] span`).text()).join(', ');
        return [
            token.display_name,
            token.token,
            localized_scopes,
            last_used_text,
            '',  // btn_delete
        ];
    };

    const deleteToken = (token) => {
        BinarySocket.send({
            api_token   : 1,
            delete_token: token,
        }).then((response) => {
            $(`#${response.echo_req.delete_token}`)
                .removeClass('new')
                .addClass('deleting')
                .fadeOut(700, function () {
                    $(this).remove();
                    populateTokensList(response);
                });
        });
    };

    // -----------------------------
    // ----- Message Functions -----
    // -----------------------------
    const showErrorMessage = (localized_msg) => {
        $('#token_message').setVisibility(1)
            .find('p')
            .attr('class', error_class)
            .html(localized_msg);
    };

    const showFormMessage = (localized_msg, is_success) => {
        $('#msg_form')
            .attr('class', is_success ? 'success-msg' : error_class)
            .html(is_success ? `<ul class="checked"><li>${localized_msg}</li></ul>` : localized_msg)
            .css('display', 'block')
            .delay(3000)
            .fadeOut(1000);
    };

    const clearMessages = () => {
        $('#token_message').setVisibility(0);
    };

    return {
        onLoad,
    };
})();

module.exports = APIToken;
