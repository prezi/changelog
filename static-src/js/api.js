import 'whatwg-fetch';

export const fetchEvents = () => {
    const url = new URL(location.href + 'api/events');
    url.searchParams.append('hours_ago', 1);
    url.searchParams.append('until', -1);
    return fetch(url);
};
