import mongoose from 'mongoose';

// Attributes for a marketable security.
// This could be a stock, bond, option,
// derivative, etc. However, for simplification,
// and to not confuse with software security,
// we will just call it a stock.
interface StockAttributes {
  symbol: string;
  name: string;
}

// This takes a Mongoose Document type, and adds some other fields
// onto it. The result is the "StockDoc" type.
export interface StockDoc extends mongoose.Document {
  symbol: string;
  name: string;
}

// This takes a Mongoose model, and adds on a build function
// as a new StockModel type.
interface StockModel extends mongoose.Model<StockDoc> {
  build(attributes: StockAttributes): StockDoc; // eslint-disable-line no-unused-vars
}

// Define schema.
const stockSchema = new mongoose.Schema(
  {
    symbol: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
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

// Define "build" function to help enforce Typescript.
stockSchema.statics.build = (attributes: StockAttributes) =>
  new Stock(attributes);

// Connect the stock schema to mongoose as 'Stock'.
const Stock = mongoose.model<StockDoc, StockModel>('Stock', stockSchema);

export { Stock };
