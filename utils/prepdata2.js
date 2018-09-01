

'use strict';

const convt = require('./conversion');
const membersStore =  require('../models/membersStore');
const trainers = require('../models/trainersStore');
const logger = require('./logger');

const prepdata2 = {
  

  
  
  
  
  
  // trend only looks at weight.
  // it compares the new Assessment' weight to the last Assessment stored in the assessments []
  // assessments [] is sorted before this is done
  
  getTrend(assessments,newAssessment,memberWeight){
   let trend = true;
   // in oder to pick the latest assessment stored, the assessment array needs to be sorted
  //  assessments.length-1 will then return the last assessment
   if(assessments.length >1) {
      assessments.sort(function(a,b) {
             let dateA = new Date(a.date), dateB = new Date(b.date);
             return dateA - dateB;
      });
   }
    
   if(assessments.length < 1){
     // no previous assessments stored, so this is first assessments, so need to compare to startWeight at registration
     if(parseFloat(memberWeight) >= parseFloat(newAssessment.weight)) {
      trend = true;
     } else {
       trend = false;
     }
    
   } else if(parseFloat(assessments[assessments.length-1].weight) >= parseFloat(newAssessment.weight)) {
      trend = true;
      // if the last assesssments weight is greater then current assessmnt weight, then trend is positive
      
   } else if(parseFloat(assessments[assessments.length-1].weight) < parseFloat(newAssessment.weight))  {
     trend = false;
   }
    
  return trend;
  },
  
  
  
  
  //Tests to see if new Assessment, results in any goals being achieved
  // method recieves the Member Object and the new Assessment
  // Test only looks for an exact mactch, rather than an exceeds, as memebers could want to gain weight or size
  
   getGoalAchieved(membr,newAssessment){
     
// need to iterate throgh the open goals, find goalcategory and goal
// then compare with latest assessment
    logger.info('Check to see any goals have be accomplished',);
    let attained = false;
    const membrGoals = membr.goals;
    let goalCategory = ""
    let goalValue = 0.00;
    let d0 = new Date(newAssessment.date);
    let d1 = d0.valueOf(); 
    logger.info('assessment date is ',d0);
     
    // d1 represents the number of seconds since a particular date, 1970
    // this allows for comparison of date objects
    
     // goals are held in a goals array, some will be open others closed.
     // need to iterate through them to find the status of gaols which are open or not achieved yet
        for (let i = 0; i < membrGoals.length; i++) {
          
            if(membrGoals[i].status === "open" || membrGoals[i].status === "not achieved yet, but within timeframe" ) {
               logger.info('goal status is ',membrGoals[i].status);
               goalCategory = membrGoals[i].goalcategory;
               goalValue = parseFloat(membrGoals[i].goal);
             // once we find a goal that is open or not achieved yet   
             // we extract the goal category and the value of the goal
             // the new Assessment the we received has many properties, so we need to loop through each
            // to see if a match with the goal category
               for(let propt in newAssessment){

                   if (propt === goalCategory) {
                     logger.info('Assessment property match found',goalCategory);
                     let d22 = new Date(membrGoals[i].Gdate);
                     let d2 = d22.valueOf();
                     // goal date, which is the target date, is converted to number to allow comparison with Assessment date 
                     
                     if ((parseFloat(newAssessment[propt]) === goalValue) && (d1 <= d2)) {
                        
                          membrGoals[i].status = "achieved within time frame";
                          logger.info('goal status ',membrGoals[i].status);
                          membrGoals[i].achieveddate = newAssessment.date;
                          attained = true;
                         
                       } else if ((parseFloat(newAssessment[propt]) === goalValue) && (d1 > d2)) {
                         
                          membrGoals[i].status = "achieved outside time frame";
                          logger.info('goal status ',membrGoals[i].status);
                          membrGoals[i].achieveddate = newAssessment.date;
                          attained = true;
                    
                      }else if ((parseFloat(newAssessment[propt]) !== goalValue) && (d1 < d2)) {
                        
                          membrGoals[i].status = "not achieved yet, but within timeframe";
                           logger.info('goal status not ach date ',d2);
                       } else {
                         logger.info('else d1',d1);
                         logger.info('else d2',d2);
                         membrGoals[i].status = "missed target";
                       }

                   } 
                }
              
              }
         }
    return attained
  },
  
  
  
  
   
};



module.exports = prepdata2;






