import { AEntity } from "./AEntity"

// TODO I better use Reflector instead of meta symbols
export const COMPONENT_NAME_SYMBOL = Symbol.for('$componentName')
export const COMPONENT_REQUIRE_SYMBOL = Symbol.for('$componentRequire')
export const COMPONENT_CONSTRUCTOR = Symbol.for('$componentConstructor')
export const COMPONENT_CONSTRUCTOR_DICT = Symbol.for('$componentConstructorDict')
export const COMPONENT_CONSTRUCTOR_LAST_OPTIONS_DICT = Symbol.for('$componentConstructorDictLastOptionsDict')

export function addComponent(component: TComponent, options: TDict) {
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

        // 'rules' is a special general option to resolve naming conflits
        const rules = options?.rules

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

        Base.prototype.componentList ??= [] // TODO rename componentList to a symbol?
        Base.prototype.componentList.push(component[COMPONENT_NAME_SYMBOL])

        if ('function' === typeof component[COMPONENT_CONSTRUCTOR]) {
            Base.prototype[COMPONENT_CONSTRUCTOR_DICT] ??= {}
            Base.prototype[COMPONENT_CONSTRUCTOR_DICT][component[COMPONENT_NAME_SYMBOL]] ??= component[COMPONENT_CONSTRUCTOR]

            Base.prototype[COMPONENT_CONSTRUCTOR_LAST_OPTIONS_DICT] ??= {}
            // an aEntity constructor cleans it up after a component consructor call
            Base.prototype[COMPONENT_CONSTRUCTOR_LAST_OPTIONS_DICT][component[COMPONENT_NAME_SYMBOL]] = options || {}
        }

        return Base as any
    }
}
