'use strict';

const _=require('lodash');
const JsonStore = require('./json-store');
const logger = require('../utils/logger');


const trainersStore = {
  store: new JsonStore('./models/trainers.json', {trainersData:[]}),
  collection: 'trainersData',

  getAllTrainers() {
    return this.store.findAll(this.collection);
  },


  getTrainerById(id) {
    //return _.find(this.trainersData, { id: id });
    return this.store.findOneBy(this.collection, { id: id });
  },
  
   getTrainerByEmail(email) {
    return this.store.findOneBy(this.collection, { email: email });
  },
  
   addTrainer(trainer) {
    this.store.add(this.collection,trainer);
       this.store.save();
  },
  
  updateTrainerDetails() {
    this.store.save();
  },
  
  
  removeClient(trainerId, memberId) {
    const trainerDetails = this.getTrainerById(trainerId);
   //remove the client member with id memberId from the trainers client list
    _.remove(trainerDetails.clients, {id:memberId});
    this.store.save();
  },
  
  addClient(trainerId, memberId) {
    const trainerDetails = this.getTrainer(trainerId);
    trainerDetails.clients.push(memberId);
    this.store.save();
    
  },
  
  getTestT(){
  return "46";
  },
  
};

module.exports = trainersStore;