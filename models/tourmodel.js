const mongoose = require('mongoose')

const tourSchema = new mongoose.Schema({
   name: {
      type: String,
      required: [true, 'A tour must have  name'],
      unique: true,
      trim: true                   // .....dnlkd.......=dnlkd
  },
  duration: {
      type: Number,
      required: [true, 'A tour must have a duration']

  },
  maxGroupSize: {
      type: Number,
      required: [true, 'A tour  must havee a group size']

  },
  difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum:['easy','medium','difficult']

  },

  ratingAverage: {
      type: Number,
      default: 4.5,
      min: [1,'Rating must be above 1.0'],
      max: [5,'Rating must be below 5.0']

  },

  ratingQuatity: {
      type: Number,
      default: 0
  },

  price: {
      type: Number,
      required: [true, 'A tour must have a price']
  },
  priceDiscount: Number,
  summery: {
      type: String,
      trim: true,     //remove the space bet
      required: [false, 'A tour must have a description ']
  },
  summary: {
      type: String,
  },
  description: {
      type: String,
      trim: true
  },
  imageCover: {
      type: String,
      required: [false, 'A tour must have a cover image']
  },
  images: [String],
  createdAt: {
      type: Date,
      default: Date.now(),
      select:false   //hiding from user 
  },
  startDates: [Date],
  guides:   [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
},
{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})

tourSchema.virtual('durationWeeks').get(function() {
    return this.duration /7;
})

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;