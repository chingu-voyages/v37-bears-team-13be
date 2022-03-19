import { User } from '../../models';
import { PasswordManager } from '../../util/hash';

interface UserInput {
  username: string;
  password: string;
}

export const findUser = async ({ username, password }: UserInput) => {
  try {
    const user = await User.findOne({ username });

    if (!user) throw new Error('Wrong credentials');

    const isValid = await PasswordManager.compare(user.password, password);

    if (!isValid) throw new Error('Wrong credentials');

    const { password: other, _id, __v, ...rest } = user.toJSON();

    return rest;
  } catch (err: any) {
    throw new Error(err);
  }
};
