import { AEntity } from "./AEntity"

export const COMPONENT_NAME_SYMBOL = Symbol.for('$componentName')
export const COMPONENT_REQUIRE_SYMBOL = Symbol.for('$componentRequire')
export const COMPONENT_CONSTRUCTOR = Symbol.for('$componentConstructor')

export function addComponent(component: TComponent, rules: null | TDict | boolean = null) {
    return function decorator(Base: Function): any {
        // AEntity is the only thing a component can be applied to
        if (Base.prototype instanceof AEntity === false) {
            throw new Error(`Componenr ${component[COMPONENT_NAME_SYMBOL]} cannot be applied to non-AEntity-derived constructor. Rejected for ${Base.name}`)
        }

        ; (component[COMPONENT_REQUIRE_SYMBOL] || []).forEach((requiredComponentName: string) => {
            if (!(Base.prototype.componentList || []).includes(requiredComponentName)) {
                throw new Error(`Component ${component[COMPONENT_NAME_SYMBOL]} requires ${requiredComponentName}, but it hasn't applied to ${Base.name} yet`)
            }
        })

        // appliable for functions only
        Object.getOwnPropertyNames(component).forEach(name => {
            if ('function' !== typeof component[name]) {
                return
            }
            // ignore mixin constructor if met
            if (COMPONENT_CONSTRUCTOR as any === name) {
                return
            }

            // user rules to resolve conflicts
            if (rules || typeof Base.prototype[name] === 'undefined') {
                Object.defineProperty(
                    Base.prototype,
                    ((rules as TDict || {})[name] || name),
                    Object.getOwnPropertyDescriptor(component, name)!
                )
            }
        })

        Base.prototype.componentList ??= []
        Base.prototype.componentList.push(component[COMPONENT_NAME_SYMBOL])

        return Base as any
    }
}
