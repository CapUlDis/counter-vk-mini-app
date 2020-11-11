import React from 'react';
import html2canvas from 'html2canvas';
import { usePlatform, IOS } from '@vkontakte/vkui'
import View from '@vkontakte/vkui/dist/components/View/View';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import PanelHeaderButton from '@vkontakte/vkui/dist/components/PanelHeaderButton/PanelHeaderButton';
import Placeholder from '@vkontakte/vkui/dist/components/Placeholder/Placeholder';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import CardGrid from '@vkontakte/vkui/dist/components/CardGrid/CardGrid';
import Gallery from '@vkontakte/vkui/dist/components/Gallery/Gallery';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import ActionSheet from '@vkontakte/vkui/dist/components/ActionSheet/ActionSheet';
import ActionSheetItem from '@vkontakte/vkui/dist/components/ActionSheetItem/ActionSheetItem';
import Icon28ArticleOutline from '@vkontakte/icons/dist/28/article_outline';
import Icon28MessageOutline from '@vkontakte/icons/dist/28/message_outline';
import Icon28StoryOutline from '@vkontakte/icons/dist/28/story_outline';
import Icon56AddCircleOutline from '@vkontakte/icons/dist/56/add_circle_outline';
// import Icon28Notifications from '@vkontakte/icons/dist/28/notifications';
import Icon24ShareOutline from '@vkontakte/icons/dist/24/share_outline';
import Icon28WriteOutline from '@vkontakte/icons/dist/28/write_outline';
import Icon28DeleteOutline from '@vkontakte/icons/dist/28/delete_outline';
import Icon24Back from '@vkontakte/icons/dist/24/back';

import './Counters.css';
import CounterCard from './components/CounterCard';
import BigCounterCard from './components/BigCounterCard';
import { shareContentByStory, shareContentByWall, shareContentByMessage } from './helpers/share';


const VIEW = {
	NORMAL: 'normal',
	BIG: 'big'
};

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


