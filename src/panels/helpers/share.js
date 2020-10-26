import bridge from "@vkontakte/vk-bridge";


/**
 * Создает шару на стене.
 * @param snippetImageUrl ссылка на изображение сниппета
 * @param title название выпуска
 * @param link оригинальная ссылка на приложение (в формате https://vk.com/appXXXXXXX)
 * @param appId идентификатор приложения
 */
export async function shareContentByWall(title, link) {
    const options = {
        message: `${title}\n ${link}\n`,
        attachments: link,
        link_button: "open_url",
        link_title: title,
    };
    // отказ публиковать пост не считаем ошибкой
    await bridge.send("VKWebAppShowWallPostBox", options).catch(() => null);
}

/**
 * Создает шару в историях.
 */
export async function shareContentByStory(link, screenshotLink) {
    const stickerH = 189;
    const stickerW = 351;
    const storyBoxOptions = {
        background_type: "none",
        attachment: { type: "url", text: "read", url: link },
        stickers: [
            {
                sticker_type: "renderable",
                sticker: {
                    blob: screenshotLink,
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

export async function shareContentByMessage(link) {
    await bridge.send("VKWebAppShare", { link });
}