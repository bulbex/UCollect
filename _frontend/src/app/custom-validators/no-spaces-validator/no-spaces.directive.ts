import { Directive } from "@angular/core"
import {
    AbstractControl,
    NG_VALIDATORS,
    Validator,
    ValidatorFn,
    ValidationErrors,
} from "@angular/forms"

// Checks input value for extra spaces
export function createNoSpacesValidator(): ValidatorFn {
    return (input: AbstractControl): ValidationErrors | null => {
        return input.value && input.value.trim()
            ? null
            : { spaces: true }
    }
}

@Directive({
    selector: "[noSpaces]",
    providers: [
        {
            provide: NG_VALIDATORS,
            useExisting: NoSpacesDirective,
            multi: true,
        },
    ],
    standalone: true
})
export class NoSpacesDirective implements Validator {
    validate(input: AbstractControl<any, any>): ValidationErrors | null {
        return input ? createNoSpacesValidator()(input) : null
    }
}
