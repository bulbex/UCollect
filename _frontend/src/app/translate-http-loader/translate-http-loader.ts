import { HttpClient } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

// Function, which access i18n files
export function TranslateHttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, "assets/i18n/")
}