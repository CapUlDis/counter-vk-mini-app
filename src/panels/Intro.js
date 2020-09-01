import React, { Fragment } from 'react';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar';
import FixedLayout from '@vkontakte/vkui/dist/components/FixedLayout/FixedLayout';
import Button from '@vkontakte/vkui/dist/components/Button/Button';

import './Intro.css';

const Intro = ({ id, snackbarError, fetchedUser, userHasSeenIntro, go }) => {
	return (
		<Panel id={id} centered={true}>
			<PanelHeader>
				Счётчик дней
			</PanelHeader>
			{(!userHasSeenIntro && fetchedUser) &&
				<Fragment>
					<Group>
						<Div className='User'>
							{fetchedUser.photo_200 && <Avatar src={fetchedUser.photo_200}/>}
							<h2>Создавайте счётчики для любых событий</h2>
							<p>Вы можете следить за тем, сколько осталось до события или сколько уже прошло времени после него</p>
						</Div>
					</Group>
					<FixedLayout vertical='bottom'>
						<Div>
							<Button mode='commerce' size='xl' onClick={go}>
								Начать
							</Button>
						</Div>
					</FixedLayout>
				</Fragment>				
			}
			{snackbarError}
		</Panel>
	)
};

export default Intro;
