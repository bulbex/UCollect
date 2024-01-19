import { Injectable } from "@angular/core"
import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpHeaders,
} from "@angular/common/http"
import { Observable } from "rxjs"
import { environment } from "src/environments/environment"


// Intercepts all request and tries to set authorization token
@Injectable({
    providedIn: "root",
})
export class RequestInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let token = localStorage.getItem("token")
        if (!token) {
            return next.handle(req)
        }
        let reqClone = req.clone({
            headers: new HttpHeaders({
                Authorization: `Bearer ${token}`,
            }),
            withCredentials: true,
        })
        return next.handle(reqClone)
    }
}
