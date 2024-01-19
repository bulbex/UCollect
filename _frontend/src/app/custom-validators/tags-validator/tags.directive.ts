import { Directive } from "@angular/core"
import {
    AbstractControl,
    NG_VALIDATORS,
    Validator,
    ValidatorFn,
    ValidationErrors,
} from "@angular/forms"

// Checks if provided tags are correctly
export function createTagsValidator(): ValidatorFn {
    return (input: AbstractControl): ValidationErrors | null => {
        return input.value &&
            input.value.trim().startsWith("#") &&
            input.value.trim().match(/#\w+/g)
            ? null
            : { isTags: true }
    }
}

@Directive({
    selector: "[tags]",
    providers: [
        {
            provide: NG_VALIDATORS,
            useExisting: TagsDirective,
            multi: true,
        },
    ],
    standalone: true
})
export class TagsDirective implements Validator {
    validate(tags: AbstractControl<any, any>): ValidationErrors | null {
        return createTagsValidator()(tags)
    }
}
