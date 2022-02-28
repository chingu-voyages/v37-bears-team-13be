import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

// Go from callback implementation to Promise/async/await implementation.
const scryptAsync = promisify(scrypt);

// Constants used in cryptographic hashing.
const KEY_LENGTH = 64;
const RANDOM_BYTES_SIZE = 8;

/*
  This class uses the built in NodeJS crypto functions to
  help manage passwords.
*/
export class PasswordManager {
  /**
   * Given a string, create and return a salted hash.
   *
   * @remarks
   * The solt buffer is converted to a hexadecimal string of
   * length 2*RANDOM_BYTES_SIZE. Likewise, the hashed password
   * (which is placed before the period) is of length
   * 2* KEY_LENGTH.
   *
   *
   * @param password  - User supplied password string.
   * @returns - A string consisting of the hashed password
   *            and the salt string in the format
   *            hashedPassword.salt
   */
  static async toHash(password: string) {
    const salt = randomBytes(RANDOM_BYTES_SIZE).toString('hex');
    const buf = (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer;
    return `${buf.toString('hex')}.${salt}`;
  }

  /**
   * Check if a stored hashed password matches the hash of a
   * supplied password.
   *
   * @remarks
   *
   * @param storedPassword    - Stored password hash from the database.
   * @param suppliedPassword  - Password supplied from a user.
   * @returns - Boolean. True if the hash of the supplied password matches
   *            the stored password, false otherwise.
   *
   */
  static async compare(storedPassword: string, suppliedPassword: string) {
    const [hashedPassword, salt] = storedPassword.split('.');
    const buf = (await scryptAsync(
      suppliedPassword,
      salt,
      KEY_LENGTH
    )) as Buffer;
    return buf.toString('hex') === hashedPassword;
  }
}
