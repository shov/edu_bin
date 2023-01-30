export function mixin(mixIn: TDict, rules: null | TDict | boolean = null) {
    return function decorator(Base: Function): any {
        Object.getOwnPropertyNames(mixIn).forEach(name => {
            if (rules || typeof Base.prototype[name] === 'undefined') {
                Base.prototype[(rules as TDict || {})[name] || name] = mixIn[name]
            }
        })

        return Base as any
    }
}
