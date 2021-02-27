const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
//const { response } = require('express');
//const { response} = require('express')

dotenv.config();
const db = require('./db_service');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended : false}));

db.connect()
//
app.get('/api/flights', (req,res) => {
    db.query("select * from nearest_leg_instances WHERE Fare_code = 'Y' ; select * from airport;", [1,2],(err,rows) => {
        if(!err){
            //console.log(rows[0]);
            console.log(rows[1]);
            res.status(200).json({
                data:rows
            })
        }
        else{
            console.log("cant connected" + err)
        }
    })
})
app.get('/api/reservation/:flight/:leg/:date', (req,res) => {
    console.log(req.params.date)
    var date = new Date(req.params.date)//.toISOString().split('T')[0].replace(/[/]/g,"-");
    date.setDate(date.getDate() + 1)
    var newDate = new Date(date).toISOString().split('T')[0].replace(/[/]/g,"-");
    db.query(`select * from nearest_leg_instances WHERE Flight_number = "${req.params.flight.toString()}" AND Leg_number = ${req.params.leg} AND Flight_date = '${newDate}'`,(err,rows) => {
        if(err){
            console.log(err);
        }else{
            console.log(rows);
            res.status(200).json({
                data:rows
            })
        }
    })
})

app.post('/api/reservation/:flight/:leg/:date/:customer', (req,res) => {
    console.log(req.params.date)
   /* var date = new Date(req.params.date)//.toISOString().split('T')[0].replace(/[/]/g,"-");
    date.setDate(date.getDate() + 1)
    var newDate = new Date(date).toISOString().split('T')[0].replace(/[/]/g,"-");*/
    var seat =Math.floor( Math.random() * 50) + 'A';
    console.log(seat);

    db.query(`insert into seat_reservation (Flight_number, Leg_number,Flight_date,Seat_number,Passport_number) values ("${req.params.flight.toString()}",${req.params.leg} ,'${req.params.date}' , '${seat}' , '${req.params.customer}'); `,(err,rows) => {
        if(err){
            console.log(err);
        }else{
            console.log(rows);
            res.status(200).json({
                data:rows
            })
        }
    })
})

app.post('/api/checkin/:flight/:leg/:date/:seat/:customer', (req,res) => {
    console.log(req.params.date)
   /* var date = new Date(req.params.date)//.toISOString().split('T')[0].replace(/[/]/g,"-");
    date.setDate(date.getDate() + 1)
    var newDate = new Date(date).toISOString().split('T')[0].replace(/[/]/g,"-");*/

    db.query(`insert into checked_in (Flight_number, Leg_number,Flight_date,Seat_number,Passport_number) values ("${req.params.flight.toString()}",${req.params.leg} ,'${req.params.date}' , '${req.params.seat}' , '${req.params.customer}'); `,(err,rows) => {
        if(err){
            console.log(err);
        }else{
            console.log(rows);
            res.status(200).json({
                data:rows
            })
        }
    })
})


app.get('/api/reservation/:customer', (req,res) => {
    console.log(req.params.customer)
    db.query(`select * from seat_reservation WHERE Passport_number = '${req.params.customer}'`,(err,rows) => {
        if(err){
            console.log(err);
        }else{
            console.log(rows);
            res.status(200).json({
                data:rows
            })
        }
    })
})


app.get('/api/customer-segmentation/:customer', (req,res) => {
    console.log(req.params.customer)
    db.query(`select * from ffc WHERE Passport_number = '${req.params.customer}'`,(err,rows) => {
        if(err){
            console.log(err);
        }else{
            console.log(rows);
            res.status(200).json({
                data:rows
            })
        }
    })
})

app.get('/api/customer-segmentation', (req,res) => {
    console.log(req.params.customer)
    db.query(`select * from customer_seg `,(err,rows) => {
        if(err){
            console.log(err);
        }else{
            console.log(rows);
            res.status(200).json({
                data:rows
            })
        }
    })
})

app.get('/api/airports', (req,res) => {
    console.log(req.params.customer)
    db.query(`select * from airport`,(err,rows) => {
        if(err){
            console.log(err);
        }else{
            console.log(rows);
            res.status(200).json({
                data:rows
            })
        }
    })
})






app.listen(process.env.PORT , () => console.log('app is running'));