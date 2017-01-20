$('document').ready(function () {
    $('.wrapper').on('click', '.js-switch-view', function (event) {
        event.preventDefault();
        switchFeedView($(this));
    });
});

function switchFeedView (element) {
    var newRssOrSiteView = +!element.data('view');
    var entry = element.parents('.js-event');

    $.ajax({
        url: './action.php',
        data: {
            pluginAction: 'leedrssorsiteview_update_view',
            id: entry.data('feed-id'),
            view: newRssOrSiteView
        }
    })
        .done(function () {
            var newRssOrSiteViewText = (newRssOrSiteView === 1) ? 'RSS_VIEW' : 'SITE_VIEW';
            element.data('view', newRssOrSiteView)
                .html(_t(newRssOrSiteViewText));

            toggleView(entry.find('.js-article__content'), newRssOrSiteView);
        })
        .fail(function () {
            alert('error');
        });
}

// Create the site iframe
function toggleWebsite (element, removeIframe, callback) {
    var entry = element.parents('.js-event');
    var articleContent = entry.find('.js-article__content');

    if (removeIframe) {
        element.children().remove();
    }

    if (entry.hasClass('js-focus')) {
        var iframeLoadingId = 'iframe-loading';
        var iframeId = 'entry-iframe-' + entry.data('id');
        articleContent.append('<span class="iframe-loader" alt="Loading..." id="' + iframeLoadingId + '"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="36"><g fill="#424242"><path d="M13.09 0L0 7.912 10.174 22.23l8.298-1.918L18.194 36 30 9.968l-9.583 1.916c.063.323.097.655.097.995 0 2.89-2.375 5.233-5.306 5.233-2.93 0-5.305-2.343-5.305-5.234 0-2.57 1.878-4.707 4.354-5.15l-.125-.674z"/><path d="M18.49 12.88c0 1.787-1.47 3.236-3.282 3.236s-3.28-1.45-3.28-3.237c0-1.788 1.468-3.237 3.28-3.237 1.812 0 3.28 1.45 3.28 3.236zM18.64 4.06c-1.416 0-2.633.84-3.168 2.043.567-.372 1.246-.59 1.977-.59 1.975 0 3.576 1.58 3.576 3.53 0 .36-.054.706-.155 1.032.75-.625 1.227-1.56 1.227-2.605 0-1.883-1.548-3.41-3.457-3.41zM20.113.117"/><path d="M20.113.117c-2.03 0-3.817 1.014-4.873 2.556 1.014-.747 2.272-1.19 3.635-1.19 3.36 0 6.08 2.686 6.08 6 0 .812-.163 1.585-.46 2.292.93-1.025 1.494-2.378 1.494-3.86 0-3.203-2.632-5.798-5.877-5.798z"/></g></svg></span>');

        jQuery('<iframe id="' + iframeId + '" frameborder="0" src="' + articleContent.data('article-url') + '" style="position: relative; width: 100%; height: 100%; z-index: 10;" />').appendTo(articleContent);
        $('#' + iframeId).load(function () {
            $('#' + iframeLoadingId).remove();
        });

        if (typeof (callback) === 'function') {
            callback();
        }
    }
}

function toggleRSSOrSiteClasses (events, action) {
    var classes = 'event--website-view js-website-view';
    if (action === 'remove') {
        events.each(function () {
            $(this).removeClass(classes);
        });
    } else {
        events.each(function () {
            $(this).addClass(classes);
        });
    }
}

// [todo] - Create a general object to avoid these repetitive node switches
function toggleView (element, view) {
    var entry = element.parents('.js-event');
    var eventContent = entry.find('.js-article__content');
    var allEvents = $('[data-feed-id="' + entry.data('feed-id') + '"]');
    eventContent.children().remove();
    if (view === 1) {
        toggleWebsite(eventContent);
        toggleRSSOrSiteClasses(allEvents);
    } else {
        eventObj.toggleContent();
        toggleRSSOrSiteClasses(allEvents, 'remove');
    }
}
