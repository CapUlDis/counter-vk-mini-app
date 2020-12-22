import React from "react";
import moment from "moment";
import Card from '@vkontakte/vkui/dist/components/Card/Card';
import Title from '@vkontakte/vkui/dist/components/Typography/Title/Title';
import Caption from '@vkontakte/vkui/dist/components/Typography/Caption/Caption';

import './CounterCard.css'
import { images, colors } from '../components/img/Covers';
import { dayOfNum } from '../../helpers/utils';


const CounterCard = ({ id, counter, switchCard, ...props }) => {
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
        <Card size="l" mode="shadow" id={id} className="CounterCard">
            <label className="CounterCard__label clickable">
                <input
                    className="CounterCard__button"
                    type="button"
                    onClick={switchCard}
                />
                {counter.coverType === "color"
                    ? <div className="CounterCard__cover" style={{ background:  colors[parseInt(counter.coverId) - 1].style }} />
                    : <div className="CounterCard__cover" style={{ background: `url(${images[parseInt(counter.coverId) - 11].medium}) no-repeat center`, backgroundSize: "cover" }} />
                }
            </label>
            <div className="CounterCard__text">
                <div className="CounterCard__row">
                    <Title level="3" weight="semibold" style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>{counter.title}</Title>
                    <Title level="3" weight="semibold">{days}</Title>
                </div>
                <div className="CounterCard__row">
                    <Caption level="1" weight="regular" style={{ color: "var(--text_secondary)" }}>{date.format('LL')}</Caption>
                    <Caption level="1" weight="regular" style={{ color: "var(--text_secondary)" }}>{status}</Caption>
                </div>
                {props.children}
            </div>
        </Card>
    );
};

export default CounterCard;