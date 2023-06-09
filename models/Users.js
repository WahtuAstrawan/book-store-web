const mongoose = require("mongoose");

const aktifEnum = ['Aktif','Non Aktif'];
const userEnum = ['Admin', 'Member', 'Pegawai'];

const usersScheme = new mongoose.Schema({
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
    isAktif:{
        type: String,
        enum: aktifEnum,
        required: true,
    },
    jenisUser:{
        type: String,
        enum: userEnum,
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

module.exports = mongoose.model("Users", usersScheme);