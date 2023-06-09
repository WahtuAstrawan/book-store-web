const Users = require("../models/Users");
const bcrypt = require('bcrypt');

module.exports = {

    viewUsers: async (req, res) => {
        try{
            const users = await Users.find();
    
            const alertMessage = req.flash("alertMessage");
            const alertStatus = req.flash("alertStatus");
    
            const alert = {message: alertMessage, status: alertStatus};

            if(req.session.loggedIn){
                const userName = req.session.userName;
                const tipeUser = req.session.tipeUser;
        
                res.render("users",{
                    users,
                    alert,
                    userName,
                    tipeUser,
                    title: "Users",
                });
            }else{
                res.redirect("/");
            }
        } catch(error){
            res.redirect("/users");
        }
    },
    addUsers: async(req, res) =>{
        try{
            const { nama, telp, umur, alamat, isAktif, jenisUser, username, password } = req.body;
            
            const existingUser = await Users.findOne({ username });
            if (existingUser) {
                req.flash("alertMessage", "Username sudah digunakan");
                req.flash("alertStatus", "danger");
                return res.redirect("/users");
            }
            
            if(password.length > 30){
                req.flash("alertMessage", "Panjang password tidak boleh lebih dari 30 karakter");
                req.flash("alertStatus", "danger");
                return res.redirect("/users");
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            await Users.create({nama, telp, umur, alamat, isAktif, jenisUser, username, password:hashedPassword});

            req.flash("alertMessage", "Sukses menambahkan data user");
            req.flash("alertStatus", "success");
            res.redirect("/users");
        }catch(error){
            req.flash("alertMessage", `${error.message}`);
            req.flash("alertStatus", "danger");
            res.redirect("/users");
        }
    },

    editUsers: async(req, res) =>{
        try{
            const { id, nama, telp, umur, alamat, isAktif, jenisUser, username, password } = req.body;
            
            const users = await Users.findOne({_id: id});

            users.nama = nama;
            users.telp = telp;
            users.umur = umur;
            users.alamat = alamat;
            users.isAktif = isAktif;
            users.jenisUser = jenisUser;
            users.username = username;
            
            if(password.length == 60){
                users.password = password;
            }else{
                const hashedPassword = await bcrypt.hash(password, 10);
                users.password = hashedPassword;
            }

            await users.save();

            req.flash("alertMessage", "Sukses mengedit data user");
            req.flash("alertStatus", "success");

            res.redirect("/users");

        }catch(error){
            req.flash("alertMessage", `${error.message}`);
            req.flash("alertStatus", "danger");

            res.redirect("/users");
        }
    },

    deleteUsers: async(req,res) =>{
        try{
            const {id} = req.params;

            await Users.deleteOne({ _id: id});

            req.flash("alertMessage", "Sukses menghapus data user");
            req.flash("alertStatus", "warning");

            res.redirect("/users");
        }catch(error){
            req.flash("alertMessage", `${error.message}`);
            req.flash("alertStatus", "danger");

            res.redirect("/users");
        }
    },
};