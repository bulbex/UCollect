import { Injectable } from "@angular/core"
import { Notyf } from "notyf"
import { LangService } from "../language/lang.service"

@Injectable({
    providedIn: "root",
})
export class ToastService {

    // Makes user actions notifications
    private makeNotyf = new Notyf({
        duration: 3000,
        ripple: false,
        dismissible: true,
    })

    constructor(private langService: LangService) {}

    // Success notifications with translation
    public success(string: string) {
        this.makeNotyf.success(this.langService.translate(string))
    }

    // Error notifications with translation
    public error(string: string) {
        this.makeNotyf.error(this.langService.translate(string))
    }

}
