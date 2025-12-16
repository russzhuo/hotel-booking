import { EventEmitter } from "../helpers/EventEmitter";

export const event = new EventEmitter();

export const EVENTS = {
    NAVIGATE_TO_LOGIN: "NAVIGATE_TO_LOGIN"
}

export const navigateToLogin = () => event.emit(EVENTS.NAVIGATE_TO_LOGIN);
