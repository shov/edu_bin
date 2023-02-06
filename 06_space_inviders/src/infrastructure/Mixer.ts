export const MIXIN_NAME_SYMBOL = Symbol.for('$mixinName')
export const MIXIN_REQUIRE_SYMBOL = Symbol.for('$mixinRequire')

export function mixin(mixIn: TMixIn, rules: null | TDict | boolean = null) {
    return function decorator(Base: Function): any {
        ;(mixIn[MIXIN_REQUIRE_SYMBOL] || []).forEach((requiredMixinName: string) => {
            if (!(Base.prototype.componentList || []).includes(requiredMixinName)) {
                throw new Error(`Mixin ${mixIn[MIXIN_NAME_SYMBOL]} requires ${requiredMixinName}, but it hasn't applied to ${Base.name} yet`)
            }
        })

        Object.getOwnPropertyNames(mixIn).forEach(name => {
            if (rules || typeof Base.prototype[name] === 'undefined') {
                Object.defineProperty(
                    Base.prototype,
                    ((rules as TDict || {})[name] || name),
                    Object.getOwnPropertyDescriptor(mixIn, name)!
                )
            }
        })

        Base.prototype.componentList ??= []
        Base.prototype.componentList.push(mixIn[MIXIN_NAME_SYMBOL])

        return Base as any
    }
}
