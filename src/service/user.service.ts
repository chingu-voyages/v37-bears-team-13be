import { User } from '../models';
import { PasswordManager } from '../util/hash';

interface UserInput {
  email: string;
  password?: string;
}

export const findUser = async ({ email, password }: UserInput) => {
  try {
    const user = await User.findOne({ email });

    if (!user) return false;

    const { password: other, _id, __v, ...rest } = user.toJSON();

    if (!password) return rest;

    const isValid = await PasswordManager.compare(user.password, password);

    if (!isValid) throw new Error('Wrong credentials');

    return rest;
  } catch (err: any) {
    throw Error(err);
  }
};

export const findAllUsers = async () => {
  try {
    const users = await User.find();

    if (!users) throw new Error('No users found');

    return users;
  } catch (err: any) {
    throw new Error(err.message);
  }
};
