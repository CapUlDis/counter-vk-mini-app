import { Page, Router } from '@happysanta/router';

export const PAGE_COUNTERS = '/';
export const PAGE_COUNTERS_BIG = '/big;';

export const PAGE_CREATE = '/create';

export const PAGE_CATALOG = '/catalog';
export const PAGE_CATALOG_BIG = '/catalog/big';

export const VIEW_COUNTERS = 'view_counters';
export const VIEW_CREATE = 'view_create';
export const VIEW_CATALOG = 'view_catalog';

export const PANEL_COUNTERS = 'panel_counters';
export const PANEL_COUNTERS_BIG = 'panel_counters_big';

export const PANEL_CREATE = 'panel_create';

export const PANEL_CATALOG = 'panel_catalog';
export const PANEL_CATALOG_BIG = 'panel_catalog_big';

export const MODAL_PAGE = 'modal_page';

export const POPOUT_LOADER = 'popout_loader';
export const POPOUT_DELETE = 'popout_delete';
export const POPOUT_SHARE = 'popout_share';

const routes = {
    [PAGE_COUNTERS]: new Page(PANEL_COUNTERS, VIEW_COUNTERS),
    [PAGE_COUNTERS_BIG]: new Page(PANEL_COUNTERS_BIG, VIEW_COUNTERS),
    [PAGE_CREATE]: new Page(PANEL_CREATE, VIEW_CREATE),
    [PAGE_CATALOG]: new Page(PANEL_CATALOG, VIEW_CATALOG),
    [PAGE_CATALOG_BIG]: new Page(PANEL_CATALOG_BIG, VIEW_CATALOG)
};

export const router = new Router(routes);

export const sharedCounterHash = window.location.hash.substr(0);

router.start();