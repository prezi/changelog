$(function() {
    var $events = $('#events').find('> tbody');
    var $filters = $('#filters');
    var $permalink = $('#permalink');
    var $permalinkCode = $('#permalink-code');

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

    var timeRangeChooser = {
        activeButtonValue: function () {
            return $('input[name=time-range]:checked').val();
        },
        buttonByHoursAgo: function (hours) {
            return $('input[name=time-range]').filter(function () {
                return timeRangeChooser.relativeValueToDuration($(this).val()).asHours() === hours;
            })
        },
        picker: {
            from: function () { return $('#from-timestamp'); },
            until: function () { return $('#until-timestamp'); },
            data: {
                from: function () { return timeRangeChooser.picker.from().data('DateTimePicker'); },
                until: function () { return timeRangeChooser.picker.until().data('DateTimePicker'); }
            }
        },
        relativeValueToDuration: function (val) {
            var parts = val.split(':'),
                amount = parseInt(parts[1]),
                unit   = parts[2];
            return moment.duration(amount, unit);
        },
        isFixed: function () { return timeRangeChooser.activeButtonValue() === 'fixed'; },
        isRelative: function () { return !timeRangeChooser.isFixed(); },
        hash: function () {
            return {
                hours_ago: timeRangeChooser.getHoursAgo(),
                until: timeRangeChooser.getUntil()
            };
        },
        getUntil: function () {
            if (timeRangeChooser.isRelative()) {
                return -1;
            }
            return timeRangeChooser.picker.data.until().getDate().unix();
        },
        getHoursAgo: function () {
            if (timeRangeChooser.isRelative()) {
                return timeRangeChooser.relativeValueToDuration(timeRangeChooser.activeButtonValue()).asHours();
            }
            return timeRangeChooser.picker.data.until().getDate().clone()
                .diff(timeRangeChooser.picker.data.from().getDate(), 'hours');
        },
        set: function(hoursAgo, until) {
            var hoursAgoInt = parseInt(hoursAgo, 10), untilInt = parseInt(until, 10),
                untilSet = (until !== undefined && untilInt !== -1),
                hoursAgoSet = (hoursAgo !== undefined);
            if (!untilSet && !hoursAgoSet) {
                $('#relative-time-ranges').find('label:first-child').click();
            } else if (!untilSet && hoursAgoSet && timeRangeChooser.buttonByHoursAgo(hoursAgoInt).length) {
                return timeRangeChooser.buttonByHoursAgo(hoursAgoInt).click();
            } else {
                $('input[name=time-range][value=fixed]').click();
            }
            timeRangeChooser.updateDatetimePickers();
        },
        updateDatetimePickers: function () {
            var until = timeRangeChooser.getUntil(),
                hoursAgo = timeRangeChooser.getHoursAgo();
            if (until === -1) {
                until = moment().unix();
            }
            $('.time-range-fixed').toggle(timeRangeChooser.isFixed());
            timeRangeChooser.picker.data.from().setDate(moment.unix(until).subtract(hoursAgo, 'hours'));
            timeRangeChooser.picker.data.until().setDate(moment.unix(until));
        },
        init: function () {
            timeRangeChooser.picker.from().datetimepicker();
            timeRangeChooser.picker.until().datetimepicker();
            timeRangeChooser.picker.from().on('dp.change', function (e) {
                timeRangeChooser.picker.data.until().setMinDate(e.date);
            });
            timeRangeChooser.picker.until().on('dp.change', function (e) {
                timeRangeChooser.picker.data.from().setMaxDate(e.date);
            });
            $('input[name=time-range]').change(timeRangeChooser.updateDatetimePickers);
        }
    };

    function updateHashFromControls() {
        var filters = {};
        // Criticality
        filters.criticality = $filters.find('input[name=criticality]:checked').map(
            function() { return this.value; }
        ).get().join(',');
        // Categories
        filters.category = $filters.find('input[name=category]:checked').map(
            function() { return this.value; }
        ).get().join(',');
        // Description
        filters.description = $filters.find('input[name=description]').val();
        // Time
        $.extend(filters, timeRangeChooser.hash());
        $.bbq.pushState(filters);
    }

    function updateControlsFromHash() {
        var criticality = ($.bbq.getState('criticality') || '').split(',');
        $('input[name=criticality]').each(function() {
            $(this).prop('checked', criticality.indexOf(this.value) > -1);
        });
        timeRangeChooser.set($.bbq.getState('hours_ago'), $.bbq.getState('until'));
        var category = ($.bbq.getState('category') || '').split(',');
        $('input[type=checkbox][name=category]').each(function() {
            $(this).prop('checked', category.indexOf(this.value) > -1);
        });
        $('input[name=description]').val($.bbq.getState('description') || '');
    }

    function updatePermalinkFromHash() {
        var permalinkFilters = $.extend({}, $.bbq.getState());
        if (permalinkFilters.until == -1) { permalinkFilters.until = moment().unix(); }
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

    // Initial load based on URL and HTML control defaults
    timeRangeChooser.init();
    updateControlsFromHash();    // Hash is always right
    updateHashFromControls();    // HTML controls can also be right if the hash doesn't care
    updatePermalinkFromHash();
    loadEventsFromHash();

    // Load on filter change
    $filters.find('input').change(updateHashFromControls);
    $filters.find('#until-timestamp, #from-timestamp').on('dp.change', updateHashFromControls);
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
});
