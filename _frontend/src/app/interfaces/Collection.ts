import { Item } from "./Item"

export interface Collection {
    _id: string
    owner: any
    name: string
    topic: string
    description: string
    photo: any
    itemFields: {
        type: string
        name: string
    }[]
    creationTime: string
    items: Item[]
}
