import { Collection } from "./Collection"
import { Comment } from "./Comment"
import { ItemAdditionalField } from "./ItemAdditionalField"

export interface Item {
    _id: string
    parent: Collection
    name: string
    tags: any
    comments: Comment[]
    additionalFields: ItemAdditionalField[] | undefined
    likes: string[]
}
