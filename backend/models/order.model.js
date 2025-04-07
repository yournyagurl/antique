import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
	{
	  user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	  },
	  products: [
		{
		  product: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Product",
			required: true,
		  },
		  price: {
			type: Number,
			required: true,
			min: 0,
		  },
		},
	  ],
	  totalAmount: {
		type: Number,
		required: true,
		min: 0,
	  },
	  stripeSessionId: {
		type: String,
		unique: true,
	  },
	  status: {
		type: String,
		enum: ["pending", "shipping", "completed"],
		default: "pending",
	  },
	  shippingInfo: {
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		email: { type: String, required: true },
		address: { type: String, required: true },
		city: { type: String, required: true },
		postcode: { type: String, required: true },
		country: { type: String, required: true },
		phoneNumber: { type: String, required: true },
	  },
	},
	{ timestamps: true }
  );

  export default mongoose.model("Order", orderSchema);