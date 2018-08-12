

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

  getTest(){
    return "46";
  },

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
  
  addAssessment(memberId,newAssessment) {
    logger.debug("adding Assess on member id",memberId); 
    const membr = this.getMemberById(memberId);
    const assess = membr.assessments;
    let tempTrend = prepdata2.getTrend(assess,newAssessment);
    newAssessment.trend = tempTrend;
    logger.debug("adding trend on Assessmt", newAssessment.trend);
    membr.assessments.push(newAssessment);
    this.store.save();
  },
  
  
  removeAssessment(id, assessmentId) {
    const member1 = this.getMemberById(id);
    _.remove(member1.assessments, {id:assessmentId});
    this.store.save();
  },
  
  
  //using lodash
  selectAssessment(memberid,assessmentid){
    const membr = this.getMemberById(memberid);
    if(membr.assessments == null || membr.assessments == undefined) {
       //do nothing
    } else if(membr.assessments.length == 0){
       //do nothing
        } else {
            const assess =  _.findBy(membr.assessments, assessmentid);  
            return assess;
        }
  },
  
  
  // using javascript
  selectAssessment2(memberid,assessmentid){
    const membr = this.getMemberById(memberid);
    var assess = {};
    if(membr.assessments == null || membr.assessments == undefined) {
        //do nothing
    } else if(membr.assessments.length == 0){
          //do nothing
         } else {
              for (let i = 0; i < membr.assessments.length; i++) {
                  if(membr.assessments[i].id == assessmentid) {
                   assess = membr.assessments[i];
                  }
    
             }
         }
    return assess;
  },
  
  
  removeTrainer(trainerId, memberId){
  const membr = this.getMemberById(memberId);
  membr.trainerid = "99";
  this.store.save();
  },
  
  
};

module.exports = membersStore;