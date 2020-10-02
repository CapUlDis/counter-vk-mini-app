import React, { useState } from 'react';
import bridge from '@vkontakte/vk-bridge';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import PanelHeaderButton from '@vkontakte/vkui/dist/components/PanelHeaderButton/PanelHeaderButton';
import FormLayout from '@vkontakte/vkui/dist/components/FormLayout/FormLayout';
import FormLayoutGroup from '@vkontakte/vkui/dist/components/FormLayoutGroup/FormLayoutGroup';
import Checkbox from '@vkontakte/vkui/dist/components/Checkbox/Checkbox';
import Radio from '@vkontakte/vkui/dist/components/Radio/Radio';
import Input from '@vkontakte/vkui/dist/components/Input/Input';
import Tabs from '@vkontakte/vkui/dist/components/Tabs/Tabs';
import TabsItem from '@vkontakte/vkui/dist/components/TabsItem/TabsItem';
import FixedLayout from '@vkontakte/vkui/dist/components/FixedLayout/FixedLayout';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import FormStatus from '@vkontakte/vkui/dist/components/FormStatus/FormStatus';
import Icon28Notifications from '@vkontakte/icons/dist/28/notifications';

import './Create.css';

import RadioCard from './components/RadioCard';
import { images, colors } from './components/img/Covers';


const COVERS = {
	COLORS: 'colors',
	THEMES: 'themes'
};

const STORAGE_KEYS = {
	SERVICE: 'serviceCounters',
};

