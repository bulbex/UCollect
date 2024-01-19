import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { Subject, first } from "rxjs"
import { Item } from "src/app/interfaces/Item"

@Injectable({
    providedIn: "root",
})
export class SearchService {

    public searchResult$ = new Subject<Item[]>()

    constructor(private http: HttpClient) {}

    // Search items
    public search(string: string) {
        this.http.get<Item[]>(`/api/data/search?value=${string}`).pipe(first()).subscribe({
            next: (response: Item[]) => {
                this.searchResult$.next(response)
            },
            error: (error) => {
                console.log(error)
            },
        })
    }
}
