export enum FXJ_Actions {
    GET_STATE = 'GET_STATE',
    SET_STATE = 'SET_STATE',
    START_PICK = 'START_PICK',
    OPEN_JAIL = 'OPEN_JAIL',
    ADD_ARTIST = 'ADD_ARTIST',
    ADD_COLLECTION = 'ADD_COLLECTION',
    RELEASE_ARTIST = 'RELEASE_ARTIST',
    RELEASE_COLLECTION = 'RELEASE_COLLECTION',

}

export interface FXJ_Message {
    type: FXJ_Actions;
    payload?: null;
}