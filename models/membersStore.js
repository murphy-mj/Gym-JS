

'use strict';

const _ = require('lodash');
const JsonStore = require('./json-store');
const logger = require('../utils/logger');


const membersStore = {

  store: new JsonStore('./models/members.json', {membersData:[]}),
  collection: 'membersData',
  
  
  getAllMembers() {
    return this.store.findAll(this.collection);
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
      
    const member = this.getMemberById(memberId);
    //const subAssess = member.assessments;
      logger.debug("adding Assess on memberinitial ");
    //logger.debug("adding Assess on member",member.assessments);
      
    member.assessments.push(newAssessment);
      logger.debug("adding Assess on memberpost new ");
    // logger.debug("adding Assess on member",this.store.member.assessments);
    //this.store.member.assessments.save();
    this.store.save();
  //  response.redirect('/member/' + memberId);
  },
  
  
    removeAssessment(id, assessmentId) {
    const member1 = this.getMemberById(id);
    // remove the song with id songId from the playlist
    _.remove(member1.assessments, {id:assessmentId});
    this.store.save();
      
  },
  
  
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
 // this.updateMemberDetails();
    this.store.save();
  },
  
  
};

module.exports = membersStore;