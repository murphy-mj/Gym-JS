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

// creates a member object, called member, and populates it with all the key value pairs from the
// sign up form. It then add trainerid 99, which is dummy trainer, unique id, assessments and gaols array.
// and then add this member to the members Json object
// it then redirects back to login screen, for new member to login.
  
register(request, response) {
    const femalePhoto = "https://semantic-ui.com/images/avatar2/large/kristy.png"
    const malePhoto = "https://semantic-ui.com/images/avatar/large/daniel.jpg"
    const member = request.body;
    const assessments = [];
    const goals = [];
    member.id = uuid();
    member.jDate = new Date();
    member.trainerid = "99";
    member.assessments = assessments;
    member.goals = goals;
    if(member.photo == '' || member.photo == null  ) {
      if(member.gender = 'M') {
         member.photo = malePhoto;
      } else {
        member.photo = femalePhoto;
      }
    }
    membersStore.addMember(member);
    logger.info(`registering ${member.email}`);
    logger.info('member details ',member);
    response.redirect('/login');
},

// when the peron logs in, we need to direct to the correct menu/dashboard
// the person logs in using a form, contaiing a email and password

  
authenticate(request, response) {
    // because we dont know whether the peron logging is a trainer or member, one of these will be valid 
    const member = membersStore.getMemberByEmail(request.body.email);
    const trainer = trainersStore.getTrainerByEmail(request.body.email);
    let inputPassword = request.body.password;
  
  
    if (member) {
     
      if(member.password === inputPassword){ 
       let receivedemail = member.email;
      // creating a cookie called member and storing members email from login screen, and setting the trainer cookie to ''
      response.cookie('member', member.email);
      response.cookie('trainer','');
      logger.info(`logging member in ${member.email}`);
      response.redirect('/dashboard');
      } else {
        response.redirect('/login');
      }
      
      
    } else if (trainer) {
         if(trainer.password === inputPassword){ 
      
          let receivedemail = trainer.email;
          // creating a cookie called trainer and storing trainers email from login screen, and setting the member cookie to ''
          response.cookie('trainer', trainer.email);
          response.cookie('member','');
          logger.info(`logging trainer in ${trainer.email}`);
          response.redirect('/dashboardTT/'+ receivedemail);
          }else {
                response.redirect('/login');
                }
     }
  
},

// when user logs in, the authenticate() creates a cookie object, in which is stored the email address. cookie called either trainer or member
// when a member or trainer is logged in its cookie (request.cookie.trainer or .member) will not be equal to ''
// getCurrentUser returns all the data in the Members or Trainers JSON object
  
getCurrentUser(request) {
      if(request.cookies.trainer !== '' ){
      let userEmailt = request.cookies.trainer;
      logger.info('current user is a trainer',trainersStore.getTrainerByEmail(userEmailt).lastName);
      return trainersStore.getTrainerByEmail(userEmailt);
    } else {  
           let userEmailm = request.cookies.member;
           logger.info('current user is a Member',membersStore.getMemberByEmail(userEmailm).lastName);
           return membersStore.getMemberByEmail(userEmailm);
          }
},
  
  
  
  
  
updateSettings(request,response) {
    let userEmail = request.cookies.members;
    response.redirect('/dashboard');
},
    
  
};

module.exports = accounts;