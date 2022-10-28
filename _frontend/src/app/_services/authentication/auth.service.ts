import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { AuthForm } from "src/app/interfaces/AuthForm"
import { Message } from "src/app/interfaces/Message"
import { TokenResponse } from "src/app/interfaces/TokenResponse"

@Injectable({
    providedIn: "root",
})
export class AuthService {
    constructor(private http: HttpClient) {}

    // Sign up user
    public signup(form: AuthForm) {
        return this.http.post<Message>(`/api/auth/signup`, form)
    }

    // Sign in user
    public signin(form: AuthForm) {
        return this.http.post<TokenResponse>(`/api/auth/signin`, form)
    }

    // Log out user
    public logout() {
        return this.http.get<TokenResponse>(`/api/auth/logout`)
    }
}
