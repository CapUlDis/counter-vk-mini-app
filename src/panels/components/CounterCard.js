import React from "react";
import Card from '@vkontakte/vkui/dist/components/Card/Card';
import Title from '@vkontakte/vkui/dist/components/Typography/Title/Title';
import Caption from '@vkontakte/vkui/dist/components/Typography/Caption/Caption';

import './CounterCard.css'
import { images, colors } from '../components/img/Covers';


const CounterCard = ({ switchCard, view, counter, days, date, status, index, id, ...props }) => {
    return (
        <Card size="l" mode="shadow" id={id}>
            <label className="CounterCard">
                <input
                    className="CounterCard__button"
                    type="button"
                    onClick={() => {switchCard(view, index)}}
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
}

export default CounterCard;