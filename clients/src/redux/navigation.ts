// ------------- Action Types ------------ //
export const NAVIGATION_SET_PAGE = 'NAVIGATION_SET_PAGE'

interface SetPage {
    type: typeof NAVIGATION_SET_PAGE
    payload: string
}

export type ActionTypes = SetPage

// ------------- Action Creators ------------ //
export const setPage = (page: string) => ({
    type: NAVIGATION_SET_PAGE,
    payload: page
})

// ----------------- State --------------- //
export type NavigationState = {
    page: string,
}

const initialState: NavigationState = {page : 'index'}

// ---------------- Reducer -------------- //
export const navigationReducer = (state = initialState, action: ActionTypes): NavigationState => {
    switch(action.type) {
        case NAVIGATION_SET_PAGE:
            return {
                page: action.payload,
            }

        default:
            return state
    }
}