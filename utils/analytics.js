

'use strict';

const convt = require('./conversion');
const members = require('../models/membersStore.js');



const analytics = {

  
   getBMI(assessments) {
    var bmiAss = 0;
    if ((assessments === null || assessments === 'undefined')) {
     bmiAss = 1;
    } else if(assessments.length == 0) {
              bmiAss = 0;
      } else {
              for (let i = 0; i < assessments.length; i++) {
                   bmiAss = bmiAss + assessments[i].weight;
              }
           }
     return bmiAss;
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
  
  
   
};



module.exports = analytics;







