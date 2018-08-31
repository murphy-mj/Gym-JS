'use strict';

const _=require('lodash');
const JsonStore = require('./json-store');
const logger = require('../utils/logger');


const trainersStore = {
  store: new JsonStore('./models/trainers.json', {trainersData:[]}),
  collection: 'trainersData',

  // returns the json object which contains all the trainers anf their data
  
  getAllTrainers() {
    return this.store.findAll(this.collection);
  },
  
  
// get a trainer object by id using lodash
  
  getTrainerByIdold(id) {
    //return _.find(this.trainersData, { id: id });
    return this.store.findOneBy(this.collection, { id: id });
  },
  
  
  // get trainer by id, using collection method 
  
   getTrainerById(id) {
    return this.store.findOneBy(this.collection, { id: id });
  },
  
  
  // get trainer by email
  
   getTrainerByEmail(email) {
    return this.store.findOneBy(this.collection, { email: email });
  },
  
  
  // adding new trainer object to the trainers json object
  
   addTrainer(trainer) {
    this.store.add(this.collection,trainer);
       this.store.save();
  },
  
  // saving json object
  
  updateTrainerDetails() {
    this.store.save();
  },
  
  
  
  // remove client id from trainers array of client id's
  // using lodash
  
  removeClient(trainerId, memberId) {
    const trainerDetails = this.getTrainerById(trainerId);
   //remove the client member with id memberId from the trainers client list
    _.remove(trainerDetails.clients, {id:memberId});
    this.store.save();
  },
  
  
  
  // remove client id from trainers array of client id's
  // using javascript
  
  removeClient(trainerId, memberId) {
  const trainer1 = this.getTrainerById(trainerId);
    const assessmentsTemp = trainer1.clients;
    let index =-1;
    // just in case the clients object does not exist
    if(trainer1.clients === null || trainer1.clients === undefined) {
        //do nothing
    } else if(trainer1.clients.length === 0){
          //do nothing
         } else {
              for (let i = 0; i < trainer1.clients.length; i++) {
                  if(trainer1.clients[i].id === memberId) {
                    index = i;
                  }
    
             }
         }
    
    if (index != -1) {
    assessmentsTemp.splice(index, 1);
    trainer1.clients = assessmentsTemp;
    }
    
    this.store.save();

},
  
  
  
  
// adding clientid to trainers client list, clients[]  

  addClient(trainerId, memberId) {
    const trainerDetails = this.getTrainer(trainerId);
    trainerDetails.clients.push(memberId);
    this.store.save();
    
  },
  
fireClient(trainerId, memberId) {
  const trainer1 = this.getTrainerById(trainerId);
    const assessmentsTemp = trainer1.clients;
    let index =-1;
    // just in case the clients object does not exist
    if(trainer1.clients === null || trainer1.clients === undefined) {
        //do nothing
    } else if(trainer1.clients.length === 0){
          //do nothing
         } else {
              for (let i = 0; i < trainer1.clients.length; i++) {
                  if(trainer1.clients[i].id === memberId) {
                    index = i;
                  }
    
             }
         }
    
    if (index != -1) {
    assessmentsTemp.splice(index, 1);
    trainer1.clients = assessmentsTemp;
    }
    
    this.store.save();

}
  
  
  

  
};

module.exports = trainersStore;