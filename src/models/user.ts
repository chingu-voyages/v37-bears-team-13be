import mongoose from 'mongoose';
import { PasswordManager } from '../util/hash';

// Atributes for a new user.
interface UserAttributes {
  username: string;
  email: string;
  password: string;
}

// This takes a Mongoose Document type, and adds some other fields
// onto it. The result is the "UserDoc" type.
export interface UserDoc extends mongoose.Document {
  username: string;
  email: string;
  password: string;
}

// This takes a Mongoose model, and adds on a build function
// as a new UserModel type.
interface UserModel extends mongoose.Model<UserDoc> {
  build(attributes: UserAttributes): UserDoc; // eslint-disable-line no-unused-vars
}

// Define the Mongoose user schema.
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    // Format the returned object in case the route/controller
    // decides to send information back to the client.
    toJSON: {
      transform(_, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

// This adds a function that hashes the users' password before it gets
// saved to the database.
// For this to work propertly on some versions of node/mongoose,
// we cannot use arrow functions here for some reason.
userSchema.pre('save', async function fn(done) {
  // Check if we've modified user's password since we might be retrieving user
  // out of db and re-saving them at some future point in time (like if the user wants
  // to change their email). In that case, we don't want to re-hash anything.
  // the .ismodified checks that, and is only true for new users.
  if (this.isModified('password')) {
    const hashed = await PasswordManager.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

// Define the "build" function to help enforce Typescript.
userSchema.statics.build = (attributes: UserAttributes) => new User(attributes);

// Connect the user schema to mongoose as 'User'.
const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
