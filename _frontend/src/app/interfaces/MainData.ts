import { Collection } from "./Collection"
import { Item } from "./Item"

export interface MainData {
    tags: any[],
    lastItems: Item[]
    biggestCollections: Collection[]
}