import { User } from '../../models';
import { PasswordManager } from '../../util/hash';

interface UserInput {
  username: string;
  password?: string;
}

export const findUser = async ({ username, password }: UserInput) => {
  try {
    const user = await User.findOne({ username });

    if (!user) throw new Error('User not found');

    const { password: other, _id, __v, ...rest } = user.toJSON();

    if (!password) return rest;

    const isValid = await PasswordManager.compare(user.password, password);

    if (!isValid) throw new Error('Wrong credentials');

    return rest;
  } catch (err: any) {
    throw new Error(err);
  }
};
