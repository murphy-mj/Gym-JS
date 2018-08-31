

'use strict';

const convt = require('./conversion');
const membersStore =  require('../models/membersStore');
const trainers = require('../models/trainersStore');
const logger = require('./logger');

const prepdata = {
  
  // this fuction returns the client details
  // each trainer has a list of client id's, these are members that have selected the trainer to be their trainer
  // members can select and change trainers, trainers can only remove them from thier list
  
  getTrainerClients(trainerIn,membersIn){
  const clientDetails = [];
    
  if ((trainerIn === null || trainerIn === undefined)) {
     // do nothingclients
    } else if(trainerIn.clients.length === 0) {
      // do nothing
    } else {
    logger.info('trainerIn ', trainerIn.clients);
      // loop through the array of member id's that are contained in the client [] of the trainer
      for (let i = 0; i < trainerIn.clients.length; i++) {
                  
                   let clientid = trainerIn.clients[i].id;
                   // clientDetail is an object that will hold deatlds about an individual client
                   // a new one is created during each loop
                   const clientDetail = new Object();
                   let membrz = membersStore.getMemberById(clientid);
                  // creates properties and sets value, for each new object created
                   clientDetail.id = membrz.id;
                   clientDetail.firstName = membrz.firstName;
                   clientDetail.lastName = membrz.lastName;
                   clientDetail.age = membrz.age;
                   clientDetail.gender = membrz.gender;
                   // new object added to the array clientDetails
                   clientDetails.push(clientDetail);
        }
    }
    
  return clientDetails
  },
  
  
  
  // this is designed to populate each trainers list of client id. 
  // it iterates each member object and locates that members selected trainer
  // and if that trainer id matches the current trainer, that called this function
  // then that members id is added to clients[] and retured to trainer.
  
  setTrainerClients(trainerId,all_members){
  let clients = [];
  const trainr = trainers.getTrainerById(trainerId);

        for (let i = 0; i < all_members.length; i++) {
      
                   let clientid = all_members[i].trainerid;
                   let membrid = all_members[i].id;
                   if(clientid == trainr.id){
                       const clientDetail = new Object();
                       clientDetail.id = membrid;
                       clients.push(clientDetail);
                    }
          }
    return clients;
  
  },
  
  
  isIdealBodyWeight(member){
    let idealBodyWeight = 0;
    let weight = parseFloat(member.startWeight);
    let height = convt.convertMeterstoInches(parseFloat(member.height));
    let fivefeet = 60.00;
    
    if(height <= fivefeet){
       if(member.gender == "M") {
         idealBodyWeight = 50;
       } else {
         idealBodyWeight = 50;
       }
    } else {
      if(member.gender == "M") {
         idealBodyWeight = 50 + ((height - fivefeet) * 2.3);
      } else{
          idealBodyWeight = 45.5 + ((height - fivefeet) * 2.3);
      }
      
      }
    
    return ((idealBodyWeight <= (weight +2.0)) && (idealBodyWeight >= (weight -2.0)));
  }
  
  

  
   
};



module.exports = prepdata;







