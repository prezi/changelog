$(function() {
    var $events = $('#events').find('> tbody');
    var $filters = $('#filters');
    var $permalink = $('#permalink');
    var $permalinkCode = $('#permalink-code');

    function unixNow() { return Math.round($.now() / 1000); }

    function renderEvents(events) {
        $events.children().remove();
        for (var i = 0; i < events.length; i++) {
            var event = events[i];
            $events.append(('<tr>' +
                '<td>{criticality}</td>' +
                '<td><a href="#" class="category">{category}</a></td>' +
                '<td>{time}</td>' +
                '<td>{description}</td>' +
                '</tr>')
                    .replace('{criticality}', event.criticality)
                    .replace('{time}', new Date(event.unix_timestamp * 1000))
                    .replace('{category}', event.category)
                    .replace('{description}', event.description));
        }
        // Click on category
        $events.find('a.category').click(function(e) {
            var category = this.text;
            e.stopPropagation();
            e.preventDefault();
            $filters.find('input[name=category]').each(function() {
                $(this).prop('checked', this.value == category);
            });
            updateHashFromControls();
            loadEventsFromHash();
        });
    }

    function updateHashFromControls() {
        var filters = {};
        // Criticality
        filters.criticality = $filters.find('input[name=criticality]:checked').map(
            function() { return this.value; }
        ).get().join(',');
        // Time
        filters.hours_ago = $filters.find('input[name=hours-ago]').val();
        if ($filters.find('input[name=until-type]:checked').val() == 'unix-timestamp') {
            filters.until = $filters.find('input[name=until-timestamp]').val();
        } else {
            filters.until = -1;
        }
        // Categories
        filters.category = $filters.find('input[name=category]:checked').map(
            function() { return this.value; }
        ).get().join(',');
        $.bbq.pushState(filters);
    }

    function updateControlsFromHash() {
        var criticality = ($.bbq.getState('criticality') || '').split(',');
        $('input[name=criticality]').each(function() {
            $(this).prop('checked', criticality.indexOf(this.value) > -1);
        });
        $('input[name=hours-ago]').val($.bbq.getState('hours_ago') || 1);
        var until = $.bbq.getState('until') || -1;
        if (until == -1) {
            $('input[name=until-type][value="Now"]').prop('checked', true);
            $filters.find('input[name=until-timestamp]').val(unixNow());
        } else {
            $('input[name=until-type][value="unix-timestamp"]').prop('checked', true);
            $('input[name=until-timestamp]').val(until);
        }
        var category = ($.bbq.getState('category') || '').split(',');
        $('input[type=checkbox][name=category]').each(function() {
            $(this).prop('checked', category.indexOf(this.value) > -1);
        });
    }

    function updatePermalinkFromHash() {
        var permalinkFilters = $.extend({}, $.bbq.getState());
        if (permalinkFilters.until == -1) { permalinkFilters.until = unixNow(); }
        var link = $.param.fragment(location.href, permalinkFilters);
        $permalink.prop('href', link);
        $permalinkCode.text(link);
    }

    function loadEventsFromHash() {
        var filters = $.bbq.getState();
        for (var key in filters) {
            if (!filters.hasOwnProperty(key)) continue;
            if (filters[key].length == 0) delete filters[key];
        }
        $.get('/api/events', filters, renderEvents);
    }

    // Load on filter change
    $filters.find('input').change(updateHashFromControls);
    $filters.find('#clear-criticality-filter').click(function() {
        $filters.find('input[name=criticality]').prop('checked', false);
        updateHashFromControls();
    });
    $filters.find('#clear-category-filter').click(function() {
        $filters.find('input[name=category]').prop('checked', false);
        updateHashFromControls();
    });

    // Update, reload stuff on hash change
    $(window).bind("hashchange", function(e) {
        updateControlsFromHash();
        updatePermalinkFromHash();
        loadEventsFromHash();
    });

    // Initial load based on URL and HTML control defaults
    updateControlsFromHash();    // Hash is always right
    updateHashFromControls();    // HTML controls can also be right if the hash doesn't care
    updatePermalinkFromHash();
    loadEventsFromHash();
});
