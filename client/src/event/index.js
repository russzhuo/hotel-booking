import { EventEmitter } from "../helpers/EventEmitter";

export const event = new EventEmitter();

export const EVENTS = {
    NAVIGATE_TO_LOGIN: "NAVIGATE_TO_LOGIN",
    REFRESH_PLACE_DETAIL: "REFRESH_PLACE_DETAIL"
}

export const navigateToLogin = () => event.emit(EVENTS.NAVIGATE_TO_LOGIN);
export const refreshPlaceDetail = () => event.emit(EVENTS.REFRESH_PLACE_DETAIL);