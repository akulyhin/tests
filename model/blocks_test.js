const { Schema, model } = require("mongoose");


const blocksSchema = Schema({
    blockNumber:{
    type: Number,
    required: [true, 'blockNumber is required']
  },
  transactions: [{
    blockNumber: {
      type: Number,
      required: [true, 'blockNumber is required']
    },
    transactionId: {
      type: String,
      required: [true, 'TransactionId is required']
    },
    senderAddress: {
      type: String,
      required: [true, 'SenderAddress is required']
    },
    recipientsAddress: {
      type: String,
      required: [true, 'RecipientsAddress is required']
    },
    blockConfirmations: {
      type: Number,
      required: [true, 'blockConfirmations is required']
    },
    date: {
      type: String,
      required: [true, 'date is required']
    },
    value: {
      type: Number,
      required: [true, 'Value is required']
    },
    transactionFee: {
      type: Number,
      required: [true, 'transactionFee is required']
    }
    }]
}
  
  
  , {versionKey: false, timestamps: true})


  
const Blocks = model("block", blocksSchema);

module.exports = {
  Blocks
};
