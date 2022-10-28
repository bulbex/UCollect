import { Injectable } from "@angular/core"

@Injectable({
    providedIn: "root",
})
export class ThemeService {
    
    // Default theme value
    public default = "light"

    // Get current theme value
    get current(): string {
        return localStorage.getItem("theme") || this.default
    }

    // Set current theme value
    public set current(value: string) {
        localStorage.setItem("theme", value)
        this.style.href = `/${value}.css`
    }

    private style: HTMLLinkElement

    constructor() {
        this.style = document.createElement("link")
        this.style.rel = "stylesheet"

        document.head.appendChild(this.style)

        if (localStorage.getItem("theme") !== undefined) {
            this.style.href = `/${this.current}.css`
        }
    }
}
