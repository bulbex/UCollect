import { Subscription } from "rxjs"
import { UserService } from "../_services/user/user.service"

// Tries to get current user data when app initialize
export function initializeAppFactory(userService: UserService): () => Subscription {
    return () => userService.getUserData()
}
