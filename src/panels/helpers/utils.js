export function isItDesktop() {
    const url = window.location.href;
    const query_params = url.slice(url.indexOf("?") + 1).split("&").reduce((a, x) => {
        const data = x.split("=");
        a[decodeURIComponent(data[0])] = decodeURIComponent(data[1]);
        return a;
    }, {});

    if (query_params.vk_platform && query_params.vk_platform === 'desktop_web') {
        return true;
    } else {
        return false;
    }
}