

'use strict';

const convt = require('./conversion');
const members = require('../models/membersStore.js');
const logger = require('../utils/logger');


const analytics = {

  
   getBMI(assessments,height) {
    logger.info('get test ', members.getTest());
    let bmiAss = 0.000;
    if ((assessments === null || assessments === 'undefined')) {
     bmiAss = 0.000;
    } else if(assessments.length === 0) {
              bmiAss = 0.000;
      } else {
            if(height <= 0){
               bmiAss = 0.000
            }else {
              let weight2 = (assessments[assessments.length -1].weight);
              let bmih = (height * height);
              bmiAss = (weight2 / bmih);
              logger.debug('bmi weight = ',weight2);
              logger.debug('Trainer id height sq = ',(height * height));
              logger.debug('Trainer id bmie = ',bmiAss);
              logger.debug('Trainer id bmi round = ',Math.round(bmiAss*100));
            }
        
              }
     
     
     return (Math.round(bmiAss*100)/100);
  },
  
  getBMICategory(bmi){
    var bmicat = "";
    if(bmi < 15){
       bmicat = "Very Severly Underweight"
    } else if(bmi < 16){
              bmicat = "Severly Underweight"
      }  else if(bmi < 18.50){
                 bmicat = "Underweight"
         }  else if(bmi < 25){
                    bmicat = "Normal"
            }  else if(bmi < 30){
                       bmicat = "Overweight"
               }  else if(bmi < 35){
                          bmicat = "Moderately Obese"
                   }  else if(bmi < 40){
                              bmicat = "Severly Obese"
                      }  else if(bmi < 1000){
                          bmicat = "Very Severly Obese"
                          } 
    return bmicat;
  },
  
  
  isIdealBodyWeight(member){
    let idealBodyWeight = 0;
    let weight = member.startweight;
    let height = convt.convertMeterstoInches(member.height);
    let fivefeet = 60.00;
    
    if(height <= fivefeet){
       if(member.gender === "M") {
         idealBodyWeight = 50;
       } else {
         idealBodyWeight = 50;
       }
    } else {
      if(member.gender === "M") {
         idealBodyWeight = 50 + ((height - fivefeet) * 2.3);
      } else{
          idealBodyWeight = 45.5 + ((height - fivefeet) * 2.3);
      }
      
      }
    logger.debug('ideal body weight = ',idealBodyWeight);
    logger.debug('weight = ',(weight));
    return ((idealBodyWeight <= (weight +2.0)) && (idealBodyWeight >= (weight -2.0)));
  },
  
  getGoalAchieved(membrId,newAssessment){
// need to iterate throgh the open goals, find gaolcategory ang goal
// then compare with latest assessment
    let attained = false;
    const membrGoals = members.getMemberById(membrId).goals;
    let goalCategory = ""
    let goalValue = 0.00;
        for (let i = 0; i < membrGoals.length; i++) {
            if(membrGoals[i].status !== "open" ) {
               goalCategory = membrGoals[i].goalcategory;
               goalValue = membrGoals[i].goal;
               for(var propt in newAssessment){
                   if ( propt === goalCategory ) {
                       if ( newAssessment[propt] === goalValue) {
                          membrGoals[i].status = "achieved";
                          membrGoals[i].achieveddate = newAssessment.date;
                          attained = true;
                       } else {
                          membrGoals[i].status = "missed";
                       }
                   }
                }
              
              }
    
         }
    members.updateGoals()
    return attained
  }
  
  
  
  
  
  
   
};



module.exports = analytics;







