import { Component, OnInit } from "@angular/core"
import { NgForm } from "@angular/forms"
import { Router } from "@angular/router"
import { first } from "rxjs"
import { AuthForm } from "src/app/interfaces/AuthForm"
import { Message } from "src/app/interfaces/Message"
import { AuthService } from "src/app/_services/authentication/auth.service"
import { ToastService } from "src/app/_services/notification/toast.service"

@Component({
    selector: "app-signup",
    templateUrl: "./signup.component.html",
    styleUrls: ["./signup.component.scss"],
})
export class SignupComponent implements OnInit {
    constructor(
        private router: Router,
        private authService: AuthService,
        private toast: ToastService,
    ) {}

    // Sign up user via authService
    signupUser(form: NgForm) {
        const signupForm: AuthForm = {
            username: form.value.username.trim(),
            email: form.value.email.trim(),
            password: form.value.password,
        }
        this.authService
        .signup(signupForm)
        .pipe(first())
        .subscribe({
            next: (response: Message) => {
                this.toast.success(response.message)
                this.router.navigateByUrl("/signin")
            },
            error: (error) => {
                this.toast.error(error.error.message)
            },
        })
    }

    ngOnInit(): void {}
}
