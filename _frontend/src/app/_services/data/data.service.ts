import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { Collection } from "src/app/interfaces/Collection"
import { Comment } from "src/app/interfaces/Comment"
import { Item } from "src/app/interfaces/Item"
import { MainData } from "src/app/interfaces/MainData"
import { Topics } from "src/app/interfaces/Topics"

@Injectable({
    providedIn: "root",
})
export class DataService {
    constructor(
        private http: HttpClient,
    ) {}

    // Get topics for collection
    public getTopics() {
        return this.http.get<Topics>(`/api/data/getTopics`)
    }

    // Get tags for autocomplete
    public tagAutocomplete(string: string) {
        return this.http.get<string[]>(`/api/data/tagAutocomplete?query=${string}`)
    }

    // Get collection items
    public getCollection(name: string, sort: string) {
        return this.http.get<Collection>(`/api/data/getCollection/${name}?sort=${sort}`)
    }

    // Get item
    public getItem(id: string) {
        return this.http.get<Item>(`/api/data/getItem/${id}`)
    }

    // Get item feedback
    public getItemFeedback(id: string) {
        return this.http.get<{ comments: Comment[]; likes: string[] }>(
            `/api/data/getItemFeedback/${id}`
        )
    }

    // Get main page data
    public getMainData() {
        return this.http.get<MainData>(`/api/data/getMain`)
    }
}
