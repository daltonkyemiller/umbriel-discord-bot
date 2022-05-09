import { userSchema } from './schema/user.js';

export const fetchUser = async (user) => {
    let userDB = await userSchema.findOne({ id: user.id });
    
    // If no user found, create one
    if (!userDB) {
        userDB = new userSchema({
            id: user.id,
            username: user.username,
            registeredAt: Date.now()
        });
        await userDB.save().catch(err => console.log(err));
    }
    return userDB;
};

export const updateUser = async (user, newData) => {
    let dbUser = await fetchUser(user);
    await dbUser.updateOne(newData);
    await dbUser.save();

};