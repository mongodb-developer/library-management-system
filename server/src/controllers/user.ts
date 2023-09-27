import { ObjectId } from 'mongodb';
import { collections } from '../database.js';
import { IssueDetailType } from '../models/issue-detail.js';

class UserController {
    public async createNewUser() {
        // Generate a random username from a list of 20 adjectives and 20 animals
        const adjectives = ['Abrasive', 'Brash', 'Callous', 'Daft', 'Eccentric', 'Fiesty', 'Golden', 'Holy', 'Ignominious', 'Joltin', 'Killer', 'Luscious', 'Mushy', 'Nasty', 'OldSchool', 'Pompous', 'Quiet', 'Rowdy', 'Sneaky', 'Tawdry'];
        const animals = ['Alligator', 'Barracuda', 'Cheetah', 'Dingo', 'Elephant', 'Falcon', 'Gorilla', 'Hyena', 'Iguana', 'Jaguar', 'Koala', 'Lemur', 'Mongoose', 'Narwhal', 'Orangutan', 'Platypus', 'Quetzal', 'Rhino', 'Scorpion', 'Tarantula'];
        const randomUsername = `${adjectives[Math.floor(Math.random() * 20)]} ${animals[Math.floor(Math.random() * 20)]}`;

        const result = await collections?.users?.insertOne({ name: randomUsername });
        const user = { _id: result.insertedId, name: randomUsername };

        return user;
    }

    public async getUser(username: string) {
        const user = await collections?.users?.findOne({ name: username });
        return user;
    }

    public async getUserById(userId: string) {
        const objectId = new ObjectId(userId);
        const user = await collections?.users?.findOne({ _id: objectId });

        return user;
    }

    private async updateUserCount(userId: string, value: number, borrowedOrReserved: IssueDetailType) {
        const objectId = new ObjectId(userId);
        const result = await collections?.users?.updateOne({ _id: objectId }, {
            $inc: {
                reserved: value,
                totalInHand: value
            }
        });

        return result;
    }

    public async incrementUserReservationCount(userId: string) {
        return this.updateUserCount(userId, 1, IssueDetailType.Reservation);
    }

    public async decrementUserReservationCount(userId: string) {
        return this.updateUserCount(userId, -1, IssueDetailType.Reservation);
    }

    public async incrementUserBorrowedCount(userId: string) {
        return this.updateUserCount(userId, 1, IssueDetailType.BorrowedBook);
    }

    public async decrementUserBorrowedCount(userId: string) {
        return this.updateUserCount(userId, -1, IssueDetailType.BorrowedBook);
    }

}

export default UserController;