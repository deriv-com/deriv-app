const setExternalTimer  = require('../../../base/clock').setExternalTimer;
const BinarySocket      = require('../../../base/socket');
const getHighestZIndex  = require('../../../../_common/utility').getHighestZIndex;
const removeDigitTicker = require('../../trade/digit_ticker').remove;

const ViewPopupUI = (() => {
    let $container,
        stream_ids,
        chart_stream_ids,
        triggerOnClose;

    const init = () => {
        $container = null;
    };

    const container = (refresh) => {
        if (refresh) {
            if ($container) {
                $container.remove();
            }
            $container = null;
        }
        if (!$container) {
            const $con = $('<div class="inpage_popup_container" id="sell_popup_container"><a class="close"></a><div class="inpage_popup_content"></div></div>');
            $con.hide();
            const onClose = () => {
                cleanup(true);
                $(document).off('keydown');
                $(window).off('popstate', onClose);
                removeDigitTicker();
            };
            $con.find('a.close').on('click', onClose);
            $(document).on('keydown', (e) => {
                if (e.which === 27) onClose();
            });
            $(window).on('popstate', onClose);
            $container = $con;
        }
        return $container;
    };

    const cleanup = (is_close) => {
        forgetStreams();
        forgetChartStreams();
        setExternalTimer(null);
        closeContainer();
        init();
        if (typeof triggerOnClose === 'function') {
            triggerOnClose();
            if (is_close) {
                triggerOnClose = '';
            }
        }
        $(window).off('resize', () => { repositionConfirmation(); });
    };

    const forgetStreams = () => {
        while (stream_ids && stream_ids.length > 0) {
            const id = stream_ids.pop();
            if (id && id.length > 0) {
                BinarySocket.send({ forget: id });
            }
        }
    };

    const forgetChartStreams = () => {
        while (chart_stream_ids && chart_stream_ids.length > 0) {
            const id = chart_stream_ids.pop();
            if (id && id.length > 0) {
                BinarySocket.send({ forget: id });
            }
        }
    };

    const closeContainer = () => {
        if ($container) {
            $container.hide().remove();
            $('.popup_page_overlay').hide().remove();
            $container = null;
        }
        $('html').removeClass('no-scroll');
    };

    const disableButton = (button) => {
        $('.open_contract_details[disabled]').each(function () {
            enableButton($(this));
        });
        button.attr('disabled', 'disabled');
        button.fadeTo(0, 0.5);
    };

    const enableButton = (button) => {
        button.removeAttr('disabled');
        button.fadeTo(0, 1);
    };

    const showInpagePopup = (data, containerClass, dragHandle) => {
        const con = container(true);
        if (containerClass) {
            con.addClass(containerClass);
        }
        if (data) {
            $('.inpage_popup_content', con).html(data);
        }
        const body = $(document.body);
        con.css('position', 'fixed').css('z-index', getHighestZIndex() + 100);
        body.append(con);
        con.show();
        // $('html').addClass('no-scroll');
        $(document.body).append($('<div/>', { class: 'popup_page_overlay' }));
        $('.popup_page_overlay').click(() => { container().find('a.close').click(); });
        con.draggable({
            stop  : () => { repositionConfirmationOnDrag(); },
            handle: dragHandle,
            scroll: false,
        });
        repositionConfirmation();
        $(window).resize(() => { repositionConfirmation(); });
        return con;
    };

    const repositionConfirmationOnDrag = () => {
        const con     = container();
        const offset  = con.offset();
        const $window = $(window);
        // top
        if (offset.top < $window.scrollTop()) { con.offset({ top: $window.scrollTop() }); }
        // left
        if (offset.left < 0) { con.offset({ left: 0 }); }
        // right
        if (offset.left > $window.width() - con.width()) { con.offset({ left: $window.width() - con.width() }); }
    };

    const repositionConfirmation = (x, y) => {
        const con     = container();
        const $window = $(window);
        let x_min     = 0;
        let y_min     = 500;
        if ($window.width() < 767) { // To be responsive, on mobiles and phablets we show popup as full screen.
            x_min = 0;
            y_min = 0;
        }
        let new_x,
            new_y;
        if (x === undefined) {
            new_x = Math
                .max(Math.floor(($window.width() - $window.scrollLeft() - con.width()) / 2), x_min)
                + $window.scrollLeft();
        }
        if (y === undefined) {
            new_y = Math.min(Math.floor(($window.height() - con.height()) / 2), y_min) + $window.scrollTop();
            if (y < $window.scrollTop()) { new_y = $window.scrollTop(); }
        }
        con.offset({ left: x || new_x, top: y || new_y });
        repositionConfirmationOnDrag();
    };

    // ===== Dispatch =====
    const storeSubscriptionID = (id, is_chart) => {
        if (!stream_ids && !is_chart) {
            stream_ids = [];
        }
        if (!chart_stream_ids) {
            chart_stream_ids = [];
        }
        if (id && id.length > 0) {
            if (!is_chart && $.inArray(id, stream_ids) < 0) {
                stream_ids.push(id);
            } else if (is_chart && $.inArray(id, chart_stream_ids) < 0) {
                chart_stream_ids.push(id);
            }
        }
    };

    return {
        cleanup,
        forgetStreams,
        disableButton,
        enableButton,
        showInpagePopup,
        repositionConfirmation,
        storeSubscriptionID,

        setOnCloseFunction: (onCloseFnc) => { triggerOnClose = onCloseFnc; },
    };
})();

module.exports = ViewPopupUI;
