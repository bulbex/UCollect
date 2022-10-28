import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { first } from "rxjs"
import { Collection } from "src/app/interfaces/Collection"
import { Item } from "src/app/interfaces/Item"
import { Message } from "src/app/interfaces/Message"
import { User } from "src/app/interfaces/User"


@Injectable({
    providedIn: "root",
})
export class UserService {

    // Current user
    public user!: User | undefined

    constructor(private http: HttpClient) {}

    // Get user data
    public getUserData() {
        return this.http.get(`/api/user/userdata`).pipe(first()).subscribe({
            next: (response: any) => {
                this.user = response
            },
            error: (error) => {
                this.user = undefined
            },
        })
    }

    //Get user collections
    public getUserPage(username: string) {
        return this.http.get<Collection[]>(`/api/user/userPage/${username}`)
    }

    // Creates collection
    public createCollection(username: string, formData: FormData) {
        return this.http.post<Message>(`/api/user/${username}/createCollection`, formData)
    }

    // Edits collection
    public editCollection(formData: FormData) {
        return this.http.patch<Message>(`/api/user/editCollection`, formData)
    }

    // Deletes collection
    public deleteCollection(id: string) {
        return this.http.delete<Message>(`/api/user/deleteCollection/${id}`)
    }

    // Adds item to collection
    public addItem(data: any) {
        return this.http.post<Message>(`/api/user/addItem`, data)
    }

    // Edits item
    public editItem(item: Item) {
        return this.http.patch<Message>(`/api/user/editItem`, item)
    }

    // Delete item
    public deleteItem(id: string) {
        return this.http.delete<Message>(`/api/user/deleteItem/${id}`)
    }

    // Sets comment to some item
    public comment(comment: { comment: string }, itemId: string) {
        return this.http.post(`/api/user/${itemId}/comment`, comment)
    }

    // Toggles like
    public toggleLike(itemId: string) {
        return this.http.post<string[]>(`/api/user/${itemId}/toggleLike`, {})
    }
}
