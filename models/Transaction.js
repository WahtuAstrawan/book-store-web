const mongoose = require("mongoose");

const transactionSchema = mongoose.Schema(
    {
    idmember: {
        type: mongoose.ObjectId,
        required: true,
    },
    details: [
        {
            idbuku:{
                type: mongoose.ObjectId,
                required: true,
            },
            jmlbeli:{
                type: Number,
                required: true,
            }
        },
    ],
    hrgtotal:{
        type: Number,
        required: true,
    },
    pegawaiusn: {
        type: String,
        required: true,
    },
},
    {timestamps: true}
);

module.exports = mongoose.model("Transaction", transactionSchema);