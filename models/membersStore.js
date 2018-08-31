

'use strict';

const _ = require('lodash');
const JsonStore = require('./json-store');
const logger = require('../utils/logger');
const prepdata2 = require('../utils/prepdata2');

const membersStore = {
  store: new JsonStore('./models/members.json', {membersData:[]}),
  collection: 'membersData',
  
  
  getAllMembers() {
    return this.store.findAll(this.collection);
  },

  //getTest(){
 //   return "46";
 // },

  getMemberById(id) {
    return this.store.findOneBy(this.collection, { id: id });
  },

  
  
  
  getMemberByEmail(email) {
    return this.store.findOneBy(this.collection, { email: email });
  },
  
  addMember(member) {
    this.store.add(this.collection,member);
    this.store.save();
  }, 
  
  
  
  updateMemberDetails() {
    this.store.save();
  },
  
  // when adding an Assessment we need to check the new Assessment against the prior Assessment and against any open goals
  // and to add the new Assessments to the members arrary object of prior Assessments 
  
  addAssessment(memberId,newAssessment) {
    const membr = this.getMemberById(memberId);
    const assess = membr.assessments;
    let memberWeight = parseFloat(membr.startWeight);
    // looks at prior Assessment for weight only
    let tempTrend = prepdata2.getTrend(assess,newAssessment,memberWeight);
    newAssessment.trend = tempTrend;
    // send Assessment to subrutine to determine if any outstanding goals hva beeb achieved
    let achievedGoal = prepdata2.getGoalAchieved(membr,newAssessment);
    logger.debug("adding Assess on member id",memberId); 
    membr.assessments.push(newAssessment);
    this.store.save();
  },
  
  
  
  
  // removing assessment using lodash
  
removeAssessmentold(id, assessmentId) {
   const member1 = this.getMemberById(id);
   _.remove(member1.assessments, {id:assessmentId});
    this.store.save();
  },
  
  
  // removing assessment using Javascript
  
  removeAssessment(id, assessmentId) {
  const member1 = this.getMemberById(id);
    const assessmentsTemp = member1.assessments;
    let index =-1;
    // just in case the assessments object does not exist
    if(member1.assessments === null || member1.assessments === undefined) {
        //do nothing
    } else if(member1.assessments.length === 0){
          //do nothing
         } else {
              for (let i = 0; i < member1.assessments.length; i++) {
                  if(member1.assessments[i].id === assessmentId) {
                    index = i;
                  }
    
             }
         }
    
    if (index != -1) {
    assessmentsTemp.splice(index, 1);
    member1.assessments = assessmentsTemp;
    }
    
    this.store.save();
  },
    
    
    
  //using lodash, replaced with selectAssessment2 below
  
  selectAssessment(memberid,assessmentid){
    const membr = this.getMemberById(memberid);
    if(membr.assessments === null || membr.assessments === undefined) {
       //do nothing
    } else if(membr.assessments.length === 0){
       //do nothing
        } else {
            const assess =  _.findBy(membr.assessments, assessmentid);  
            return assess;
        }
  },
  
  
  

  // using javascript to select assessment
  // returns the selected assessment from the array of assessments of the member
  
  selectAssessment2(memberid,assessmentid){
    const membr = this.getMemberById(memberid);
    var assess = {};
    if(membr.assessments === null || membr.assessments === undefined) {
        //do nothing
    } else if(membr.assessments.length === 0){
          //do nothing
         } else {
              for (let i = 0; i < membr.assessments.length; i++) {
                  if(membr.assessments[i].id === assessmentid) {
                   assess = membr.assessments[i];
                  }
    
             }
         }
    return assess;
  },
  
  
  
  
  // trainerid 99 is the default trainer, ie no trainer
  
  removeTrainer(trainerId, memberId){
  const membr = this.getMemberById(memberId);
  membr.trainerid = "99";
  this.store.save();
  },
  
  
  
  
  // create member object based on memberid, and add newGoal to the goals [] object within the member object
  
  addGoal(memberId,newGoal) {
    const membr = this.getMemberById(memberId);
    membr.goals.push(newGoal);
    this.store.save();
    logger.debug("added Goal to member",membr.goals); 
  },
  
  
  
  
   // create member object based on memberid, and remove a goal with the id contained in goalid, from the goals [] object within the member object
   // using  _.remove wcid is a lodash function
  
   removeGoal(id, goalId) {
    const member1 = this.getMemberById(id);
    _.remove(member1.goals, {id:goalId});
    this.store.save();
  },
  
  
  
  
  // create member object based on memberid, and remove a goal with the id contained in goalid, from the goals [] object within the member object
   // using javascript
  
  removeGoal2(id, goalId) {
    const member1 = this.getMemberById(id);
    const goalTemp = member1.goals;
    let index =-1;
    
    if(member1.goals === null || member1.goals === undefined) {
        //do nothing
    } else if(member1.goals.length === 0){
          //do nothing
         } else {
              for (let i = 0; i < member1.goals.length; i++) {
                  if(member1.goals[i].id === goalId) {
                    index = i;
                  }
    
             }
         }
    
    if (index != -1) {
    goalTemp.splice(index, 1);
    member1.goals = goalTemp;
    }
    
  
    this.store.save();
  },
  
  
  
  
  
  
  // save goal[] within member object
  
  updateGoals() {
   this.store.membersData.goals.save();
  },
  
  
  
  getCurrentWeight(member1){
    let currentWeight = 0.0;
    
    // in oder to pick the weight from the latest assessment stored, the assessment array needs to be sorted
  //  assessments.length-1 will then return the last assessment
   if(member1.assessments.length >1) {
      member1.assessments.sort(function(a,b) {
             let dateA = new Date(a.date), dateB = new Date(b.date);
             return dateA - dateB;
      });
   }
    
   if(member1.assessments.length < 1){
      currentWeight = parseInt(member1.startWeight);
   } else {
     currentWeight = parseInt(member1.assessments[member1.assessments.length-1].weight);
   }
    
  return currentWeight;
  },
  
  
  // remove member from data base
  
  fireClient(id) {
    const member1 = this.getMemberById(id);
    const membersDataTemp = this.store.collection;
    let index =-1;
    // just in case the assessments object does not exist
    if(membersDataTemp === null || membersDataTemp === undefined) {
        //do nothing
    } else if(membersDataTemp.length === 0){
          //do nothing
         } else {
              for (let i = 0; i < membersDataTemp.length; i++) {
                  if(membersDataTemp[i].id === id) {
                    index = i;
                  }
    
             }
         }
    
    if (index != -1) {
    membersDataTemp.splice(index, 1);
    //this.store.collection = membersDataTemp;
    this.store.remove(this.colection, member1) 
    this.store.save();
    }
    
    this.store.save();
  }
  
  
  
  
};





module.exports = membersStore;