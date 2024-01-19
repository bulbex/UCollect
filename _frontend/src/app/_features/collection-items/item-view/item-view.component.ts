import { Component, OnDestroy, OnInit } from "@angular/core"
import { NgForm } from "@angular/forms"
import { ActivatedRoute } from "@angular/router"
import { BehaviorSubject, Subject, first, interval, takeUntil } from "rxjs"
import { Comment } from "src/app/interfaces/Comment"
import { Item } from "src/app/interfaces/Item"
import { DataService } from "src/app/_services/data/data.service"
import { ToastService } from "src/app/_services/notification/toast.service"
import { UserService } from "src/app/_services/user/user.service"

@Component({
    selector: "app-item",
    templateUrl: "./item-view.component.html",
    styleUrls: ["./item-view.component.scss"],
})
export class ItemViewComponent implements OnInit, OnDestroy {

    public item$ = new BehaviorSubject<Item | null>(null)

    // Is current user can comment this item?
    public canComment: boolean = false

    // Is current user liked this item?
    public liked: boolean = false

    private unsubscribe$ = new Subject<null>()

    constructor(
        private dataService: DataService,
        public userService: UserService,
        private toast: ToastService,
        private route: ActivatedRoute
    ) {}

    // Get item via dataService
    public getItem() {
        let itemId = this.route.snapshot.paramMap.get("itemId")
        if (itemId) {
            this.dataService
            .getItem(itemId)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: (response: Item) => {
                    this.item$.next(response)
                    if (this.userService.user) {
                        this.canComment = !this.item?.comments.find((comment) => {
                            return comment.author === this.userService.user?.username
                        })
                        this.liked = !!this.item?.likes.includes(this.userService.user._id)
                    }
                },
                error: (error) => {
                    this.toast.error(error.error.message)
                },
            })
        }
    }

    // Write comment request
    public writeComment(form: NgForm) {
        if (this.item) {
            this.userService
            .comment(form.value, this.item._id)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: () => {
                    this.getItemFeedback()
                    form.resetForm()
                },
                error: (error) => {
                    this.toast.error(error.error.message)
                },
            })
        }
    }

    public toggleLike() {
        if (this.item) {
            this.userService
            .toggleLike(this.item._id)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: (response: string[]) => {
                    if (this.userService.user && this.item) {
                        this.item.likes = response
                        this.liked =
                            this.item?.likes.includes(this.userService.user._id) || false
                    }
                },
                error: (error) => {
                    this.toast.error(error.error.message)
                },
            })
        }
    }

    public getItemFeedback() {
        if (this.item) {
            this.dataService
            .getItemFeedback(this.item._id)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: (response: { comments: Comment[]; likes: string[] }) => {
                    if (this.item) {
                        this.item.comments = response.comments
                        this.item.likes = response.likes
                        if (this.userService.user) {
                            this.canComment = !this.item.comments.find((comment) => {
                                return comment.author === this.userService.user?.username
                            })
                            this.liked = this.item.likes.includes(this.userService.user._id)
                        }
                    }
                },
                error: (error) => {
                    this.toast.error(error.error.message)
                },
            })
        }
    }

    get item() {
        return this.item$.value
    }

    ngOnInit(): void {
        this.getItem()
        interval(5000).subscribe(() => this.getItemFeedback)
    }

    ngOnDestroy(): void {
        this.unsubscribe$?.unsubscribe()
    }
}
