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
            const limit = req.query.limit || null;

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
              }).sort({ [field]: sort }).limit(limit);

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
                  { createdAt: isNaN(dateSearch) ? null : { $gte: startDate, $lte: endDate }},
                ]
              }).populate('idmember', 'nama').populate('details.idbuku', 'judul').sort({ [field]: sort }).limit(limit);
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
              }).sort({ [field]: sort }).limit(limit);
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
            const sort = req.query.sort || 1;
            const limit = req.query.limit || null;
            let filter = {};
            
            if(collection === 'users'){
              const field = req.query.field;
              if(field === 'umur'){
                const umur1 = req.query.umur1;
                const condition1 = req.query.condition1;
                const umur2 = req.query.umur2 || null;
                const condition2 = req.query.condition2 || null;
  
                if( condition2 && condition1 === '$eq'){
                  req.flash("alertMessage", "Jika kondisi 1 -> (sama dengan) maka tidak dapat mengisi kondisi ke 2");
                  req.flash("alertStatus", "danger");
                  return res.redirect("/reports");
                }
  
                if(umur2 && condition2){
                  filter = await User.find({
                    umur: {[condition1]: umur1, [condition2]: umur2},
                  }).sort({ umur: sort }).limit(limit);
                }else{
                  filter = await User.find({
                    umur: {[condition1]: umur1},
                  }).sort({ umur: sort }).limit(limit);
                }
              }else if(field === 'jenisusr'){
                const userkategori = req.query.userkategori;
                const aktifsts = req.query.aktifsts || "";
                const search = req.query.search;
                const selectedCategories = Array.isArray(userkategori) ? userkategori : [userkategori];
                console.log(aktifsts);

                filter = await User.find({
                  $and: [
                    {
                      "$or": [
                        { nama: { $regex: new RegExp(search, 'i') } },
                        { telp: { $regex: new RegExp(search, 'i') } },
                        { umur: isNaN(parseInt(search)) ? null : { $eq: parseInt(search) }},
                        { alamat: { $regex: new RegExp(search, 'i') } },
                        { username: { $regex: new RegExp(search, 'i') } },
                      ]
                    },
                    { jenisusr: { $in: selectedCategories } },
                    { aktifsts: { $regex: new RegExp(aktifsts, 'i') }}
                  ]
                }).sort({ [field]: sort }).limit(limit);
              }
            }else if(collection === 'transactions'){
              const field = req.query.field;
              if(field === 'createdAt'){
                const tgl1 = req.query.tgl1;
                const conditiontgl1 = req.query.conditiontgl1;
                const tgl2 = req.query.tgl2 || null;
                const conditiontgl2 = req.query.conditiontgl2 || null;
                const bukuid = req.query.bukuid || "";
                const date1 = new Date(tgl1);
                const date2 = new Date(tgl2);
                const startDate1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
                const endDate1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate() + 1);
                const endDate2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate() + 1);

                if(conditiontgl2 && conditiontgl1 === '$eq'){
                  req.flash("alertMessage", "Jika kondisi 1 -> (sama dengan) maka tidak dapat mengisi kondisi ke 2");
                  req.flash("alertStatus", "danger");
                  return res.redirect("/reports");
                }

                if(tgl2 && conditiontgl2){
                  if(bukuid){
                    filter = await Transaction.find({
                      createdAt: {[conditiontgl1]: startDate1, [conditiontgl2]: endDate2},
                      'details.idbuku': { $in: await Book.find({ _id: bukuid }).distinct('_id') }
                    }).populate('details.idbuku', '_id').sort({createdAt: sort}).limit(limit);
                  }else{
                    filter = await Transaction.find({
                      createdAt: {[conditiontgl1]: startDate1, [conditiontgl2]: endDate2},
                    }).sort({createdAt: sort}).limit(limit);
                  }
                }else{
                  if(bukuid){
                    if(conditiontgl1 === '$eq'){
                      filter = await Transaction.find({
                        createdAt: {$gte: startDate1, $lte: endDate1},
                        'details.idbuku': { $in: await Book.find({ _id: bukuid }).distinct('_id') }
                      }).populate('details.idbuku', '_id').sort({createdAt: sort}).limit(limit);
                    }else{
                      filter = await Transaction.find({
                        createdAt: {[conditiontgl1]: startDate1},
                        'details.idbuku': { $in: await Book.find({ _id: bukuid }).distinct('_id') }
                      }).populate('details.idbuku', '_id').sort({createdAt: sort}).limit(limit);
                    }
                  }else{
                    if(conditiontgl1 === '$eq'){
                      filter = await Transaction.find({
                        createdAt: {$gte: startDate1, $lte: endDate1},
                      }).sort({createdAt: sort}).limit(limit);
                    }else{
                      filter = await Transaction.find({
                        createdAt: {[conditiontgl1]: startDate1},
                      }).sort({createdAt: sort}).limit(limit);
                    }
                  }
                }
              }else if(field === 'hrgtotal'){
                const total1 = req.query.total1;
                const conditiontotal1 = req.query.conditiontotal1;
                const total2 = req.query.total2 || null;
                const conditiontotal2 = req.query.conditiontotal2 || null;

                if(conditiontotal2 && conditiontotal1 === '$eq'){
                  req.flash("alertMessage", "Jika kondisi 1 -> (sama dengan) maka tidak dapat mengisi kondisi ke 2");
                  req.flash("alertStatus", "danger");
                  return res.redirect("/reports");
                }

                if(total2 && conditiontotal2){
                  filter = await Transaction.find({
                    hrgtotal: {[conditiontotal1]: total1, [conditiontotal2]: total2},
                  }).sort({ hrgtotal: sort }).limit(limit);
                }else{
                  filter = await Transaction.find({
                    hrgtotal: {[conditiontotal1]: total1},
                  }).sort({ hrgtotal: sort }).limit(limit);
                }
              }
              
            }else if(collection === 'books'){
              const field = req.query.field;
              if(field === 'tahuntbt'){
                const tbt1 = req.query.tbt1;
                const conditiontbt1 = req.query.conditiontbt1;
                const tbt2 = req.query.tbt2 || null;
                const conditiontbt2 = req.query.conditiontbt2 || null;

                if(conditiontbt2 && conditiontbt1 === '$eq'){
                  req.flash("alertMessage", "Jika kondisi 1 -> (sama dengan) maka tidak dapat mengisi kondisi ke 2");
                  req.flash("alertStatus", "danger");
                  return res.redirect("/reports");
                }

                if(tbt2 && conditiontbt2){
                  filter = await Book.find({
                    tahuntbt: {[conditiontbt1]: tbt1, [conditiontbt2]: tbt2},
                  }).sort({ tahuntbt: sort }).limit(limit);
                }else{
                  filter = await Book.find({
                    tahuntbt: {[conditiontbt1]: tbt1},
                  }).sort({ tahuntbt: sort }).limit(limit);
                }
              }else if(field === 'harga'){
                const hrgbuku1 = req.query.hrgbuku1;
                const conditionbuku1 = req.query.conditionbuku1;
                const hrgbuku2 = req.query.hrgbuku2 || null;
                const conditionbuku2 = req.query.conditionbuku2 || null;

                if(conditionbuku2 && conditionbuku1 === '$eq'){
                  req.flash("alertMessage", "Jika kondisi 1 -> (sama dengan) maka tidak dapat mengisi kondisi ke 2");
                  req.flash("alertStatus", "danger");
                  return res.redirect("/reports");
                }
                if(hrgbuku2 && conditionbuku2){
                  filter = await Book.find({
                    harga: {[conditionbuku1]: hrgbuku1, [conditionbuku2]: hrgbuku2},
                  }).sort({ harga: sort }).limit(limit);
                }else{
                  filter = await Book.find({
                    harga: {[conditionbuku1]: hrgbuku1},
                  }).sort({ harga: sort }).limit(limit);
                }
              }else if(field === 'stok'){
                const stok1 = req.query.stok1;
                const conditionstok1 = req.query.conditionstok1;
                const stok2 = req.query.stok2 || null;
                const conditionstok2 = req.query.conditionstok2 || null;

                if(conditionstok2 && conditionstok1 === '$eq'){
                  req.flash("alertMessage", "Jika kondisi 1 -> (sama dengan) maka tidak dapat mengisi kondisi ke 2");
                  req.flash("alertStatus", "danger");
                  return res.redirect("/reports");
                }
                if(stok2 && conditionstok2){
                  filter = await Book.find({
                    stok: {[conditionstok1]: stok1, [conditionstok2]: stok2},
                  }).sort({ stok: sort }).limit(limit);
                }else{
                  filter = await Book.find({
                    stok: {[conditionstok1]: stok1},
                  }).sort({ stok: sort }).limit(limit);
                }
              }else if(field === 'jmlbeli'){
                const beli1 = req.query.beli1;
                const conditionbeli1 = req.query.conditionbeli1;
                const beli2 = req.query.beli2 || null;
                const conditionbeli2 = req.query.conditionbeli2 || null;

                if(conditionbeli2 && conditionbeli1 === '$eq'){
                  req.flash("alertMessage", "Jika kondisi 1 -> (sama dengan) maka tidak dapat mengisi kondisi ke 2");
                  req.flash("alertStatus", "danger");
                  return res.redirect("/reports");
                }
                if(beli2 && conditionbeli2){
                  filter = await Book.find({
                    jmlbeli: {[conditionbeli1]: beli1, [conditionbeli2]: beli2},
                  }).sort({ jmlbeli: sort }).limit(limit);
                }else{
                  filter = await Book.find({
                    jmlbeli: {[conditionbeli1]: beli1},
                  }).sort({ jmlbeli: sort }).limit(limit);
                }
              }else if(field === 'kategori'){
                const bukukategori = req.query.bukukategori;
                const search = req.query.search;
                const selectedCategories = Array.isArray(bukukategori) ? bukukategori : [bukukategori];

                filter = await Book.find({
                  $and: [
                    {
                      "$or": [
                        { judul: { $regex: new RegExp(search, 'i') } },
                        { penulis: { $regex: new RegExp(search, 'i') } },
                        { penerbit: { $regex: new RegExp(search, 'i') } },
                        { tahuntbt: isNaN(parseInt(search)) ? null : { $eq: parseInt(search) } },
                        { harga: isNaN(parseInt(search)) ? null : { $eq: parseInt(search) } },
                        { stok: isNaN(parseInt(search)) ? null : { $eq: parseInt(search) } },
                        { jmlbeli: isNaN(parseInt(search)) ? null : { $eq: parseInt(search) } }
                      ]
                    },
                    { kategori: { $in: selectedCategories } }
                  ]
                }).sort({ [field]: sort }).limit(limit);
              }
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
};      