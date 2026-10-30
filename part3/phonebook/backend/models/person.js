const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)
mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, 'Length of name should ≥ 3'],
    requierd: [true, 'User name required']
  },
  number:{
    type: String,
    minLength: [8, 'Its length should ≥ 8'],
    required: [true, 'User phone number required'],
    validate: {
      validator: function(v){
        return /^\d{2,3}-\d+$/.test(v)
      },
      message: props => `${props.value} is not valid`
    }
  },
})

// normalization JSON
personSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

// export for index.js to use
module.exports = mongoose.model('Person', personSchema)