

'use strict';

const convt = require('./conversion');
const members = require('../models/membersStore.js');
const logger = require('../utils/logger');


const analytics = {

  
   getBMI(assessments,height) {
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
    let weight = 0;
    if(member.assessments.length == 0) {
    weight = member.startweight;
    } else {
    weight =  member.assessments[member.assessments.length -1].weight;
    }
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
  
  
  getInitialBMI(member) {
    let bmiAss = 0.000;
    let weight2 = member.startWeight;
    let bmih = (member.height * member.height);
    bmiAss = (weight2 / bmih);
    return (Math.round(bmiAss*100)/100);
  }
  

   
};



module.exports = analytics;







