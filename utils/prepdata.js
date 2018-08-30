

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
  }
  
  
  
  //assessments is the list of existing Assessments,
  // newAssessment is the new one we are about to add
  // the existing assessments[] is sorted by date (function based on w3 schools example)
  // one it is sorted the new Assessments weight is compared to the last Assessment in the assessments array
  
//  getTrend(assessments,newAssessment){
//   let trend = true;
//   logger.info('get trend ',trend);
//   if(assessments.length >1) {
//      assessments.sort(function(a,b) {
//             let dateA = new Date(a.date), dateB = new Date(b.date);
 //            return dateA - dateB;
//      });
//   }
//   if(assessments.length <= 1){
 //    // do nothing
 //  } else if(assessments[assessments.length-1].weight >= newAssessment.weight) {
//      trend = true;
 //  } else if(assessments[assessments.length-1].weight < newAssessment.weight)  {
 //    trend = false;
//   }
    
//  return trend;
//  },
  
  
  
  //when each assessment is created and being added to the assessments array.
  // the members goals are checked to see if there are are open or missed goals
  // any open/missed goals and categories are compared against each assessment field name and value
  // and if current value equals goal then it is achieved, and achieved date recorded.
  // only modelled for exact match, not exceeding target
  
//  getGoalAchieved(membrId,newAssessment){
// need to iterate through the open/missed goals, find goalcategory and goal
// then compare with latest assessment
 //   let attained = false;
//    const membrGoals = membersStore.getMemberById(membrId).goals;
//    let goalCategory = ""
//    let goalValue = 0.00;
//        for (let i = 0; i < membrGoals.length; i++) {
//            if(membrGoals[i].status !== "open" ) {
  //             goalCategory = membrGoals[i].goalcategory;
 //              goalValue = membrGoals[i].goal;
  //             for(var propt in newAssessment){
  //                 if ( propt === goalCategory ) {
  //                     if ( newAssessment[propt] === goalValue) {
  //                        membrGoals[i].status = "achieved";
  //                        membrGoals[i].achieveddate = newAssessment.date;
 //                         attained = true;
  //                     } else {
  //                        membrGoals[i].status = "missed";
  //                     }
   //                }
    //            }
              
    //          }
  // / 
   //      }
//    membersStore.updateGoals()
//    return attained
//  }
  

  
   
};



module.exports = prepdata;







