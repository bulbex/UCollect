import { Component, OnInit } from "@angular/core"
import { AuthService } from "src/app/_services/authentication/auth.service"
import { ThemeService } from "src/app/_services/theme/theme.service"
import { LangService } from "src/app/_services/language/lang.service"
import { ToastService } from "src/app/_services/notification/toast.service"
import { Router } from "@angular/router"
import { UserService } from "src/app/_services/user/user.service"
import { TokenResponse } from "src/app/interfaces/TokenResponse"
import { NgForm } from "@angular/forms"
import { SearchService } from "src/app/_services/search/search.service"
import { first } from "rxjs"

@Component({
    selector: "app-header",
    templateUrl: "./header.component.html",
    styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {

    constructor(
        private router: Router,
        private toast: ToastService,
        public authService: AuthService,
        public userService: UserService,
        public langService: LangService,
        public theme: ThemeService,
        public searchService: SearchService
    ) {}

    // Icon for the button, that changes themes
    public themeIcon = "bi bi-sun-fill"

    // Search items via searchService
    public search(form: NgForm) {
        this.router.navigateByUrl(`/search/${form.value.searchValue}`)
    }

    // Setting language via langService
    public setLanguage(lang: string) {
        if (!this.langService.isSupported(lang)) {
            this.toast.error("This page does not support this language")
            return
        }
        this.langService.current = lang
    }

    // Changing theme via themeService
    public changeTheme() {
        if (this.theme.current === "light") {
            this.theme.current = "dark"
            this.themeIcon = "bi bi-sun-fill"
        } else {
            this.theme.current = "light"
            this.themeIcon = "bi bi-moon-fill"
        }
    }

    // Log out user via authService
    public logout() {
        this.authService
        .logout()
        .pipe(first())
        .subscribe({
            next: (response: TokenResponse) => {
                localStorage.setItem("token", response.token)
                this.userService.user = undefined
                this.toast.success(response.message)
                this.router.navigateByUrl("")
            },
            error: (error) => {
                this.toast.error(error.error.message)
            },
        })
    }

    ngOnInit(): void {
        // Setting language
        this.setLanguage(this.langService.current)

        // Changing themeIcon relatively to theme
        this.theme.current === "light"
            ? (this.themeIcon = "bi bi-moon-fill")
            : (this.themeIcon = "bi bi-sun-fill")
    }
}
