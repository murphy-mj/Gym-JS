

'use strict';

const convt = require('./conversion');
const membersStore =  require('../models/membersStore');
const trainers = require('../models/trainersStore');
const logger = require('./logger');

const prepdata = {
  
  getTrainerClients(trainerIn,membersIn){
    
  const clientDetails = [];
    
  if ((trainerIn === null || trainerIn === 'undefined')) {
     // do nothingclients
    } else if(trainerIn.clients.length === 0) {
      // do nothing
    } else {
    logger.info('trainerIn ', trainerIn.clients);
      for (let i = 0; i < trainerIn.clients.length; i++) {
                  
                   let clientid = trainerIn.clients[i].id;
                   const clientDetail = new Object();
                   logger.info('client id ', clientid);
                   logger.info('get test ', trainers.getTestT());
                   logger.info('get test ', membersStore.getTest());
        
                   let membrz = membersStore.getMemberById(clientid);
        
                   clientDetail.id = membrz.id;
                   clientDetail.firstName = membrz.firstName;
                   clientDetail.lastName = membrz.lastName;
                   clientDetail.age = membrz.age;
                   clientDetail.gender = membrz.gender;
                   clientDetails.push(clientDetail);
        }
    }
    
  return clientDetails
  },
  
   
   
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
    let weight = member.startWeight;
    let height = convt.convertMeterstoInches(member.height);
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
  },
  
  getTrend(assessments,newAssessment){
   let trend = true;
   logger.info('get trend ',trend);
   if(assessments.length >1) {
      assessments.sort(function(a,b) {
             let dateA = new Date(a.date), dateB = new Date(b.date);
             return dateA - dateB;
      });
   }
   if(assessments.length <= 1){
     // do nothing
   } else if(assessments[assessments.length-1].weight >= newAssessment.weight) {
      trend = true;
   } else if(assessments[assessments.length-1].weight < newAssessment.weight)  {
     trend = false;
   }
    
  return trend;
  },
  
   getGoalAchieved(membr,newAssessment){
// need to iterate throgh the open goals, find goalcategory and goal
// then compare with latest assessment
    let attained = false;
    const membrGoals = membr.goals;
    let goalCategory = ""
    let goalValue = 0.00;
     logger.info('goals[] are ',membrGoals);
        for (let i = 0; i < membrGoals.length; i++) {
          logger.info('goal status is ',membrGoals[i].status);
          
          
            if(membrGoals[i].status === "open" || membrGoals[i].status === "missed" ) {
               goalCategory = membrGoals[i].goalcategory;
               goalValue = membrGoals[i].goal;
               logger.info('goal is ',goalValue);
              
               for(let propt in newAssessment){
                 
                 logger.info('new assess property outside ',propt);
                 logger.info('new assess property outside [propt] ',newAssessment[propt] );
                  logger.info('new assess property outside [propt] ',goalCategory);
                   if (propt === goalCategory) {
                     logger.info('in in property propt ',propt);
                     logger.info('in in property goal cat ',goalCategory);
                     
                       if (newAssessment[propt] == goalValue) {
                         logger.info('new assess property ',newAssessment[propt]);
                         
                          membrGoals[i].status = "achieved";
                          logger.info('goal status ',membrGoals[i].status);
                          membrGoals[i].achieveddate = newAssessment.date;
                          attained = true;
                       } else {
                          membrGoals[i].status = "missed";
                       }
                   }
                }
              
              }
         }
    return attained
  }
  
  
  
  
  
  
   
};



module.exports = prepdata;






