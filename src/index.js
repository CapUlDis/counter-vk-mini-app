import "core-js/features/map";
import "core-js/features/set";
import React from "react";
import ReactDOM from "react-dom";
import bridge from "@vkontakte/vk-bridge";
import "moment/locale/ru";
import moment from "moment";
import { RouterContext } from '@happysanta/router';
import { router } from './routers';
import { ConfigProvider } from '@vkontakte/vkui';
import App from "./App";


moment.locale("ru");
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

// Init VK  Mini App
bridge.send("VKWebAppInit");

bridge.subscribe(({ detail: { type, data }}) => {
  if (type === 'VKWebAppUpdateConfig') {
    const schemeAttribute = document.createAttribute('scheme');
    schemeAttribute.value = data.scheme ? data.scheme : 'client_light';
    document.body.attributes.setNamedItem(schemeAttribute);
  }
});

// bridge.subscribe((e) => console.log(e));

ReactDOM.render(<RouterContext.Provider value={router}>
  <ConfigProvider isWebView={true}>
    <App/>
  </ConfigProvider>
</RouterContext.Provider>, document.getElementById('root'));

if (process.env.NODE_ENV === "development") {
  import("./eruda").then(({ default: eruda }) => {}); //runtime download
}
