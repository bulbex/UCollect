import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Item } from 'src/app/interfaces/Item';
import { Message } from 'src/app/interfaces/Message';

@Injectable({
  providedIn: 'root'
})
export class CollectionItemsService {

    constructor(private http: HttpClient) { }

    // Adds item to collection
    public addItem(data: any) {
        return this.http.post<Message>(`/api/user/addItem`, data)
    }

    // Edits item in collection
    public editItem(item: Item) {
        return this.http.patch<Message>(`/api/user/editItem`, item)
    }

    // Delete item from collection
    public deleteItem(id: string) {
        return this.http.delete<Message>(`/api/user/deleteItem/${id}`)
    }
}
