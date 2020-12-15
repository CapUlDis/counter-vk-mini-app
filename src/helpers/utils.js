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

export function dayOfNum(number) {
    let cases = [2, 0, 1, 1, 1, 2]; 
    let titles = ['день', 'дня', 'дней'];
    return titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];
}

export function isSafari() {
    //* Для версий с 3.0 до 9.1.3
    const isOlderSafari = /constructor/i.test(window.HTMLElement);

    //* Для версий с 7.1
    function isYoungerSafari(p) { 
        return p.toString() === "[object SafariRemoteNotification]"; 
    }

    return isOlderSafari || isYoungerSafari(!window['safari'] || (typeof safari !== 'undefined' && window['safari'].pushNotification));
}