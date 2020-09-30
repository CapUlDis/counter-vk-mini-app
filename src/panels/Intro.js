import React, { Fragment } from 'react';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import FixedLayout from '@vkontakte/vkui/dist/components/FixedLayout/FixedLayout';
import Placeholder from '@vkontakte/vkui/dist/components/Placeholder/Placeholder';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import card1 from './components/img/Intro-card-1.png';
import card2 from './components/img/Intro-card-2.png';

import './Intro.css';

const Intro = ({ id, snackbarError, go }) => {
	return (
		<Panel id={id} centered={true}>
			<Fragment>
				<Div className='about'>
					<img src={card1} alt='Промо карточка 1' className='card1'/>
					<img src={card2} alt='Промо карточка 2' className='card2'/>
					<Placeholder 
						header="Создавайте счетчики для любых событий" 
						className='placeholder_intro'
						>
						Вы можете следить за тем, сколько осталось до события или сколько уже прошло времени после него
					</Placeholder>
				</Div>
				<FixedLayout vertical='bottom'>
					<Div>
						<Button mode='commerce' size='xl' onClick={go}>
							Начать
						</Button>
					</Div>
				</FixedLayout>
			</Fragment>				
			{snackbarError}
		</Panel>
	)
};

export default Intro;
