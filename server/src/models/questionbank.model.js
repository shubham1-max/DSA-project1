const{Schema,model}=require("mongoose")


const Questionbank = new Schema({

     title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    topic: {
      type: String,
      required: true,
      trim: true,
    },

    pattern: {
      type: String,
      required: true,
      trim: true,
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },

    company: [{
      type: String,
      trim: true,
    }],

    links: [{
      type: String,
      trim: true,
    }],

    cachedAIResponse: {
      type: Schema.Types.Mixed,
      default: null,
    },

    seededAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
)


Questionbank.index({
  topic: 1,
  difficulty: 1,
});

const QuestionBankSchema= model("questionbank",Questionbank);

module.exports=QuestionBankSchema;



