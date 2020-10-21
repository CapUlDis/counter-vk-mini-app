import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import { usePlatform, IOS } from '@vkontakte/vkui'
// import bridge from '@vkontakte/vk-bridge';
import FixedLayout from '@vkontakte/vkui/dist/components/FixedLayout/FixedLayout';
import View from '@vkontakte/vkui/dist/components/View/View';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import PanelHeaderButton from '@vkontakte/vkui/dist/components/PanelHeaderButton/PanelHeaderButton';
import Placeholder from '@vkontakte/vkui/dist/components/Placeholder/Placeholder';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import CardGrid from '@vkontakte/vkui/dist/components/CardGrid/CardGrid';
import Gallery from '@vkontakte/vkui/dist/components/Gallery/Gallery';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import Icon56AddCircleOutline from '@vkontakte/icons/dist/56/add_circle_outline';
import Icon28Notifications from '@vkontakte/icons/dist/28/notifications';
import ActionSheet from '@vkontakte/vkui/dist/components/ActionSheet/ActionSheet';
import ActionSheetItem from '@vkontakte/vkui/dist/components/ActionSheetItem/ActionSheetItem';
import Icon28ArticleOutline from '@vkontakte/icons/dist/28/article_outline';
import Icon28MessageOutline from '@vkontakte/icons/dist/28/message_outline';
import Icon28StoryOutline from '@vkontakte/icons/dist/28/story_outline';

import './Counters.css';
import CounterCard from './components/CounterCard';
import BigCounterCard from './components/BigCounterCard';
import { shareContentByStory } from '../helpers/share';

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


const Counters = ({ id, go, service, counters, fetchedUser }) => {
	const osname = usePlatform();
	const [activePanel, setActivePanel] = useState(VIEW.NORMAL);
	const [slideIndex, setSlideIndex] = useState(0);
	const [popout, setPopout] = useState(null);

	const dayOfNum = (number) => {  
		let cases = [2, 0, 1, 1, 1, 2]; 
		let titles = ['день', 'дня', 'дней'];
		return titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];  
	};

	const switchCard = (panel, index) => {
		setSlideIndex(index);
		setActivePanel(panel);
	};

	const pickCounter = async () => {
		setActivePanel(VIEW.NORMAL);
		const counter = document.getElementById("counter1");
		// const initialWidth = counter.style.width;
		// counter.style.width = '351px';
		// console.log(counter.innerHTML);
		var imageUrl = null;
		await html2canvas(counter, { scale: 2, width: "351", onclone: (document) => {
			document.getElementById("counter1").style.width = "351px";
		} }).then( 
			function (canvas) {
				console.log(canvas);
				imageUrl = canvas.toDataURL("image/png");
			}
		);
		// counter.style.width = initialWidth;
		console.log(imageUrl);
		const linkApp = "http://vk.com/app7582904";

		shareContentByStory(linkApp, imageUrl);
	
	};

	// 	const storyBoxOptions = {
	// 		background_type: "none",
	// 		attachment: { type: "url", text: "read", url: "http://vk.com/app7582904" },
	// 		stickers: [
	// 			{
	// 				sticker_type: "renderable",
	// 				sticker: {
	// 					blob: imageUrl,
	// 					content_type: "image",
	// 					can_delete: false,
	// 					original_height: 189,
	// 					original_width: 351,
	// 					transform: { rotation: 359, relation_width: 0.8 },
	// 					clickable_zones: [
	// 						{
	// 							action_type: "link",
	// 							action: { link: "http://vk.com/app7582904", tooltip_text_key: "tooltip_open_default" },
	// 							clickable_area: [
	// 							{ x: 0, y: 0 },
	// 							{ x: 351, y: 0 },
	// 							{ x: 351, y: 189 },
	// 							{ x: 0, y: 189 },
	// 							],
	// 						},
	// 					],
	// 				},
	// 			},
	// 		],
	// 		};
		
	// 	  // отказ публиковать стори не считаем ошибкой
	// 	const res = await bridge.send("VKWebAppShowStoryBox", storyBoxOptions);
	// 	return console.log(res);
	// };


	const openShareMenu = () => {
		setPopout(
			<ActionSheet onClose={() => setPopout(null)}>
				<ActionSheetItem autoclose before={<Icon28StoryOutline/>} onClick={pickCounter}>
					В историю
				</ActionSheetItem>
				<ActionSheetItem autoclose before={<Icon28ArticleOutline/>}>
					На стену
				</ActionSheetItem>
				<ActionSheetItem autoclose before={<Icon28MessageOutline/>}>
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
					left={<PanelHeaderButton><Icon28Notifications fill='#4bb34b'/></PanelHeaderButton>}
					separator={false}
					>Счетчики
				</PanelHeader>
				{/* Кнопка для проверок */}
				<FixedLayout vertical='top'>
					<Button 
						className='CreateButton' 
						mode='commerce' 
						size='xl' 
						// onClick={() => {
						// 	async function delService() {
						// 		await bridge.send('VKWebAppStorageSet', {
						// 			key: 'serviceCounters',
						// 			value: JSON.stringify({
						// 				hasSeenIntro: false,
						// 				counters: [],
						// 				deletedCounters: []
						// 			})
						// 		});
						// 	}
						// 	delService();
						// }}
						onClick={pickCounter}
						>
						Стереть service
					</Button>
				</FixedLayout>
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
					left={<PanelHeaderButton><Icon28Notifications fill='#4bb34b'/></PanelHeaderButton>}
					separator={false}
					>Счетчики
				</PanelHeader>
				<Gallery
					slideWidth="90%"
					align="center"
					className="BigCounters_Gallery"
					initialSlideIndex={slideIndex}
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
								<BigCounterCard
									key={key}
									index={index}
									counter={counter}
									date={date}
									days={days}
									status={status}
									fetchedUser={fetchedUser}
									switchCard={switchCard}
									view={VIEW.NORMAL}
									openShareMenu={openShareMenu}
								/>
							);
						})
					}
				</Gallery>
			</Panel>
		</View>
	)
};

export default Counters;