const Counters = ({ id, go, activePanel, setActivePanel, slideIndex, setSlideIndex, service, counters, fetchedUser, appLink, setEditMode, openDeleteDialogue, popout, setPopout }) => {
	const osname = usePlatform();
    
    const shareCounterCardByStory = async ({ counterId }) => {
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

	const dayOfNum = (number) => {  
		let cases = [2, 0, 1, 1, 1, 2]; 
		let titles = ['день', 'дня', 'дней'];
		return titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];  
	};

	const switchCard = (panel, index) => {
		setSlideIndex(index);
		setActivePanel(panel);
	};

	const openShareMenu = ({ counterId }) => {
		setPopout(
			<ActionSheet onClose={() => setPopout(null)}>
				<ActionSheetItem autoclose before={<Icon28StoryOutline/>} onClick={() => shareCounterCardByStory({ counterId })}>
					В историю
				</ActionSheetItem>
				<ActionSheetItem autoclose before={<Icon28ArticleOutline/>} onClick={() => shareCounterAppByWall({ counterId })}>
					На стену
				</ActionSheetItem>
				<ActionSheetItem autoclose before={<Icon28MessageOutline/>} onClick={() => shareCounterAppByMessage({ counterId })}>
					В личные сообщения
				</ActionSheetItem>
				{osname === IOS && <ActionSheetItem autoclose mode="cancel">Отменить</ActionSheetItem>}
			</ActionSheet>
		);
	};

	return (
		<View id={id} activePanel={activePanel} popout={popout}> 
			<Panel id={VIEW.NORMAL}>
				<PanelHeader 
					// left={<PanelHeaderButton><Icon28Notifications fill='#4bb34b'/></PanelHeaderButton>}
					separator={false}
					>Счетчики
				</PanelHeader>
				{/* Кнопка для проверок */}
				{/* <FixedLayout vertical='top'>
					<Button 
						className='CreateButton' 
						mode='commerce' 
						size='xl' 
						onClick={() => {
							async function delService() {
								await bridge.send('VKWebAppStorageSet', {
									key: 'serviceCounters',
									value: JSON.stringify({
										hasSeenIntro: false,
										counters: [],
										deletedCounters: []
									})
								});
							}
							delService();
						}}
						>
						Стереть service
					</Button>
				</FixedLayout> */}
				{service.counters.length === 0
					? <Placeholder 
						icon={<Icon56AddCircleOutline/>}
						header="Создайте счетчик"
						action={<Button size="l" mode="commerce" onClick={go}>Создать счетчик</Button>}
						stretched>
						<div className="Placeholder__text__in">
							Здесь будут отображаться ваши счетчики.
						</div>
					</Placeholder>
					: <Group >
						<CardGrid style={{ margin: "4px 0px" }}>
							{counters.keys.map(({ key, value }, index) => {
								const counter = value ? JSON.parse(value) : {};
								const date = moment(counter.date);
								let days = null;
								let status = null;
								if (counter.howCount === 'to') {
									let daysDiff = date.diff(moment().startOf('day'), 'days');
									days = daysDiff > 0 ? daysDiff + ' ' + dayOfNum(daysDiff) : 'Закончилось';
									status = date.diff(moment().startOf('day'), 'days') > 0 ? 'осталось' : '';
								} else {
									let daysDiff = moment().diff(date, 'days');
									days = daysDiff + ' ' + dayOfNum(daysDiff);
									status = 'прошло';
								}
								return (
									<CounterCard
										key={key}
										id={key}
										index={index}
										counter={counter}
										date={date}
										days={days}
										status={status}
										switchCard={switchCard}
										view={VIEW.BIG}
									/>
								);
							})}
						</CardGrid>
					</Group>
				}
			</Panel>
			<Panel id={VIEW.BIG}>
				<PanelHeader 
					left={<PanelHeaderButton><Icon24Back fill='#4bb34b' onClick={() => setActivePanel(VIEW.NORMAL)}/></PanelHeaderButton>}
					separator={false}
					>Счетчики
				</PanelHeader>
				{service.counters.length === 0
					? <Placeholder 
						icon={<Icon56AddCircleOutline/>}
						header="Создайте счетчик"
						action={<Button size="l" mode="commerce" onClick={go}>Создать счетчик</Button>}
						stretched>
						<div className="Placeholder__text__in">
							Здесь будут отображаться ваши счетчики.
						</div>
					</Placeholder>
					: <Gallery
						slideWidth="90%"
						align="center"
						className="BigCounters_Gallery"
						slideIndex={slideIndex}
						onChange={slideIndex => setSlideIndex({ slideIndex })}
						style={{ marginTop: "9px" }}
					>
						{(counters.keys && fetchedUser) &&
							counters.keys.map(({ key, value }, index) => {
								const counter = value ? JSON.parse(value) : {};
								const date = moment(counter.date);
								let days = null;
								let status = null;
								if (counter.howCount === 'to') {
									let daysDiff = date.diff(moment().startOf('day'), 'days');
									days = daysDiff > 0 ? daysDiff + ' ' + dayOfNum(daysDiff) : 'Закончилось';
									status = date.diff(moment().startOf('day'), 'days') > 0 ? 'осталось' : '';
								} else {
									let daysDiff = moment().diff(date, 'days');
									days = daysDiff + ' ' + dayOfNum(daysDiff);
									status = 'прошло';
								}
								return (
									<BigCounterCard key={key}
										index={index}
										counter={counter}
										date={date}
										days={days}
										status={status}
										fetchedUser={fetchedUser}
										switchCard={switchCard}
										right={!counter.standard 
											? <Icon28WriteOutline 
												className="BigCounterCard__edit" 
												onClick={() => {
													counter.index = index;
													setEditMode(counter);
													go();
												}}
											/>
											: <Icon28DeleteOutline
												className="BigCounterCard__edit" 
												onClick={() => openDeleteDialogue({ counterId: counter.counterId, standard: counter.standard})}
											/>
										}
									>
										<Button size="xl" mode="secondary" className="BigCounterCard__button"before={<Icon24ShareOutline/>} onClick={() => openShareMenu({ counterId: key })}>Поделиться</Button>
									</BigCounterCard>
								);
							})
						}
					</Gallery>
				}
			</Panel>
		</View>
	)
};

export default Counters;
