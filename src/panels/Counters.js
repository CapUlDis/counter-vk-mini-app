import React from 'react';
// import bridge from "@vkontakte/vk-bridge";
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
import ModalRoot from '@vkontakte/vkui/dist/components/ModalRoot/ModalRoot';
import ModalPage from '@vkontakte/vkui/dist/components/ModalPage/ModalPage';
import ModalPageHeader from '@vkontakte/vkui/dist/components/ModalPageHeader/ModalPageHeader';
import Icon28ArticleOutline from '@vkontakte/icons/dist/28/article_outline';
import Icon28MessageOutline from '@vkontakte/icons/dist/28/message_outline';
import Icon28StoryOutline from '@vkontakte/icons/dist/28/story_outline';
import Icon56AddCircleOutline from '@vkontakte/icons/dist/56/add_circle_outline';
// import Icon28Notifications from '@vkontakte/icons/dist/28/notifications';
import Icon24ShareOutline from '@vkontakte/icons/dist/24/share_outline';
import Icon28WriteOutline from '@vkontakte/icons/dist/28/write_outline';
import Icon28DeleteOutline from '@vkontakte/icons/dist/28/delete_outline';
import Icon24Back from '@vkontakte/icons/dist/24/back';
import Icon24Cancel from '@vkontakte/icons/dist/24/cancel';

import './Counters.css';
import CounterCard from './components/CounterCard';
import BigCounterCard from './components/BigCounterCard';
import { images, colors } from './components/img/Covers';
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


const Counters = ({ 
	id, 
	go, 
	activePanel, 
	setActivePanel, 
	slideIndex, 
	setSlideIndex, 
	service, 
	counters, 
	fetchedUser, 
	appLink, 
	setEditMode, 
	openDeleteDialogue, 
	popout, 
	setPopout, 
	activeModal,
	setActiveModal,
	sharedCounter,
	handleJoinClick
}) => {
	const osname = usePlatform();

	const dayOfNum = (number) => {  
		let cases = [2, 0, 1, 1, 1, 2]; 
		let titles = ['день', 'дня', 'дней'];
		return titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];  
	};

	const switchCard = (panel, index) => {
		setSlideIndex(index);
		setActivePanel(panel);
	};
    
    const shareCounterCardByStory = async ({ counter }) => {
		const link = appLink + '#' + Buffer.from(JSON.stringify(counter)).toString("base64");
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
		if (counter.coverType === 'color') {
			ctx.fillStyle = colors[parseInt(counter.coverId) - 1].simple;
			ctx.fillRect(0, 0, width, coverH);
		} else {
			const image = new Image();
			image.src = images[parseInt(counter.coverId) - 11].medium;
			ctx.drawImage(image, 0, 0, width, coverH);
		}
		// Рисуем Заголовок
		ctx.font = 'bold 34px "TT Commons", -apple-system, system-ui, Helvetica Neue, Roboto, sans-serif';
		ctx.fillStyle = document.body.getAttribute('scheme') === 'bright_light' ? '#000000' : '#E1E3E6';
		ctx.fillText(counter.title, textX, textBigY, maxWidthTitleText);
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
		// Заряжаем картинку в сторис
		shareContentByStory(link, canvas.toDataURL("image/png"));
    };

    const shareCounterAppByWall = async ({ counter }) => {
		const link = appLink + '#' + Buffer.from(JSON.stringify(counter)).toString("base64");
        shareContentByWall('Считай количество дней от или до даты с помощью приложения "Счётчики времени"!', link);
    };

    const shareCounterAppByMessage = async ({ counter }) => {
		const link = appLink + '#' + Buffer.from(JSON.stringify(counter)).toString("base64");
        shareContentByMessage(link);
    };

	const openShareMenu = ({ counter }) => {
		setPopout(
			<ActionSheet onClose={() => setPopout(null)}>
				<ActionSheetItem autoclose before={<Icon28StoryOutline/>} onClick={() => shareCounterCardByStory({ counter })}>
					В историю
				</ActionSheetItem>
				<ActionSheetItem autoclose before={<Icon28ArticleOutline/>} onClick={() => shareCounterAppByWall({ counter })}>
					На стену
				</ActionSheetItem>
				<ActionSheetItem autoclose before={<Icon28MessageOutline/>} onClick={() => shareCounterAppByMessage({ counter })}>
					В личные сообщения
				</ActionSheetItem>
				{osname === IOS && <ActionSheetItem autoclose mode="cancel">Отменить</ActionSheetItem>}
			</ActionSheet>
		);
	};

	return (
		<View 
			id={id} 
			activePanel={activePanel} 
			popout={popout} 
			modal={
				<ModalRoot activeModal={activeModal} onClose={() => setActiveModal(null)}>
					<ModalPage 
						id="sharedCounter"
						onClose={() => setActiveModal(null)}
						settlingHeight={100}
						header={
							<ModalPageHeader
								noShadow
								right={<PanelHeaderButton onClick={() => setActiveModal(null)}>{osname === IOS ? 'Отмена' : <Icon24Cancel />}</PanelHeaderButton>}
							>
								Добавить счетчик
							</ModalPageHeader>
						}
					>
						<CardGrid style={{ margin: "4px 0px" }}>
							{(() => {
								const date = moment(sharedCounter.date);
								let days = null;
								let status = null;
								if (sharedCounter.howCount === 'to') {
									let daysDiff = date.diff(moment().startOf('day'), 'days');
									days = daysDiff > 0 ? daysDiff + ' ' + dayOfNum(daysDiff) : 'Закончилось';
									status = date.diff(moment().startOf('day'), 'days') > 0 ? 'осталось' : '';
								} else {
									let daysDiff = moment().diff(date, 'days');
									days = daysDiff + ' ' + dayOfNum(daysDiff);
									status = 'прошло';
								}
								return (
									<BigCounterCard 
										counter={sharedCounter}
										date={date}
										days={days}
										status={status}
									>
										<Button size="xl" mode="secondary" className="Button__join" onClick={() => handleJoinClick({ counter: sharedCounter })} >Присоединиться</Button>
									</BigCounterCard>
								);
							})()}
						</CardGrid>
					</ModalPage>
				</ModalRoot>
			}
		> 
			<Panel id={VIEW.NORMAL}>
				<PanelHeader 
					// left={<PanelHeaderButton><Icon28Notifications fill='#4bb34b'/></PanelHeaderButton>}
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
					: <Group >
						<CardGrid style={{ margin: "8px 0px" }}>
							{counters.map((counter, index) => {
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
										key={counter.counterId}
										id={counter.counterId}
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
						{(counters && fetchedUser) &&
							counters.map((counter, index) => {
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
									<BigCounterCard key={counter.counterId}
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
										<Button 
											size="xl" 
											mode="secondary" 
											className="BigCounterCard__button"
											style={{ backgroundColor: document.body.getAttribute('scheme') === 'bright_light' ? '#EBF7EB' : 'rgba(98, 119, 98, 0.25)' }}
											before={<Icon24ShareOutline/>} 
											onClick={() => openShareMenu({ counter })}
										>
											Поделиться
										</Button>
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
