import React from "react";
import Icon28DoneOutline from '@vkontakte/icons/dist/28/done_outline';
import "./RadioCard.css";

const RadioCard = ({ value, color, theme, onChange, checked, defaultChecked }) => {

    return (
        <label className="RadioCard clickable">
            <input
                className="RadioCard__input"
                type="radio"
                name="cover"
                value={value}
                color={color}
                theme={theme}
                onChange={onChange}
                checked={checked}
                defaultChecked={defaultChecked}
            />
            {color === undefined
                ? <div className="RadioCard__in" style={{ background: `url(${theme}) no-repeat center`, backgroundSize: "cover" }} />
                : <div className="RadioCard__in" style={{ background: color }} />
            }
            <Icon28DoneOutline className="RadioCard__check" />
        </label>
    );
};

export default RadioCard;
