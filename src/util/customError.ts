export interface MyError {
  status: number;
  message: string;
}

const customError = (
  status: number,
  message: string = 'Invalid credentials'
): MyError => ({
  status,
  message,
});

export default customError;
