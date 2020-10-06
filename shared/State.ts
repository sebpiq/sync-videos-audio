export default class State<Values> {
    private state: Values
    constructor(initialState: Values) {
        this.state = initialState
    }

    get(path: keyof Values) {
        return this.state[path]
    }

    set(path: keyof Values, value: any) {
        this.state[path] = value
    }
}
