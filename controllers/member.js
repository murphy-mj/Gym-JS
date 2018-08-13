'use strict';

const logger = require('../utils/logger');
const analy = require('../utils/analytics');
const members = require('../models/membersStore.js');
const trainers = require('../models/trainersStore.js');
const accounts = require('../controllers/accounts.js');
const uuid = require('uuid');

const member = {
  
  index(request, response) {
    const memberID = request.params.id;
    const viewData = {
      title: 'Members Dashboard',
      membersData: members.getMemberById(memberID),
      assessments: members.getMemberById(memberID).assessments,
      bmi: analy.getBMI(members.getMemberById(memberID).assessments,members.getMemberById(memberID).height),
      bmicategory: analy.getBMICategory(analy.getBMI(members.getMemberById(memberID).assessments,members.getMemberById(memberID).height)),
      idealbodyweight: analy.isIdealBodyWeight(members.getMemberById(memberID)),
    };
    
    logger.debug('About to render member, for selected Member id = ',memberID);
    response.render('member', viewData);
  },
  
  
  indexM(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    const viewData = {
      title: 'Members Dashboard, index M',
      membersData: members.getMemberById(loggedInUser.id),
      assessments: loggedInUser.assessments,
      bmi: analy.getBMI(members.getMemberById(loggedInUser.id).assessments,loggedInUser.height),
      bmicategory: analy.getBMICategory(analy.getBMI(members.getMemberById(loggedInUser.id).assessments,loggedInUser.height)),
      idealbodyweight: analy.isIdealBodyWeight(members.getMemberById(loggedInUser.id)),
    };
    logger.info('about to render member for logging in member',loggedInUser.id);
    response.render('member', viewData);
  },
  
  
  deleteAssessment(request, response) {
    const memberId = request.params.id;
    const assessmentId = request.params.assessmentid;
    logger.debug('Deleting Assessment',assessmentId );
    members.removeAssessment(memberId, assessmentId);
    response.redirect('/member/' + memberId);
  },
  
  
  addAssessment(request, response) {
    const memberId = request.params.id;
    const newAssessment = request.body;
    newAssessment.id = uuid();
    newAssessment.date = new Date();
    newAssessment.comment = "";
    newAssessment.trend = false;
    logger.debug('Adding Assessment for Member', memberId);
    members.addAssessment(memberId,newAssessment);
    response.redirect('/member/' + memberId);
  },
  
  viewAssessment(request, response) {
    const memberId = request.params.id;
    const assessmentId = request.params.assessmentid;
    const assessment = members.selectAssessment2(memberId,assessmentId);
    
    const viewData = {
      title: 'Members Info',
      membersData: members.getMemberById(memberId),
      assessment: assessment,
    };
    logger.debug('Requesting to view Assessment', assessment);
    response.render('memberassessment', viewData);
  },
  
  
  addComment(request, response) {
    // add comment to existing assessment
    const memberId = request.params.id;
    const assessmentId = request.params.assessmentid;
    const comment = request.body.comment;
    const assessment = members.selectAssessment2(memberId,assessmentId);
    assessment.comment = comment;
    logger.debug('Adding comment for Assessment',assessmentId);
    members.updateMemberDetails();
    // after comment added display all Assessments of Client
    const membr = members.getMemberById(memberId);
    const assessments = membr.assessments;
    const viewData = {
      title: 'Trainer Info',
      membersData: membr,
      assessments: assessments,
    };
    response.render('memberassessments', viewData);
  },
  

  
  review(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    const viewData = {
      title: 'Members Info Review',
      membersData: accounts.getCurrentUser(request),
    };
    logger.debug('current loggedIn data review ',loggedInUser.id);
    response.render('memberData', viewData);
  },
  
  aboutMember(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    const trainerId = loggedInUser.trainerid; 
    const viewData = {
      title: 'Members Info Review',
      membersData: accounts.getCurrentUser(request),
      trainersData: trainers.getTrainerById(trainerId),
    };
    logger.debug('about member, member id ',loggedInUser.id);
    response.render('memberabout', viewData);
  
  },
  
  memberDataUpdate(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    logger.debug('current logged data update, user= ',loggedInUser);
    const membr = request.body;
    loggedInUser.firstName = membr.firstName
    loggedInUser.lastName = membr.lastName
    loggedInUser.gender = membr.gender
    loggedInUser.height = membr.height
    loggedInUser.startWeight = membr.startWeight
    loggedInUser.age = membr.age
    members.updateMemberDetails();
    const loggedInMember2 = accounts.getCurrentUser(request);
    const viewData = {
      title: 'Members Info Update',
      membersData: loggedInMember2,
    };
    response.render('memberabout', viewData);
  },
  
  
  selectTrainer(request, response) {
    const loggedInUser = accounts.getCurrentUser(request); 
    let trainerId = request.params.trainerid;  
    loggedInUser.trainerid = trainerId;
    members.updateMemberDetails();
    const loggedInUser2 = accounts.getCurrentUser(request);
    logger.debug('post update trainer selected ',loggedInUser2.trainerid);
    const viewData = {
      title: 'Members Info Review',
      membersData: accounts.getCurrentUser(request),
      trainersData: trainers.getTrainerById(trainerId),
    };
    response.render('memberabout', viewData);
  
  },
  
};

module.exports = member;