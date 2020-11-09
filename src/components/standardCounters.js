const moment = require('moment');
require('moment/locale/ru');
moment.updateLocale('ru', {
    longDateFormat : {
        LTS: 'H:mm:ss',
        LT: 'H:mm',
        L: 'DD.MM.YYYY',
        LL: 'D MMMM YYYY',
        LLL: 'D MMMM YYYY г., H:mm',
        LLLL: 'dddd, D MMMM YYYY г., H:mm'
    }
});

const today = moment();

let date2 = '';
let title2 = '';
if (today < moment(`${moment().year()}-06-01`) || today > moment(`${moment().year()}-08-31`)) {
    title2 = 'Начало лета';
    date2 = today < moment(`${moment().year()}-08-31`) ? `${moment().year()}-06-01` : `${moment().year() + 1}-06-01`;
} else if (moment(`${moment().year()}-06-01`) <= today && today <= moment(`${moment().year()}-08-31`)) {
    title2 = 'Конец лета';
    date2 = `${moment().year()}-08-31`;
}

let date8 = '';
let title8 = '';
if (today < moment(`${moment().year()}-12-01`) && today >= moment(`${moment().year()}-03-01`)) {
    title8 = 'Начало зимы';
    date8 = `${moment().year()}-12-01`;
} else if (moment(`${moment().year()}-12-01`) <= today && today <= moment(`${moment().year()}-12-31`)) {
    title8 = 'Конец зимы';
    date8 = `${moment().year() + 1}-03-01`;
} else if (moment(`${moment().year()}-01-01`) <= today && today <= moment(`${moment().year()}-03-01`)) {
    title8 = 'Конец зимы';
    date8 = `${moment().year()}-03-01`;
}


export const standardCounters = [
    {
        counterId: 'standCounter1',
        title: 'Новый год',
        date: `${moment().year()}-12-31`,
        howCount: 'to',
        pub: true,
        coverType: 'theme',
        coverId: '12',
        standard: '0'
    },
    {
        counterId: 'standCounter8',
        title: title8,
        date: date8,
        howCount: 'to',
        pub: true,
        coverType: 'theme',
        coverId: '18',
        standard: '1'
    },
    {
        counterId: 'standCounter2',
        title: title2,
        date: date2,
        howCount: 'to',
        pub: true,
        coverType: 'theme',
        coverId: '19',
        standard: '2'
    },
    {
        counterId: 'standCounter3',
        title: '8 марта',
        date: (today <= moment(`${moment().year()}-03-08`) ? `${moment().year()}-03-08` : `${moment().year() + 1}-03-08`),
        howCount: 'to',
        pub: true,
        coverType: 'theme',
        coverId: '15',
        standard: '3'
    },
    {
        counterId: 'standCounter4',
        title: '14 февраля',
        date: (today <= moment(`${moment().year()}-02-14`) ? `${moment().year()}-02-14` : `${moment().year() + 1}-02-14`),
        howCount: 'to',
        pub: true,
        coverType: 'theme',
        coverId: '11',
        standard: '4'
    },
    {
        counterId: 'standCounter5',
        title: 'В.В.Путин у власти',
        date: '1999-12-31',
        howCount: 'from',
        pub: true,
        coverType: 'theme',
        coverId: '13',
        standard: '5'
    },
    {
        counterId: 'standCounter6',
        title: 'Основание Вконтакте',
        date: '2006-10-10',
        howCount: 'from',
        pub: true,
        coverType: 'color',
        coverId: '1',
        standard: '6'
    },
    {
        counterId: 'standCounter7',
        title: 'Распад СССР',
        date: '1991-12-26',
        howCount: 'from',
        pub: true,
        coverType: 'color',
        coverId: '3',
        standard: '7'
    },
    {
        counterId: 'standCounter9',
        title: 'Крым наш!',
        date: '2014-03-26',
        howCount: 'from',
        pub: true,
        coverType: 'theme',
        coverId: '14',
        standard: '8'
    },
];