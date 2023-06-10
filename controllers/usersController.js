const User = require("../models/User");
const bcrypt = require('bcrypt');

module.exports = {

    viewUsers: async (req, res) => {
        try{
            const users = await User.find();
    
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
            const { nama, telp, umur, alamat, aktifsts, jenisusr, username, password } = req.body;
            
            const existingUser = await User.findOne({ username });
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
            await User.create({nama, telp, umur, alamat, aktifsts, jenisusr, username, password:hashedPassword});

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
            const { id, nama, telp, umur, alamat, aktifsts, jenisusr, username, password } = req.body;
            
            const user = await User.findOne({_id: id});

            user.nama = nama;
            user.telp = telp;
            user.umur = umur;
            user.alamat = alamat;
            user.aktifsts = aktifsts;
            user.jenisusr = jenisusr;
            user.username = username;
            
            if(password.length == 60){
                user.password = password;
            }else if(password.length > 30 && password.length < 60){
                req.flash("alertMessage", "Panjang password tidak boleh lebih dari 30 karakter");
                req.flash("alertStatus", "danger");
                return res.redirect("/users");
            }else{
                const hashedPassword = await bcrypt.hash(password, 10);
                user.password = hashedPassword;
            }

            await user.save();

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

            await User.deleteOne({ _id: id});

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