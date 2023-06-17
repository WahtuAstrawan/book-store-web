const User = require("../models/User");
const Transaction = require("../models/Transaction");
const Book = require("../models/Book");
const moment = require('moment');

module.exports = {
    viewReports: async(req, res) => {
        try{
            const users = await User.find();
            const books = await Book.find();
            const transactions = await Transaction.find();

            let filter = {};
    
            const alertMessage = req.flash("alertMessage");
            const alertStatus = req.flash("alertStatus");
            const alert = {message: alertMessage, status: alertStatus};
    
            const tipeUser = req.session.tipeUser;
            const userName = req.session.userName;
    
            res.render("reports", {users, books, transactions, filter, moment, tipeUser, userName, alert, title: "Report"});
        }catch(error){
            req.flash("alertMessage", `${error.message}`);
            req.flash("alertStatus", "danger");
            res.redirect("/reports");
        }
    },
    viewGeneral: async(req, res) => {
        try{
            const users = await User.find();
            const books = await Book.find();
            const transactions = await Transaction.find();
            
            const collection = req.query.collection;
            const sort = req.query.sort || 1;
            const search = req.query.search || "";
            let filter = {};

            if(collection === 'users'){
              const field = req.query.field || 'nama';
              filter = await User.find({
                "$or":[
                  {nama:{$regex: new RegExp(search, 'i')}},
                  {telp:{$regex: new RegExp(search, 'i')}},
                  {umur: isNaN(parseInt(search)) ? null : { $eq: parseInt(search) }},
                  {alamat:{$regex: new RegExp(search, 'i')}},
                  {aktifsts:{$regex: new RegExp(search, 'i')}},
                  {jenisusr:{$regex: new RegExp(search, 'i')}},
                  {username:{$regex: new RegExp(search, 'i')}},
                ]
              }).sort({ [field]: sort });

            }else if(collection === 'transactions'){
              const field = req.query.field || 'hrgtotal';
              const dateSearch = new Date(search);
              const startDate = new Date(dateSearch.getFullYear(), dateSearch.getMonth(), dateSearch.getDate());
              const endDate = new Date(dateSearch.getFullYear(), dateSearch.getMonth(), dateSearch.getDate() + 1);
              filter = await Transaction.find({
                "$or": [
                  { idmember: { $in: await User.find({ 'nama': { $regex: new RegExp(search, 'i') } }).distinct('_id') }},
                  { 'details.idbuku': { $in: await Book.find({ 'judul': { $regex: new RegExp(search, 'i') } }).distinct('_id') } },
                  { 'details.jmlbeli': isNaN(parseInt(search)) ? null : { $eq: parseInt(search) } },
                  { hrgtotal: isNaN(parseInt(search)) ? null : { $eq: parseInt(search) } },
                  { pegawaiusn: { $regex: new RegExp(search, 'i') } },
                  { createdAt: isNaN(dateSearch) ? null : { $gte: startDate, $lt: endDate }},
                ]
              }).populate('idmember', 'nama').populate('details.idbuku', 'judul').sort({ [field]: sort });
            }else if(collection === 'books'){
              const field = req.query.field || 'judul';
              filter = await Book.find({
                "$or":[
                  {judul:{$regex: new RegExp(search, 'i')}},
                  {penulis:{$regex: new RegExp(search, 'i')}},
                  {penerbit:{$regex: new RegExp(search, 'i')}},
                  {tahuntbt:isNaN(parseInt(search)) ? null : { $eq: parseInt(search) }},
                  {kategori:{$regex: new RegExp(search, 'i')}},
                  {harga:isNaN(parseInt(search)) ? null : { $eq : parseInt(search) }},
                  {stok:isNaN(parseInt(search)) ? null : { $eq: parseInt(search) }},
                  {jmlbeli:isNaN(parseInt(search)) ? null : { $eq: parseInt(search) }},
                ]
              }).sort({ [field]: sort });
            }
    
            const alertMessage = req.flash("alertMessage");
            const alertStatus = req.flash("alertStatus");
            const alert = {message: alertMessage, status: alertStatus};
    
            const tipeUser = req.session.tipeUser;
            const userName = req.session.userName;
    
            res.render("reports", {users, books, transactions, filter, moment, tipeUser, userName, collection, alert, title: "Report"});
        }catch(error){
            req.flash("alertMessage", `${error.message}`);
            req.flash("alertStatus", "danger");
            res.redirect("/reports");
        }
    },
    viewSpecific: async(req, res) => {
        try{
            const users = await User.find();
            const books = await Book.find();
            const transactions = await Transaction.find();
            
            const collection = req.query.collection || "";
            const field = req.query.field || "";
            const condition = req.query.condition || "$eq";
            const sort = req.query.sort || 1;
            const search = req.query.search || "";
            let filter = {};

            filter = await User.find({
              "$or":[
                {nama:{$regex: new RegExp(search, 'i')}},
                {telp:{$regex: new RegExp(search, 'i')}},
                // {umur:{condition:search}},
                {alamat:{$regex: new RegExp(search, 'i')}},
                {aktifsts:{$regex: new RegExp(search, 'i')}},
                {jenisusr:{$regex: new RegExp(search, 'i')}},
                {username:{$regex: new RegExp(search, 'i')}},
              ]
            }).sort({ field: sort });
    
            const alertMessage = req.flash("alertMessage");
            const alertStatus = req.flash("alertStatus");
            const alert = {message: alertMessage, status: alertStatus};
    
            const tipeUser = req.session.tipeUser;
            const userName = req.session.userName;
    
            res.render("reports", {users, books, transactions, filter, moment, tipeUser, userName, collection, alert, title: "Report"});
        }catch(error){
            req.flash("alertMessage", `${error.message}`);
            req.flash("alertStatus", "danger");
            res.redirect("/reports");
        }
    },
};      