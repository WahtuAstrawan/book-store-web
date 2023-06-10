const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    judul:{
        type: String,
        required: true,
    },
    penulis:{
        type: String,
        required: true,
    },
    penerbit:{
        type: String,
        required: true,
    },
    tahuntbt:{
        type: Number,
        required: true,
    },
    kategori:{
        type: String,
        enum: ['Fiksi', 'Nonfiksi', 'Pendidikan', 'Anak-anak', 'Pengembangan Diri', 'Seni dan Desain'],
        required: true,
    },
    harga:{
        type: Number,
        required: true,
    },
    stok:{
        type: Number,
        required: true,
    },
})

module.exports = mongoose.model("Book", bookSchema);