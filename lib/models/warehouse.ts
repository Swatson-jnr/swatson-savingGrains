import mongoose from 'mongoose';

const warehouseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
  currentStock: [{
    grainType: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    measurementType: {
      type: String,
      enum: ['kg', 'bags'],
      required: true
    },
    pricePerUnit: {
      type: Number,
      required: true
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

export default mongoose.models.Warehouse || mongoose.model('Warehouse', warehouseSchema);
