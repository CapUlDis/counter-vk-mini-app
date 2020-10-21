import bridge from "@vkontakte/vk-bridge";


/**
 * Создает шару на стене.
 * @param snippetImageUrl ссылка на изображение сниппета
 * @param title название выпуска
 * @param link оригинальная ссылка на приложение (в формате https://vk.com/appXXXXXXX)
 * @param appId идентификатор приложения
 */
export async function shareContentByWall(snippetImageUrl, title, link, appId) {
    const short_url = "https://vk.com/checklist";
    const options = {
        message: `${title}\n ${short_url}\n`,
        attachments: link,
        link_button: "open_url",
        link_title: title,
        link_image: snippetImageUrl,
    };
    // отказ публиковать пост не считаем ошибкой
    await bridge.send("VKWebAppShowWallPostBox", options).catch(() => null);
}

function roundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
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
}

function createLayer(image) {
    const initial = {
        cover: {
            width: 351,
            height: 189,
        },
    };
    const layerW = initial.cover.width;
    const coverW = layerW;
    const coverH = initial.cover.height;
    const coverScale = coverW / layerW;
    const canvas = document.createElement("canvas");
    canvas.height = coverH - 70;
    canvas.width = layerW;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
        throw new Error("Работа с канвасом не поддерживается");
    }
    /* Рисуем обложку */
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowBlur = 2.3 * coverScale;
    ctx.shadowOffsetX = 2 * coverScale;
    ctx.shadowOffsetY = 3.5 * coverScale;
    roundedRect(ctx, 0, 0, coverW, coverH - 70, 19);
    ctx.drawImage(image, 0, 0, coverW, coverH);
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    return canvas;
}

/**
 * Создает шару в историях.
 */
export async function shareContentByStory(link, screenshotLink) {
    const image = await new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.crossOrigin = "anonymous";
        img.src = screenshotLink;
    });

    /* Генерируем изображение переднего слоя */
    const stickerCanvas = createLayer(image);
    const { height: stickerH, width: stickerW } = stickerCanvas;
    
    /* Собираем опции для стори */
    const storyBoxOptions = {
        background_type: "none",
        attachment: { type: "url", text: "read", url: link },
        stickers: [
            {
                sticker_type: "renderable",
                sticker: {
                    blob: stickerCanvas.toDataURL(),
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
    // отказ публиковать стори не считаем ошибкой
    return bridge.send("VKWebAppShowStoryBox", storyBoxOptions).catch(() => null);
}