const Create = ({ id, go, service, setService }) => {
	const [activeCoverTab, setActiveCoverTab] = useState(COVERS.COLORS);
	const [inputStatuses, setInputStatuses] = useState({ title: 'default', date: 'default', howCount: 'default' });
	const [title, setTitle] = useState('');
	const [date, setDate] = useState('');
	const [howCount, setHowCount] = useState('from');
	const [pub, setPub] = useState(false);
	const [coverType, setCoverType] = useState('color');
	const [coverTitle, setCoverTitle] = useState('blue');
	// const [deleted, setDeleted] = 

	const ErrorStatusBanner = function() {
		if (inputStatuses.howCount === 'default') {
			return null;
		}

		return (
			<FormStatus header="Некорректный способ отсчёта" mode="error">
				{howCount === 'to'
					? 'Нельзя считать количество дней до прошедшей даты. Измените дату на будущую или способ отсчёта даты на "От выбранной даты".'
					: 'Нельзя считать количество дней от будущей даты. Измените даты на прошлую или способ отсчёта даты на "До выбранной даты".'
				}
			</FormStatus>
		);
	}

	const handleCreateClick = async function () {
		if (!title.trim()) {
			return setInputStatuses({ title: 'error', date: 'default', howCount: 'default' });
		} 
		if (!date) {
			return setInputStatuses({ title: 'default', date: 'error', howCount: 'default' });
		}
		setInputStatuses({ title: 'default', date: 'default', howCount: 'default' });
		
		const today = new Date();
		const userDate = new Date(date);
		
		if (today > userDate && howCount === 'to') {
			return setInputStatuses({ title: 'default', date: 'default', howCount: 'error' });
		}
		if (today < userDate && howCount === 'from') {
			return setInputStatuses({ title: 'default', date: 'default', howCount: 'error' });
		}

		async function saveService(serviceObject) {
			await bridge.send('VKWebAppStorageSet', {
				key: STORAGE_KEYS.SERVICE,
				value: JSON.stringify(serviceObject)
			});
		}

		// async function getService() {
		// 	const getObject = await bridge.send("VKWebAppStorageGet", { "keys": [STORAGE_KEYS.SERVICE] });
		// 	return JSON.parse(getObject.keys[0].value);
		// }

		async function saveNewCounter(counterKey) {
			await bridge.send('VKWebAppStorageSet', {
				key: counterKey,
				value: JSON.stringify({
					title,
					date,
					howCount,
					pub,
					coverType,
					coverTitle
				})
			});
		}

		console.log(service);

		if (service.deletedCounters.length === 0) {
			const counterKey = `counter${service.counters.length + 1}`;
			saveNewCounter(counterKey);
			service.counters.push(counterKey);
			
			saveService(service);
			setService(service);

			// Проверочные логи
			console.log(await bridge.send("VKWebAppStorageGet", {"keys": [counterKey]}));
		} else {
			const counterKey = service.deletedCounters.shift()
			saveNewCounter(counterKey);
			
			saveService(service);
			setService(service);
			
			
			// Проверочные логи
			console.log(await bridge.send("VKWebAppStorageGet", {"keys": [counterKey]}))
		}
		
		go();

		// Проверочные логи
		console.log(await bridge.send("VKWebAppStorageGetKeys", {"count": 20, "offset": 0}));
		console.log(await bridge.send("VKWebAppStorageGet", {"keys": [STORAGE_KEYS.SERVICE]}));
	}

	return (
		<Panel id={id}>
			<PanelHeader 
				left={<PanelHeaderButton><Icon28Notifications fill='#4bb34b'/></PanelHeaderButton>}
				separator={false}>Создать
			</PanelHeader>
			<FormLayout>
				<ErrorStatusBanner/>
				<Input
					type="text"
					top="Название"
					name="title"
					value={title}
					status={inputStatuses.title}
					placeholder="Введите название"
					onChange={e => setTitle(e.target.value)}
				/>
				<Input
					type="date"
					top="Дата"
					name="date"
					value={date}
					status={inputStatuses.date}
					placeholder="Выберите дату"
					onChange={e => {
						setInputStatuses({ title: 'default', date: 'default', howCount: 'default' });
						setDate(e.target.value);
					}}
				/>
				<FormLayoutGroup top="Как отсчитывать дату?">
					<Radio 
						name="howCount" 
						value="from"
						onChange={e => {
							setInputStatuses({ title: 'default', date: 'default', howCount: 'default' });
							setHowCount(e.target.value);
						}}
						defaultChecked
						>От выбранной даты
					</Radio>
					<Radio 
						name="howCount" 
						value="to"
						onChange={e => {
							setInputStatuses({ title: 'default', date: 'default', howCount: 'default' });
							setHowCount(e.target.value);
						}}
						>До выбранной даты
					</Radio>
				</FormLayoutGroup>
				<Checkbox 
					top="Дополнительно"
					name="public"
					value={pub}
					onChange={() => setPub(!pub)}
				>Сделать счетчик публичным
				</Checkbox>	
				<FormLayoutGroup top="Обложка счётчик">
					<Tabs>
						<TabsItem
						onClick={() => setActiveCoverTab(COVERS.COLORS)}
						selected={activeCoverTab === COVERS.COLORS}>
							Цвета
						</TabsItem>
						<TabsItem
						onClick={() => setActiveCoverTab(COVERS.THEMES)}
						selected={activeCoverTab === COVERS.THEMES}>
							Тематическая
						</TabsItem>
					</Tabs>
					{activeCoverTab === 'colors'
						? <div className="CoversGrid">
							<div className="RadioCards">
								{ colors.map(({ id, title, style }) => 
									<RadioCard
										key={id}
										value={title} 
										color={style} 
										checked={coverTitle === title}
										onChange={e => {
											setCoverType('color');
											setCoverTitle(e.target.value);
										}}/>) }
							</div>
						</div>
						: <div className="CoversGrid">
							<div className="RadioCards">
								{ images.map(({ id, title, small }) => 
									<RadioCard
										key={id} 
										value={title} 
										theme={small} 
										checked={coverTitle === title}
										onChange={e => {
											setCoverType('theme');
											setCoverTitle(e.target.value);
										}}/>) }
							</div>
						</div>
					}
				</FormLayoutGroup>
				<FixedLayout vertical='bottom'>
					<Button className='CreateButton' mode='commerce' size='xl' onClick={handleCreateClick}>
						Создать счётчик
					</Button>
				</FixedLayout>
			</FormLayout>
			
		</Panel>
	)
};

export default Create;
