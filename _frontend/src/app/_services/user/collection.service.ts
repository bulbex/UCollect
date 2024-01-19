import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Collection } from 'src/app/interfaces/Collection';
import { Item } from 'src/app/interfaces/Item';
import { Message } from 'src/app/interfaces/Message';

@Injectable({
  providedIn: 'root'
})
export class CollectionService {

    constructor(private http: HttpClient) { }

    //Get user collections
    public getUserCollections(username: string) {
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
}
