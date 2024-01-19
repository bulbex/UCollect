import { Injectable } from "@angular/core"
import { TranslateService } from "@ngx-translate/core"
import { TranslatePipe } from "@ngx-translate/core"

@Injectable({
    providedIn: "root",
})
export class LangService {

    // Default lang
    public default = "en"

    // Get current language from localStorage
    get current(): string {
        return localStorage.getItem("lang") || this.default
    }

    // Set current language from localStorage
    public set current(lang: string) {
        localStorage.setItem("lang", lang)
        this.translateService.use(lang)
    }

    // Check if page support provided language
    public isSupported(lang: string): boolean {
        return this.translateService.langs.includes(lang)
    }

    // Translate provided value to the current language
    public translate(value: string): string {
        return this.translatePipe.transform(value)
    }

    constructor(
        private translateService: TranslateService, // Service for setting translation language
        private translatePipe: TranslatePipe // Pipe for translation in component class
    ) {
        this.translateService.addLangs(["en", "pl"])
    }
}