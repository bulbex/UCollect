import { Component, OnInit } from "@angular/core"
import { NgForm } from "@angular/forms"
import { Router } from "@angular/router"
import { first } from "rxjs"
import { TokenResponse } from "src/app/interfaces/TokenResponse"
import { AuthService } from "src/app/_services/authentication/auth.service"
import { ToastService } from "src/app/_services/notification/toast.service"
import { UserService } from "src/app/_services/user/user.service"

@Component({
    selector: "app-signin",
    templateUrl: "./signin.component.html",
    styleUrls: ["./signin.component.scss"],
})
export class SigninComponent implements OnInit {
    constructor(
        private router: Router,
        private authService: AuthService,
        private toast: ToastService,
        private userService: UserService
    ) {}

    // Sign in user via authService
    signinUser(form: NgForm) {
        this.authService
        .signin(form.value)
        .pipe(first())
        .subscribe({
            next: (response: TokenResponse) => {
                localStorage.setItem("token", response.token)
                this.userService.getUserData()
                this.toast.success(response.message)
                this.router.navigateByUrl("")
            },
            error: (error) => {
                this.toast.error(error.error.message)
            },
        })
    }

    ngOnInit(): void {}
}
