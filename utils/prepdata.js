

'use strict';

const convt = require('./conversion');
const members = require('../models/membersStore.js');
const trainers = require('../models/trainersStore.js');
const logger = require('./logger');

const prepdata = {
  
  getTrainerClients(trainerIn,membersIn){
    
  const clientDetails = [];
  const clientDetail = new Object();
    
  if ((trainerIn === null || trainerIn === 'undefined')) {
     // do nothingclients
    } else if(trainerIn.clients.length == 0) {
      // do nothing
    } else {
    logger.info('trainerIn ', trainerIn.clients);
      for (let i = 0; i < trainerIn.clients.length; i++) {
                  
                   var clientid = trainerIn.clients[i].id;
                   const clientDetail = new Object();
                   logger.info('client id ', clientid);
                   const membr = members.getMemberById(clientid);
        
                   clientDetail.id = membr.id;
                   clientDetail.firstName = membr.firstName;
                   clientDetail.lastName = membr.lastName;
                   clientDetail.age = membr.age;
                   clientDetail.gender = membr.gender;
                   clientDetails.push(clientDetail);
        
        
        
                  //membr = null;
              }
      
      
    
    }
    
  return clientDetails
  },
  
   
   
  setTrainerClients(trainerId){
  const clients = [];
  const all_members = members.getAllMembers();
  const trainr = trainers.getTrainerById(trainerId);

        for (let i = 0; i < all_members.length; i++) {
      
                   var clientid = all_members[i].trainerid;
                   var membrid = all_members[i].id;
                   if(clientid == trainr.id){
                       const clientDetail = new Object();
                       clientDetail.id = membrid;
                       clients.push(clientDetail);
                    }
          }
    return clients;
  
  },
  
  
  isIdealBodyWeight(member){
    var idealBodyWeight = 0;
    var weight = member.startWeight;
    var height = convt.convertMeterstoInches(member.height);
    var fivefeet = 60.00;
    
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
  },
  
  
  
  getTrend(newAssessment){
  
  return true;
  }
  
  
  
  
  
  
  
   
};



module.exports = prepdata;







