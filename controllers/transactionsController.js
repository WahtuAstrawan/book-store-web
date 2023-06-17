const Transaction = require("../models/Transaction");
const Book = require("../models/Book");
const User = require("../models/User");
const moment = require('moment');

module.exports = {

    viewTransactions: async(req, res) =>{
        try{
            const transactions = await Transaction.find();
            const books = await Book.find();
            const members = await User.find({ jenisusr: "Member", aktifsts: "Aktif" });

            const alertMessage = req.flash("alertMessage");
            const alertStatus = req.flash("alertStatus");
    
            const alert = {message: alertMessage, status: alertStatus};

            if(req.session.loggedIn){
                const userName = req.session.userName;
                const tipeUser = req.session.tipeUser;
        
                res.render("transactions",{
                    transactions,
                    books,
                    members,
                    alert,
                    moment,
                    userName,
                    tipeUser,
                    title: "Transactions",
                });
            }else{
                res.redirect("/");
            }
        }catch{
            res.redirect("/transactions");
        }
    },

    addTransactions: async (req, res) => {
        try {
            const { idmember, idbuku, jmlbeli } = req.body;
            const pegawaiusn = req.session.userName;
        
            let hrgtotal = 0;
            let details = [];

            if(Array.isArray(idbuku)){
                for (let i = 0; i < idbuku.length; i++) {
                    let book = await Book.findOne({ _id: idbuku[i] });
                    let detail = {
                        idbuku: idbuku[i],
                        jmlbeli: jmlbeli[i],
                    };
                    details.push(detail);
                    hrgtotal += book.harga * jmlbeli[i];
                    if(jmlbeli[i] > book.stok){
                        req.flash("alertMessage", `Tidak dapat membeli buku ${book.judul} dengan jumlah ${jmlbeli[i]} karena stok kurang`);
                        req.flash("alertStatus", "danger");
                        return res.redirect("/transactions");
                    }
                    book.jmlbeli += parseInt(jmlbeli[i]);
                    book.stok -= parseInt(jmlbeli[i]);
                    await book.save();
                }
            }else{
                let book = await Book.findOne({ _id: idbuku });
                let detail = {
                    idbuku: idbuku,
                    jmlbeli: jmlbeli,
                };
                details.push(detail);
                hrgtotal += book.harga * jmlbeli;
                if(jmlbeli > book.stok){
                    req.flash("alertMessage", `Tidak dapat membeli buku ${book.judul} dengan jumlah ${jmlbeli} karena stok kurang`);
                    req.flash("alertStatus", "danger");
                    return res.redirect("/transactions");
                }
                book.jmlbeli += parseInt(jmlbeli);
                book.stok -= parseInt(jmlbeli);
                await book.save();
            }
            
        
            await Transaction.create({ idmember, details, hrgtotal, pegawaiusn });
        
            req.flash("alertMessage", "Sukses menambahkan data transaksi");
            req.flash("alertStatus", "success");
            res.redirect("/transactions");
        } catch (error) {
            req.flash("alertMessage", `${error.message}`);
            req.flash("alertStatus", "danger");
            res.redirect("/transactions");
        }
      },

    editTransactions: async(req, res) =>{
        try{
            const { idmember, idbuku, jmlbeli, pegawaiusn } = req.body;

            const transaction = await Transaction.findById(req.params.id);

            if(req.session.tipeUser === "Pegawai" && req.session.userName === pegawaiusn){
                pegawaiusn = req.session.userName;
            }
        
            let hrgtotal = 0;
            let details = [];

            if(Array.isArray(idbuku)){
                for (let i = 0; i < idbuku.length; i++) {
                    let book = await Book.findOne({ _id: idbuku[i] });
                    let detail = {
                        idbuku: idbuku[i],
                        jmlbeli: jmlbeli[i],
                    };
                    details.push(detail);
                    hrgtotal += book.harga * jmlbeli[i];

                    const detailBuku = transaction.details.find((detail) => detail.idbuku.toString() === idbuku[i].toString());

                    if(jmlbeli[i] > book.stok){
                        req.flash("alertMessage", `Tidak dapat membeli buku ${book.judul} dengan jumlah ${jmlbeli[i]} karena stok kurang`);
                        req.flash("alertStatus", "danger");
                        return res.redirect("/transactions");
                    }
                    let jmlLakuawl = book.jmlbeli - detailBuku.jmlbeli;
                    book.jmlbeli = jmlLakuawl + parseInt(jmlbeli[i]);
                    let stokawl = book.stok + detailBuku.jmlbeli;
                    book.stok = stokawl - parseInt(jmlbeli[i]);
                    await book.save();
                }
            }else{
                let book = await Book.findOne({ _id: idbuku });
                let detail = {
                    idbuku: idbuku,
                    jmlbeli: jmlbeli,
                };
                details.push(detail);
                hrgtotal += book.harga * jmlbeli;

                const detailBuku = transaction.details.find((detail) => detail.idbuku.toString() === idbuku.toString());

                if(jmlbeli > book.stok){
                    req.flash("alertMessage", `Tidak dapat membeli buku ${book.judul} dengan jumlah ${jmlbeli} karena stok kurang`);
                    req.flash("alertStatus", "danger");
                    return res.redirect("/transactions");
                }

                let jmlLakuawl = book.jmlbeli - detailBuku.jmlbeli;
                book.jmlbeli = jmlLakuawl + parseInt(jmlbeli);
                let stokawl = book.stok + detailBuku.jmlbeli;
                book.stok = stokawl - parseInt(jmlbeli);
                await book.save();
            }

            await Transaction.findByIdAndUpdate(req.params.id, {
                idmember,
                details,
                hrgtotal,
                pegawaiusn,
            });

            req.flash("alertMessage", "Sukses mengedit data transaksi");
            req.flash("alertStatus", "success");

            res.redirect("/transactions");

        }catch(error){
            req.flash("alertMessage", `${error.message}`);
            req.flash("alertStatus", "danger");

            res.redirect("/transactions");
        }
    },

    deleteTransactions: async(req,res) =>{
        try{
            const {id} = req.params;

            await Transaction.deleteOne({_id: id});

            req.flash("alertMessage", "Sukses menghapus data transaksi");
            req.flash("alertStatus", "warning");

            res.redirect("/transactions");
        }catch(error){
            req.flash("alertMessage", `${error.message}`);
            req.flash("alertStatus", "danger");

            res.redirect("/transactions");
        }
    },
}