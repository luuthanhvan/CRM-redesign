import {
  APP_FEATURES as FEATURES,
  APP_HTML_ELEMENTS as HTML_ELEMENTS,
} from '~core/constants';
import {
  faBagShopping,
  faHandHoldingDollar,
  faUserTag,
} from '@fortawesome/free-solid-svg-icons';

export const DASHBOARD_ICONS = {
  faBagShopping,
  faHandHoldingDollar,
  faUserTag,
};
/* Define specific Ids for UI elements */
export const DASHBOARD_ID = {
  DASHBOARD_CARD_CONTACT: `${FEATURES.DASHBOARD}-${HTML_ELEMENTS.CARD}-contact`,
  DASHBOARD_CARD_SALES_ORDER: `${FEATURES.DASHBOARD}-${HTML_ELEMENTS.CARD}-saleOrders`,
  DASHBOARD_MAIN_SECTION: `${FEATURES.DASHBOARD}`,
};
