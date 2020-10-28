import React from "react";
import html2canvas from 'html2canvas';
import { usePlatform, IOS } from '@vkontakte/vkui'
import Card from '@vkontakte/vkui/dist/components/Card/Card';
import Title from '@vkontakte/vkui/dist/components/Typography/Title/Title';
import Caption from '@vkontakte/vkui/dist/components/Typography/Caption/Caption';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar';
import Icon24ShareOutline from '@vkontakte/icons/dist/24/share_outline';
import Icon28WriteOutline from '@vkontakte/icons/dist/28/write_outline';
import ActionSheet from '@vkontakte/vkui/dist/components/ActionSheet/ActionSheet';
import ActionSheetItem from '@vkontakte/vkui/dist/components/ActionSheetItem/ActionSheetItem';
import Icon28ArticleOutline from '@vkontakte/icons/dist/28/article_outline';
import Icon28MessageOutline from '@vkontakte/icons/dist/28/message_outline';
import Icon28StoryOutline from '@vkontakte/icons/dist/28/story_outline';

import './BigCounterCard.css'
import { images, colors } from '../components/img/Covers';
import { shareContentByStory, shareContentByWall, shareContentByMessage } from '../helpers/share';


const VIEW = {
	NORMAL: 'normal',
	BIG: 'big'
};

const BigCounterCard = ({ counterId, switchCard, counter, days, date, status, fetchedUser, index, setPopout, setActivePanel, appLink, setEditMode, go }) => {
    const osname = usePlatform();
    
    const shareCounterCardByStory = async () => {
		setActivePanel(VIEW.NORMAL);
		const counter = document.getElementById(counterId);
        let imageUrl = null;
		await html2canvas(counter, { scale: 2, backgroundColor: null, width: '351', onclone: document => {
            document.getElementById(counterId).style.padding = "0";
            document.getElementById(counterId).style.width = "351px";
            document.getElementById(counterId).style.borderRadius = "10px 10px 10px 10px";
		} }).then(canvas => {
            imageUrl = canvas.toDataURL("image/png");
		});
        shareContentByStory(appLink, imageUrl);
        setActivePanel(VIEW.BIG);
    };

    const shareCounterAppByWall = async () => {
        shareContentByWall('Считай количество дней от или до даты с помощью приложения "Счётчики времени"!', appLink);
    };

    const shareCounterAppByMessage = async () => {
        shareContentByMessage(appLink);
    };
    
    const openShareMenu = () => {
		setPopout(
			<ActionSheet onClose={() => setPopout(null)}>
				<ActionSheetItem autoclose before={<Icon28StoryOutline/>} onClick={shareCounterCardByStory}>
					В историю
				</ActionSheetItem>
				<ActionSheetItem autoclose before={<Icon28ArticleOutline/>} onClick={shareCounterAppByWall}>
					На стену
				</ActionSheetItem>
				<ActionSheetItem autoclose before={<Icon28MessageOutline/>} onClick={shareCounterAppByMessage}>
					В личные сообщения
				</ActionSheetItem>
				{osname === IOS && <ActionSheetItem autoclose mode="cancel">Отменить</ActionSheetItem>}
			</ActionSheet>
		);
	};

    return (
        <Card size="l" mode="shadow" className="BigCounterCard">
            <label>
                <input
                    className="BigCounterCard__divButton"
                    type="button"
                    onClick={() => {switchCard(VIEW.NORMAL, index)}}
                />
                {counter.coverType === "color"
                    ? <div className="BigCounterCard__cover" style={{ background:  colors[parseInt(counter.coverId) - 1].style }} />
                    : <div className="BigCounterCard__cover" style={{ background: `url(${images[parseInt(counter.coverId) - 11].large}) no-repeat center`, backgroundSize: "cover" }} />
                }
            </label>
            <div className="BigCounterCard__text">
                <Icon28WriteOutline 
                    className="BigCounterCard__edit" 
                    onClick={() => {
                        counter.counterId = counterId;
                        counter.index = index;
                        setEditMode(counter);
                        go();
                }}/>
                <div className="BigCounterCard__row">
                    <Title level="3" weight="semibold" style={{ textOverflow: 'ellipsis', overflow: 'hidden', marginRight: '40px' }}>{counter.title}</Title>
                    <Caption level="1" weight="regular" style={{ color: "var(--text_secondary)" }}>{date.format('LL')}</Caption>
                </div>
                <div className="BigCounterCard__row">
                    <Title level="3" weight="semibold">{days}</Title>
                    <Caption level="1" weight="regular" style={{ color: "var(--text_secondary)" }}>{status}</Caption>
                </div>
                <div className="BigCounterCard__avatars">
                    {fetchedUser.photo_200 ? <Avatar src={fetchedUser.photo_200} size={24}/> : null}
                    <Caption level="1" weight="regular" style={{ color: "var(--text_secondary)", marginLeft: "8px" }}>Ждете Вы</Caption>
                </div>
                <Button size="xl" mode="secondary" className="BigCounterCard__button"before={<Icon24ShareOutline/>} onClick={openShareMenu}>Поделиться</Button>
            </div>
        </Card>
    );
};

export default BigCounterCard;