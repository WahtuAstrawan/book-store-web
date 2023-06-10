const Book = require("../models/Book");

module.exports = {

    viewBooks: async(req, res) =>{
        try{
            const books = await Book.find();

            const alertMessage = req.flash("alertMessage");
            const alertStatus = req.flash("alertStatus");
    
            const alert = {message: alertMessage, status: alertStatus};

            if(req.session.loggedIn){
                const userName = req.session.userName;
                const tipeUser = req.session.tipeUser;
        
                res.render("books",{
                    books,
                    alert,
                    userName,
                    tipeUser,
                    title: "Books",
                });
            }else{
                res.redirect("/");
            }
        }catch{
            res.redirect("/books");
        }
    },

    addBooks: async(req, res) =>{
        try{
            const { judul, penulis, penerbit, tahuntbt, kategori, harga, stok } = req.body;

            if(harga < 0){
                req.flash("alertMessage", "Harga buku tidak boleh kurang dari 0");
                req.flash("alertStatus", "danger");
                return res.redirect("/books");
            }

            if(stok < 0){
                req.flash("alertMessage", "Stok buku tidak boleh kurang dari 0");
                req.flash("alertStatus", "danger");
                return res.redirect("/books");
            }

            await Book.create({judul, penulis, penerbit, tahuntbt, kategori, harga, stok});

            req.flash("alertMessage", "Sukses menambahkan data buku");
            req.flash("alertStatus", "success");
            res.redirect("/books");
        }catch(error){
            req.flash("alertMessage", `${error.message}`);
            req.flash("alertStatus", "danger");
            res.redirect("/books");
        }
    },

    editBooks: async(req, res) =>{
        try{
            const { id, judul, penulis, penerbit, tahuntbt, kategori, harga, stok } = req.body;
            
            const book = await Book.findOne({_id: id});

            book.judul = judul;
            book.penulis = penulis;
            book.penerbit = penerbit;
            book.tahuntbt = tahuntbt;
            book.kategori = kategori;
            book.harga = harga;
            book.stok = stok;
            
            if(harga < 0){
                req.flash("alertMessage", "Harga buku tidak boleh kurang dari 0");
                req.flash("alertStatus", "danger");
                return res.redirect("/books");
            }

            if(stok < 0){
                req.flash("alertMessage", "Stok buku tidak boleh kurang dari 0");
                req.flash("alertStatus", "danger");
                return res.redirect("/books");
            }

            await book.save();

            req.flash("alertMessage", "Sukses mengedit data buku");
            req.flash("alertStatus", "success");

            res.redirect("/books");

        }catch(error){
            req.flash("alertMessage", `${error.message}`);
            req.flash("alertStatus", "danger");

            res.redirect("/books");
        }
    },

    deleteBooks: async(req,res) =>{
        try{
            const {id} = req.params;

            await Book.deleteOne({ _id: id});

            req.flash("alertMessage", "Sukses menghapus data buku");
            req.flash("alertStatus", "warning");

            res.redirect("/books");
        }catch(error){
            req.flash("alertMessage", `${error.message}`);
            req.flash("alertStatus", "danger");

            res.redirect("/books");
        }
    },
}