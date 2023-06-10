const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    nama: {
        type: String,
        required: true,
    },
    telp:{
        type: String,
        required: true,
    },
    umur:{
        type: Number,
        required: true,
    },
    alamat:{
        type: String,
        required: true,
    },
    aktifsts:{
        type: String,
        enum: ['Aktif','Non Aktif'],
        required: true,
    },
    jenisusr:{
        type: String,
        enum: ['Admin', 'Member', 'Pegawai'],
        required: true,
    },
    username:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    }
});

module.exports = mongoose.model("User", userSchema);