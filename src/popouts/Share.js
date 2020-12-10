import React from 'react';
import { ActionSheet, ActionSheetItem, usePlatform, IOS } from '@vkontakte/vkui';
import { Icon28StoryOutline, Icon28ArticleOutline, Icon28MessageOutline } from '@vkontakte/icons';
import { useRouter } from '@happysanta/router';

import { isItDesktop } from '../helpers/utils';
import { shareCounterCardByStory, shareCounterByWall, shareCounterByMessage } from './helpers/share';



const Share = ({ counterToShare }) => {
    const osname = usePlatform();
    const router = useRouter();

    return (
        <ActionSheet onClose={() => router.popPage()}>
            {!isItDesktop() &&
                <ActionSheetItem autoclose before={<Icon28StoryOutline/>} onClick={() => shareCounterCardByStory({ counterToShare })}>
                    В историю
                </ActionSheetItem>
            }
            {!isItDesktop() &&
                <ActionSheetItem autoclose before={<Icon28MessageOutline/>} onClick={() => shareCounterByMessage({ counterToShare })}>
                    В личные сообщения
                </ActionSheetItem>
            }
            <ActionSheetItem autoclose before={<Icon28ArticleOutline/>} onClick={() => shareCounterByWall({ counterToShare })}>
                На стену
            </ActionSheetItem>
            {osname === IOS && <ActionSheetItem autoclose mode="cancel">Отменить</ActionSheetItem>}
        </ActionSheet>
    );
};

export default Share;