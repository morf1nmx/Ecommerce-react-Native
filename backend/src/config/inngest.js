import { Inngest } from "inngest";
import { connectDB } from "./db.js";
import { User } from "../models/user.model.js";

export const inngest = new Inngest({ id: "Ecommerce" });

const syncUser = inngest.createFunction(
    { id: "sync-user", triggers: [{ event: "clerk/user.created" }] },
    async ({ event }) => {
        await connectDB();
        const { id, email_addresses, first_name, last_name, profile_image_url } = event.data;
        
        const newUser = {
            clerkId: id,
            email: email_addresses[0].email_address,
            name: `${first_name} ${last_name}`,
            imageUrl: profile_image_url,
            address: [],
            wishlist: []
        };
        
        // Guardar el usuario en la base de datos
        await User.create(newUser);
    }
);

const deleteUserFromDB = inngest.createFunction(
    { id: "delete-user", triggers: [{ event: "clerk/user.deleted" }] },
    async ({ event }) => {
        await connectDB();
        const { id } = event.data;
        await User.deleteOne({ clerkId: id });
    }
);

export const functions = [syncUser, deleteUserFromDB];