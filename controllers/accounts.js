'use strict';

const membersStore = require('../models/membersStore');
const trainersStore = require('../models/trainersStore');

const logger = require('../utils/logger');
const uuid = require('uuid');

const accounts = {

  index(request, response) {
    const viewData = {
      title: 'Login or Signup',
    };
    response.render('initial_screen', viewData);
  },

  login(request, response) {
    const viewData = {
      title: 'Login to the Service',
    };
    response.render('login', viewData);
  },

  logout(request, response) {
    response.cookie('member', '');
    response.cookie('trainer', '');
    response.redirect('/');
  },

  signup(request, response) {
   const viewData = {
   title: 'Signup the Service',
    };
    response.render('signup', viewData);
   },

  register(request, response) {
    const member = request.body;
    const assessments = [];
    member.id = uuid();
    member.trainerid = "99";
    member.assessments = assessments;
    membersStore.addMember(member);
    logger.info(`registering ${member.email}`);
    response.redirect('/login');
  },

  authenticate(request, response) {
    const member = membersStore.getMemberByEmail(request.body.email);
    const trainer = trainersStore.getTrainerByEmail(request.body.email);
  
    
    if (member) {
      const receivedemail = member.email;
      response.cookie('member', member.email);
       response.cookie('trainer','');
      logger.info(`logging member in ${member.email}`);
      response.redirect('/dashboard');
    } else if (trainer) {
      const receivedemail = trainer.email;
      response.cookie('trainer', trainer.email);
      response.cookie('member','');
      logger.info(`logging trainer in ${trainer.email}`);
      response.redirect('/dashboardTT/'+ receivedemail);
    } 

    else {
      response.redirect('/login');
    }
  },

  getCurrentUser(request) {
    logger.info('what object member email',request.cookies.member);
    logger.info('what object trainer email',request.cookies.trainer);
    if(request.cookies.trainer !== ''){
      const userEmailt = request.cookies.trainer;
      logger.info('what object trainer object',trainersStore.getTrainerByEmail(userEmailt));
      return trainersStore.getTrainerByEmail(userEmailt);
    } else {  
        const userEmailm = request.cookies.member;
        logger.info('what object member object',membersStore.getMemberByEmail(userEmailm));
        return membersStore.getMemberByEmail(userEmailm);
  }
  },
  
  
  
  
  
  updateSettings(request,response) {
    const userEmail = request.cookies.members;
    // return membersStore.getMemberByEmail(userEmail);
    response.redirect('/dashboard');
  },
  
  
  
  
  
  
};

module.exports = accounts;