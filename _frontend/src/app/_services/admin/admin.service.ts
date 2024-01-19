import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { BehaviorSubject } from "rxjs"
import { Message } from "src/app/interfaces/Message"
import { User } from "src/app/interfaces/User"

@Injectable({
    providedIn: "root",
})
export class AdminService {

    public allUsers$ = new BehaviorSubject<User[] | null>(null);
    
    constructor(private http: HttpClient) {}

    public getUsers() {
        return this.http.get<User[]>(`/api/admin/getUsers`)
    }
    
    // Unblock users
    public unblock(users: string[]) {
        return this.http.patch<Message>(`/api/admin/unblock`, { users: users })
    }
    
    // Block users
    public block(users: string[]) {
        return this.http.patch<Message>(`/api/admin/block`, { users: users })
    }
    
    // Delete users
    public delete(users: string[]) {
        return this.http.delete<Message>(`/api/admin/delete`, { body: {users: users} })
    }
    
    // Make admins
    public makeAdmin(users: string[]) {
        return this.http.patch<Message>(`/api/admin/makeAdmin`, { users: users })
    }
    
    // Delete admins
    public deleteAdmin(users: string[]) {
        return this.http.patch<Message>(`/api/admin/deleteAdmin`, { users: users })
    }
}
