import { Component, OnInit } from "@angular/core"
import { Router } from "@angular/router"
import { first } from "rxjs"
import { Message } from "src/app/interfaces/Message"
import { User } from "src/app/interfaces/User"
import { AdminService } from "src/app/_services/admin/admin.service"
import { ToastService } from "src/app/_services/notification/toast.service"
import { UserService } from "src/app/_services/user/user.service"

@Component({
    selector: "app-admin-panel",
    templateUrl: "./admin-panel.component.html",
    styleUrls: ["./admin-panel.component.scss"],
})
export class AdminPanelComponent implements OnInit {
    // Users from DB
    public users!: User[]

    // Users, which aro going to be modified
    public usersToModify: string[] = []

    constructor(
        private adminService: AdminService,
        private toast: ToastService,
        private userService: UserService,
        private router: Router
    ) {}

    // Toggle users, which are going to be modified
    public toggleUserToModify(id: string) {
        let index = this.usersToModify.findIndex((userId) => userId === id)
        index === -1 ? this.usersToModify.push(id) : this.usersToModify.splice(index, 1)
    }

    // Getting all users via adminService
    public getAllUsers() {
        this.adminService
        .getUsers()
        .pipe(first())
        .subscribe({
            next: (response: User[]) => {
                this.users = response
            },
            error: (error) => {
                this.toast.error(error.error.message)
                this.userService.getUserData()
                this.router.navigateByUrl("")
            },
        })
    }

    // Unblock users
    public unblock() {
        if (this.usersToModify.length) {
            this.adminService
            .unblock(this.usersToModify)
            .pipe(first())
            .subscribe({
                next: (response: Message) => {
                    this.toast.success(response.message)
                    this.usersToModify = []
                    this.getAllUsers()
                },
                error: (error) => {
                    this.toast.error(error.error.message)
                    this.router.navigateByUrl("")
                },
            })
        }
    }

    // Block users
    public block() {
        if (this.usersToModify.length) {
            this.adminService
            .block(this.usersToModify)
            .pipe(first())
            .subscribe({
                next: (response: Message) => {
                    this.toast.success(response.message)
                    this.usersToModify = []
                    this.getAllUsers()
                },
                error: (error) => {
                    this.toast.error(error.error.message)
                    this.router.navigateByUrl("")
                },
            })
        }
    }

    // Delete users
    public delete() {
        if (this.usersToModify.length) {
            this.adminService
            .delete(this.usersToModify)
            .pipe(first())
            .subscribe({
                next: (response: Message) => {
                    this.toast.success(response.message)
                    this.usersToModify = []
                    this.getAllUsers()
                },
                error: (error) => {
                    this.toast.error(error.error.message)
                    this.router.navigateByUrl("")

                },
            })
        }
    }

    // Adding users to admins
    public makeAdmin() {
        if (this.usersToModify.length) {
            this.adminService
            .makeAdmin(this.usersToModify)
            .pipe(first())
            .subscribe({
                next: (response: Message) => {
                    this.toast.success(response.message)
                    this.usersToModify = []
                    this.getAllUsers()
                },
                error: (error) => {
                    this.toast.error(error.error.message)
                    this.router.navigateByUrl("")

                },
            })
        }
    }

    // Delete users from admins
    public deleteFromAdmin() {
        if (this.usersToModify.length) {
            this.adminService
            .deleteAdmin(this.usersToModify)
            .pipe(first())
            .subscribe({
                next: (response: Message) => {
                    this.toast.success(response.message)
                    this.usersToModify = []
                    this.getAllUsers()
                },
                error: (error) => {
                    this.toast.error(error.error.message)
                    this.router.navigateByUrl("")

                },
            })
        }
    }

    // Getting all users on init
    ngOnInit(): void {
        this.getAllUsers()
    }
}
