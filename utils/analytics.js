

'use strict';

const convt = require('./conversion');
const members = require('../models/membersStore.js');
const logger = require('../utils/logger');


const analytics = {

  
   getBMI(assessments,Mheight) {
    let bmiAss = parseFloat(0.000);
    let height = parseFloat(Mheight)
     logger.debug('height in getbmi = ',height);
    if ((assessments === null || assessments === 'undefined')) {
     bmiAss = 0.000;
      // avoiding the situation where we are finding length on undefined
    } else if(assessments.length === 0) {
              bmiAss = 0.000;
      } else {
            if(height <= 0){
               bmiAss = 0.000
            }else {
              let weight2 = parseFloat(assessments[assessments.length -1].weight);
              let bmih = parseFloat(height * height);
              bmiAss = parseFloat(weight2 / bmih);
              logger.debug('bmi weight = ',weight2);
              logger.debug('height sq = ',parseFloat(height * height));
              logger.debug('bmi = ',bmiAss);
              logger.debug('id bmi round = ',bmiAss.toFixed(2));
            }
        
              }
     
     
     return bmiAss.toFixed(2);
  },
  
  getBMICategory(bmi){
    logger.debug('bmic ',parseFloat(bmi));
    let bmic = parseFloat(bmi);
    var bmicat = "";
    if(bmic < 15){
       bmicat = "Very Severly Underweight"
    } else if(bmic < 16){
              bmicat = "Severly Underweight"
      }  else if(bmic < 18.50){
                 bmicat = "Underweight"
         }  else if(bmic < 25){
                    bmicat = "Normal"
            }  else if(bmic < 30){
                       bmicat = "Overweight"
               }  else if(bmic < 35){
                          bmicat = "Moderately Obese"
                   }  else if(bmic < 40){
                              bmicat = "Severly Obese"
                      }  else if(bmic < 1000){
                          bmicat = "Very Severly Obese"
                          } 
    return bmicat;
  },
  
  
  isIdealBodyWeight(member){
    let idealBodyWeight = 0;
    let weight = 0;
    if(member.assessments.length == 0) {
    weight = parseFloat(member.startWeight);
    } else {
    weight =  parseFloat(member.assessments[member.assessments.length -1].weight);
    }
    let height = convt.convertMeterstoInches(parseFloat(member.height));
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
    logger.debug('weight = ',(weight + 2.0));
    logger.debug('is Ideal = ',(idealBodyWeight <= (weight +2.0)) && (idealBodyWeight >= (weight -2.0)))
    return ((idealBodyWeight <= (weight +2.0)) && (idealBodyWeight >= (weight -2.0)));
  },
  
  
  getInitialBMI(member) {
    let bmiAss = 0.000;
    let weight2 = parseFloat(member.startWeight);
    let bmih = (parseFloat(member.height) * parseFloat(member.height));
    bmiAss = parseFloat(weight2 / bmih);
    logger.debug('initial bmi weight2 = ',weight2);
    logger.debug('initial bmih = ',bmih);
    return bmiAss.toFixed(2);
  }
  

   
};



module.exports = analytics;







