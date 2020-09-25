import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import View from '@vkontakte/vkui/dist/components/View/View';
import Epic from '@vkontakte/vkui/dist/components/Epic/Epic';
import Tabbar from '@vkontakte/vkui/dist/components/Tabbar/Tabbar';
import TabbarItem from '@vkontakte/vkui/dist/components/TabbarItem/TabbarItem';
import ScreenSpinner from '@vkontakte/vkui/dist/components/ScreenSpinner/ScreenSpinner';
import Snackbar from '@vkontakte/vkui/dist/components/Snackbar/Snackbar';
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar';
import Icon28RecentOutline from '@vkontakte/icons/dist/28/recent_outline';
import Icon28AddCircleOutline from '@vkontakte/icons/dist/28/add_circle_outline';
import Icon28MenuOutline from '@vkontakte/icons/dist/28/menu_outline';
import Icon24Error from '@vkontakte/icons/dist/24/error';

import '@vkontakte/vkui/dist/vkui.css';

import Counters from './panels/Counters';
import Create from './panels/Create';
import Catalog from './panels/Catalog';
import Intro from './panels/Intro';

const ROUTES = {
	INTRO: 'intro',
	COUNTERS: 'counters',
	CREATE: 'create',
	CATALOG: 'catalog'
};

const STORAGE_KEYS = {
	SERVICE: 'serviceCounters',
};

const App = () => {
	const [activePanel, setActivePanel] = useState(ROUTES.INTRO);
	const [popout, setPopout] = useState(<ScreenSpinner size='large' />);
	const [userHasSeenIntro, setUserHasSeenIntro] = useState(false);
	const [snackbar, setSnackbar] = useState(false);

	useEffect(() => {
		bridge.subscribe(({ detail: { type, data }}) => {
			if (type === 'VKWebAppUpdateConfig') {
				const schemeAttribute = document.createAttribute('scheme');
				schemeAttribute.value = data.scheme ? data.scheme : 'client_light';
				document.body.attributes.setNamedItem(schemeAttribute);
			}
		});
		async function fetchData() {
			const storageData = await bridge.send('VKWebAppStorageGet', { 
				keys: Object.values(STORAGE_KEYS)
			});
			const data = {};
			storageData.keys.forEach( ( key, value ) => {
				try {
					data[key] = value ? JSON.parse(value) : {};
					switch (key) {
						case STORAGE_KEYS.STATUS:
							if (data[key].hasSeenIntro) {
								setActivePanel(ROUTES.COUNTERS);
								setUserHasSeenIntro(true);
							}
							break;
						default:
							break;
					}
				} catch (error) {
					setSnackbar(<Snackbar
						layout='vertical'
						onClose={() => setSnackbar(null)}
						before={<Avatar size={24} style={{ backgroundColor: 'var(--dynamic-red)'}}
						><Icon24Error fill='#fff' width='14' height='14'/></Avatar>}
						duration={900}
					>
						Проблема с получением данных из Storage.
					</Snackbar>)
				}
			})
			setPopout(null);
		}
		fetchData();
	}, []);

	const go = panel => {
		setActivePanel(panel);
	};

	const viewIntro = async function () {
		try {
			await bridge.send('VKWebAppStorageSet', {
				key: STORAGE_KEYS.SERVICE,
				value: JSON.stringify({
					hasSeenIntro: true,
					counters: [],
					deletedCounters: []
				})
			});
			go(ROUTES.COUNTERS);
		} catch (error) {
			setSnackbar(<Snackbar
				layout='vertical'
				onClose={() => setSnackbar(null)}
				before={<Avatar size={24} style={{ backgroundColor: 'var(--dynamic-red)'}}
				><Icon24Error fill='#fff' width='14' height='14'/></Avatar>}
				duration={900}
			>
				Проблема с отправкой данных в Storage.
			</Snackbar>)
		}
	}

	if (activePanel === ROUTES.INTRO) {
		return (
			<View activePanel={activePanel} popout={popout}>
				<Intro id={ROUTES.INTRO} go={viewIntro} snackbarError={snackbar} userHasSeenIntro={userHasSeenIntro}/>
			</View>
		);
	}

	return (
		<Epic activeStory={activePanel} tabbar={
			<Tabbar>
				<TabbarItem
				onClick={() => setActivePanel(ROUTES.COUNTERS)}
				selected={activePanel === ROUTES.COUNTERS}
				data-story={ROUTES.COUNTERS}
				text="Счетчики"
				><Icon28RecentOutline/></TabbarItem>
				<TabbarItem
				onClick={() => setActivePanel(ROUTES.CREATE)}
				selected={activePanel === ROUTES.CREATE}
				data-story={ROUTES.CREATE}
				text="Создать"
				><Icon28AddCircleOutline/></TabbarItem>
				<TabbarItem
				onClick={() => setActivePanel(ROUTES.CATALOG)}
				selected={activePanel === ROUTES.CATALOG}
				data-story={ROUTES.CATALOG}
				text="Каталог"
				><Icon28MenuOutline/></TabbarItem>
			</Tabbar>
		}>
			<View id={ROUTES.COUNTERS} activePanel={ROUTES.COUNTERS}>
				<Counters id={ROUTES.COUNTERS} go={() => go(ROUTES.CREATE)}/>
			</View>
			<View id={ROUTES.CREATE} activePanel={ROUTES.CREATE}>
				<Create id={ROUTES.CREATE}/>
			</View>
			<View id={ROUTES.CATALOG} activePanel={ROUTES.CATALOG}>
				<Catalog id={ROUTES.CATALOG}/>
			</View>
		</Epic>
	);
}

export default App;

