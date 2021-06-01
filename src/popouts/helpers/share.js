import bridge from "@vkontakte/vk-bridge";
import moment from 'moment';

import { images, colors } from '../../panels/components/img/Covers';
import { dayOfNum } from '../../helpers/utils';


const APPLINK = 'https://vk.com/app7582904';

const drawCounterCard = ({ counterToShare }) => {
    // Определяем надписи на карточке счётчика
    const date = moment(counterToShare.date);
    let days = null;
    let status = null;
    if (counterToShare.howCount === 'to') {
        let daysDiff = date.diff(moment().startOf('day'), 'days');
        days = daysDiff > 0 ? daysDiff + ' ' + dayOfNum(daysDiff) : 'Закончилось';
        status = date.diff(moment().startOf('day'), 'days') > 0 ? 'осталось' : '';
    } else {
        let daysDiff = moment().diff(date, 'days');
        days = daysDiff + ' ' + dayOfNum(daysDiff);
        status = 'прошло';
    }

    // Задаём параметры изображения и канваса
    const height = 378;
    const width = 702;
    const coverH = 234;
    const textX = 32;
    const textBigY = 64 + coverH;
    const textSmallY = 40 + textBigY;
    const maxWidthTitleText = 460;
    const canvas = document.createElement("canvas");
    canvas.height = height;
    canvas.width = width;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
        throw new Error("Работа с канвасом не поддерживается");
    }

    // Скругляем углы канваса
    ctx.beginPath();
    const x = 0;
    const y = 0;
    const radius = 20;
    ctx.moveTo(x, y + radius);
    ctx.lineTo(x, y + height - radius);
    ctx.quadraticCurveTo(x, y + height, x + radius, y + height);
    ctx.lineTo(x + width - radius, y + height);
    ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
    ctx.lineTo(x + width, y + radius);
    ctx.quadraticCurveTo(x + width, y, x + width - radius, y);
    ctx.lineTo(x + radius, y);
    ctx.quadraticCurveTo(x, y, x, y + radius);
    ctx.closePath();
    ctx.clip();

    // Делаем фон в зависимости от темы
    ctx.fillStyle = document.body.getAttribute('scheme') === 'bright_light' ? '#ffffff' : '#19191a';
    ctx.fillRect(0, 0, width, height);

    // Рисуем обложку
    if (counterToShare.coverType === 'color') {
        ctx.fillStyle = colors[parseInt(counterToShare.coverId) - 1].simple;
        ctx.fillRect(0, 0, width, coverH);
    } else {
        const image = new Image();
        image.src = images[parseInt(counterToShare.coverId) - 11].medium;
        ctx.drawImage(image, 0, 0, width, coverH);
    }

    // Рисуем Заголовок
    ctx.font = 'bold 34px "TT Commons", -apple-system, system-ui, Helvetica Neue, Roboto, sans-serif';
    ctx.fillStyle = document.body.getAttribute('scheme') === 'bright_light' ? '#000000' : '#E1E3E6';
    ctx.fillText(counterToShare.title, textX, textBigY, maxWidthTitleText);
    
    // Рисуем количество дней
    ctx.textAlign = 'end';
    ctx.fillText(days, width - textX, textBigY);

    // Рисуем статус
    ctx.font = '26px "TT Commons", -apple-system, system-ui, Helvetica Neue, Roboto, sans-serif';
    ctx.fillStyle = '#818C99';
    ctx.fillText(status, width - textX, textSmallY);

    // Рисуем дату
    ctx.textAlign = 'start';
    ctx.fillText(date.format('LL'), textX, textSmallY);

    return canvas.toDataURL("image/png")
};

export async function shareCounterCardByStory({ counterToShare }) {
    // Задаём ссылку для нажатия по счётчику
    const link = APPLINK + '#' + Buffer.from(JSON.stringify(counterToShare)).toString("base64");
    console.log(link);

    // Задаём параметры объекта
    const stickerH = 189;
    const stickerW = 351;
    const storyBoxOptions = {
        background_type: "none",
        attachment: { type: "url", text: "read", url: link },
        stickers: [
            {
                sticker_type: "renderable",
                sticker: {
                    blob: drawCounterCard({ counterToShare }),
                    content_type: "image",
                    can_delete: false,
                    original_height: stickerH,
                    original_width: stickerW,
                    transform: { relation_width: 0.8 },
                    clickable_zones: [
                        {
                            action_type: "link",
                            action: { link, tooltip_text_key: "tooltip_open_default" },
                            clickable_area: [
                                { x: 0, y: 0 },
                                { x: stickerW, y: 0 },
                                { x: stickerW, y: stickerH },
                                { x: 0, y: stickerH },
                            ],
                        },
                    ],
                },
            },
        ],
    };
    
    // Отказ публиковать стори не считаем ошибкой
    return bridge.send("VKWebAppShowStoryBox", storyBoxOptions).catch(() => null);
}

export async function shareCounterByWall({ counterToShare }) {
    const link = APPLINK + '#' + Buffer.from(JSON.stringify(counterToShare)).toString("base64");
    const title = 'Считай количество дней от или до даты с помощью приложения "Счётчики времени"!';
    const options = {
        message: `${title}\n ${link}\n`,
        attachments: link,
        link_button: "open_url",
        link_title: title,
    };

    return await bridge.send("VKWebAppShowWallPostBox", options).catch(() => null);
}

export async function shareCounterByMessage({ counterToShare }) {
    const link = APPLINK + '#' + Buffer.from(JSON.stringify(counterToShare)).toString("base64");
    
    return await bridge.send("VKWebAppShare", { link }).catch(() => null);;
}