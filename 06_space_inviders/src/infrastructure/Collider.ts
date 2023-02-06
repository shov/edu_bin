import {IBoxCollider} from '../mixins/boxCollieder'

export type TCollidedCouple = [IBoxCollider, IBoxCollider]

export class Collider {
    constructor(protected _bodyList: IBoxCollider[]) {
    }

    process(): { coupleList: TCollidedCouple[], tagMap: Map<IBoxCollider, Record<string, IBoxCollider[]>> } {
        type TCordRef = {
            v: number,
            pos: 'open' | 'close',
            ref: IBoxCollider,
        }

        const openFirstOrder = ['open', 'close'] // if two figures stay on one line they must cross
        const xRefList = this._bodyList.reduce<TCordRef[]>((acc, b: IBoxCollider) => {
            acc.push({v: b.scruff.x, pos: 'open', ref: b})
            acc.push({v: b.scruff.x + b.size.w, pos: 'close', ref: b})
            return acc
        }, []).sort((a, b) => {
            return a.v - b.v || (openFirstOrder.indexOf(a.pos) - openFirstOrder.indexOf(b.pos))
        })

        const xCandidatePathMap = new Map<IBoxCollider, Set<IBoxCollider>>()
        let currOpenMap: Map<IBoxCollider, TCordRef> = new Map()

        xRefList.forEach(cr => {
            if (cr.pos === 'open') {
                // pair with all open
                ;[...currOpenMap.values()].forEach(openCr => {
                    // push both-direction paths
                    xCandidatePathMap.set(
                        cr.ref,
                        (xCandidatePathMap.get(cr.ref) || new Set()).add(openCr.ref)
                    )
                    xCandidatePathMap.set(
                        openCr.ref,
                        (xCandidatePathMap.get(openCr.ref) || new Set()).add(cr.ref)
                    )
                })

                // set open itself
                currOpenMap.set(cr.ref, cr)
            } else {
                // close
                currOpenMap.delete(cr.ref)
            }
        })

        const yRefList = this._bodyList.reduce<TCordRef[]>((acc, b: IBoxCollider) => {
            acc.push({v: b.scruff.y, pos: 'open', ref: b})
            acc.push({v: b.scruff.y + b.size.h, pos: 'close', ref: b})
            return acc
        }, []).sort((a, b) => {
            return a.v - b.v || (openFirstOrder.indexOf(a.pos) - openFirstOrder.indexOf(b.pos))
        })

        currOpenMap = new Map<IBoxCollider, TCordRef>()

        const coupleList: TCollidedCouple[] = []
        const tagMap: Map<IBoxCollider, Record<string, IBoxCollider[]>> = new Map()

        yRefList.forEach(cr => {
            if (cr.pos === 'open') {
                // check existing collisions by x (one direction is enough)
                ;[...currOpenMap.values()].forEach(openCr => {
                    const xRoot = xCandidatePathMap.get(cr.ref)
                    if (xRoot && xRoot.has(openCr.ref)) {
                        coupleList.push([cr.ref, openCr.ref])

                        const tagDict = (tagMap.get(cr.ref) || {})

                        openCr.ref.tagList.forEach(tag => {
                            tagDict[tag] ??= []
                            tagDict[tag].push(openCr.ref)
                        })

                        if(Object.keys(tagDict).length > 0) {
                            tagMap.set(cr.ref, tagDict)
                        }
                    }
                })

                // set open itself
                currOpenMap.set(cr.ref, cr)
            } else {
                // close
                currOpenMap.delete(cr.ref)
            }
        })

        return {coupleList, tagMap}
    }
}

