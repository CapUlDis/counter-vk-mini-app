import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
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


const STORIES = {
	COUNTERS: 'counters',
	CREATE: 'create',
	CATALOG: 'catalog'
};

const STEPS = {
	LOADER_INTRO: 'loader_intro',
	MAIN: 'main'
};

const LOADER_INTRO = {
	INTRO: 'intro',
	LOADER: 'loader'
}

const STORAGE_KEYS = {
	SERVICE: 'serviceCounters',
};

const App = () => {
	const [step, setStep] = useState(STEPS.LOADER_INTRO);
	const [activePanel, setActivePanel] = useState(LOADER_INTRO.LOADER);
	const [activeStory, setActiveStory] = useState(STORIES.COUNTERS);
	const [service, setService] = useState({});
	const [counters, setCounters] = useState({});
	const [popout, setPopout] = useState(<ScreenSpinner size='large'/>);
	const [snackbar, setSnackbar] = useState(false);
	
	const loadService = async function () {
		const getObject = await bridge.send("VKWebAppStorageGet", { "keys": [STORAGE_KEYS.SERVICE] });
		setService(JSON.parse(getObject.keys[0].value));
	}

	const loadCounters = async function () {
		if (service.counters.length !== 0) {
			setCounters(await bridge.send("VKWebAppStorageGet", { "keys": service.counters }));
		}
	};

	useEffect(() => {
		bridge.subscribe(({ detail: { type, data }}) => {
			if (type === 'VKWebAppUpdateConfig') {
				const schemeAttribute = document.createAttribute('scheme');
				schemeAttribute.value = data.scheme ? data.scheme : 'client_light';
				document.body.attributes.setNamedItem(schemeAttribute);
			}
		});
		
		async function checkHasSeenItro() {
			try {
				const getObject = await bridge.send("VKWebAppStorageGet", { "keys": [STORAGE_KEYS.SERVICE] });

				if (!getObject.keys[0].value) {
					setPopout(null);
					return setActivePanel(LOADER_INTRO.INTRO);
				}
				
				setService(JSON.parse(getObject.keys[0].value));

				if (!service.hasSeenIntro) {
					setPopout(null);
					return setActivePanel(LOADER_INTRO.INTRO);
				}
				
				await loadCounters();

				return setStep(STEPS.MAIN);

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
		};
		
		if (activePanel === LOADER_INTRO.LOADER) { checkHasSeenItro() }
	});

	const go = panel => {
		setActiveStory(panel);
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
			setStep(STEPS.MAIN);
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

	if (step === STEPS.LOADER_INTRO) {
		return (
			<View activePanel={activePanel} popout={popout}>
				<Panel id={LOADER_INTRO.LOADER} >
				</Panel>
				<Intro id={LOADER_INTRO.INTRO} go={viewIntro} snackbarError={snackbar}/>
			</View>
		);
	}

	return (
		<Epic activeStory={activeStory} tabbar={
			<Tabbar>
				<TabbarItem
				onClick={() => setActiveStory(STORIES.COUNTERS)}
				selected={activeStory === STORIES.COUNTERS}
				data-story={STORIES.COUNTERS}
				text="Счетчики"
				><Icon28RecentOutline/></TabbarItem>
				<TabbarItem
				onClick={() => setActiveStory(STORIES.CREATE)}
				selected={activeStory === STORIES.CREATE}
				data-story={STORIES.CREATE}
				text="Создать"
				><Icon28AddCircleOutline/></TabbarItem>
				<TabbarItem
				onClick={() => setActiveStory(STORIES.CATALOG)}
				selected={activeStory === STORIES.CATALOG}
				data-story={STORIES.CATALOG}
				text="Каталог"
				><Icon28MenuOutline/></TabbarItem>
			</Tabbar>
		}>
			<View id={STORIES.COUNTERS} activePanel={STORIES.COUNTERS}>
				<Counters id={STORIES.COUNTERS} go={() => go(STORIES.CREATE)} service={service} counters={counters} loadCounters={loadCounters}/>
			</View>
			<View id={STORIES.CREATE} activePanel={STORIES.CREATE}>
				<Create id={STORIES.CREATE} go={() => go(STORIES.COUNTERS)} service={service} setService={setService} loadCounters={loadCounters}/>
			</View>
			<View id={STORIES.CATALOG} activePanel={STORIES.CATALOG}>
				<Catalog id={STORIES.CATALOG}/>
			</View>
		</Epic>
	);
}

export default App;


