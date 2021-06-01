import React from 'react';
import { Snackbar, Avatar } from '@vkontakte/vkui';
import { Icon24Error } from '@vkontakte/icons';


const SnackbarError = ({ setSnackbarError, ...props }) => (
    <Snackbar
        layout='vertical'
        duration={2000}
        onClose={() => setSnackbarError(null)}
        before={
            <Avatar size={24} style={{ backgroundColor: 'var(--dynamic_red)'}}>
                <Icon24Error fill='#fff' width='14' height='14'/>
            </Avatar>
        }
    >
        {props.children}
    </Snackbar>
);

export default SnackbarError;