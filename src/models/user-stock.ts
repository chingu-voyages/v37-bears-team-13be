import mongoose from 'mongoose';
import { StockDoc } from './stock';

interface UserStockAttributes {
  userId: string;
  userNotes: string;
  stock: StockDoc;
}

export interface UserStockDoc extends mongoose.Document {
  userId: string;
  userNotes: string;
  stock: StockDoc;
}

interface UserStockModel extends mongoose.Model<UserStockDoc> {
  build(attributes: UserStockAttributes): UserStockDoc; // eslint-disable-line no-unused-vars
}

const userStockSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    userNotes: {
      type: String,
      required: false,
    },
    stock: {
      type: mongoose.Schema.Types.ObjectId, // an id that links to a stock
      ref: 'Stock',
    },
  },
  {
    toJSON: {
      // Make '_id' to be 'id', and delete '__v' field.
      transform(_, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

userStockSchema.statics.build = (attributes: UserStockAttributes) =>
  new UserStock(attributes);

const UserStock = mongoose.model<UserStockDoc, UserStockModel>(
  'UserStock',
  userStockSchema
);

export { UserStock };
