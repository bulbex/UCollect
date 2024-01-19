import { Directive, Input } from "@angular/core"
import {
    AbstractControl,
    NG_VALIDATORS,
    Validator,
    ValidatorFn,
    ValidationErrors,
} from "@angular/forms"

// Checks provided password with password confirm
export function createPasswordConfirmValidator(password: string): ValidatorFn {
    return (confirm: AbstractControl): ValidationErrors | null => {
        return password && confirm && password === confirm.value
            ? null
            : { mustMatch: true }
    }
}

@Directive({
    selector: "[mustMatch]",
    providers: [
        {
            provide: NG_VALIDATORS,
            useExisting: PasswordConfirmDirective,
            multi: true,
        },
    ],
    standalone: true
})
export class PasswordConfirmDirective implements Validator {
    @Input("mustMatch") password!: string

    validate(confirm: AbstractControl<any, any>): ValidationErrors | null {
        return this.password
            ? createPasswordConfirmValidator(this.password)(confirm)
            : null
    }
}
