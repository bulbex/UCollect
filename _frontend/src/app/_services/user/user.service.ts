import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { BehaviorSubject, first } from "rxjs"
import { User } from "src/app/interfaces/User"


@Injectable({
    providedIn: "root",
})
export class UserService {

    // Current user subject
    public user$ = new BehaviorSubject<User | null>(null);

    constructor(private http: HttpClient) {
    }

    // Get user data
    public getUserData() {
        return this.http.get(`/api/user/userdata`).pipe(first()).subscribe({
            next: (response: any) => {
                this.user$.next(response)
            },
            error: () => {
                this.user$.next(null);
            },
        })
    }

    // Give comment to some collection item
    public comment(comment: { comment: string }, itemId: string) {
        return this.http.post(`/api/user/${itemId}/comment`, comment)
    }

    // Toggles like on some collection item
    public toggleLike(itemId: string) {
        return this.http.post<string[]>(`/api/user/${itemId}/toggleLike`, {})
    }

    get user() {
        return this.user$.value
    }
}
