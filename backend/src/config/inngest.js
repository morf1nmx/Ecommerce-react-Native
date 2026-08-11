import { Inngest } from "inngest";
import { connectDB } from "./db.js";
import { User } from "../models/user.model.js";

export const inngest = new Inngest({
    id: "ecommerce-app"
});

const syncUser = inngest.createFunction(
    { id: "sync-user",triggers: [{event: "clerk/user.created"}] },
    async ({ event }) => {
        console.log("Syncing user to DB", event.data);
    }
);

const deleteUserFromDB = inngest.createFunction(
    {id: "delete-user-from-db",triggers: [{event: "clerk/user.deleted"}]},
    async ({ event }) => {
        console.log("Deleting user from DB", event.data);
    }
);
    

export const functions = [
    syncUser,
    deleteUserFromDB
];