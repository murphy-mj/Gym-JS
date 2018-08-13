'use strict';

const logger = require('../utils/logger');
const trainers = require('../models/trainersStore.js');
const members = require('../models/membersStore.js');
const prepdata = require('../utils/prepdata');
const accounts = require('./accounts');

const trainer = {
  
   // index is used to show the selected trainer's client list
  index(request, response) {
    const contnt = request.path;
    logger.debug('whats requested path, group or individual', contnt);
    let n = contnt.indexOf("group");
    logger.debug('index of group ',n);
    let trainerID = request.params.trainerid;
    logger.debug('Trainer id from index = ',trainerID);
    
    if(trainerID == null || trainerID == ""){
      let loggedInUser = accounts.getCurrentUser(request);
      trainerID = loggedInUser.id;
      logger.debug('current logged in user id = ',loggedInUser.id);
    }
    
    const allMembers = members.getAllMembers();
    const trainersData = trainers.getTrainerById(trainerID);
    const clientDetails = prepdata.getTrainerClients(trainers.getTrainerById(trainerID),allMembers)
    const viewData = {
      title: 'Trainer Info',
      trainersData: trainersData,
      clientdetails: clientDetails
    };
    
    if(n == -1){
    response.render('trainerclients', viewData);
    } else {
      response.render('group_trainerclients', viewData);
    }
  
  },
 
  
  index3(request, response) {
    logger.info('index 3');
    const loggedInUser = accounts.getCurrentUser(request);

    const viewData = {
      title: 'Members Dashboard',
      membersData: members.getMemberById(loggedInUser.id),
      assessments: loggedInUser.assessments,
    };
    logger.info('about to render tranerclients',loggedInUser.id);
    response.render('trainerclients', viewData);
  },
  
  
  
  index4(request, response) {
     const memberID = request.params.id;
    logger.debug('index 4 Member id index = ',memberID);
     const membr = members.getMemberById(memberID);
    const assessments = membr.assessments;
     logger.debug('index 4 Member',assessments);
    const viewData = {
      title: 'Trainer Info',
      membersData: membr,
      assessments: assessments,
    };
    response.render('memberassessments', viewData);
  },
  

  
  
  
  about(request, response) {
    //looking at source of request
    const contnt = request.path;
    logger.debug('whats content', contnt);
    let n = contnt.indexOf("group");
    logger.debug('is this group ',n);
    let trainerID = request.params.trainerid;
    logger.debug('Trainer id from Paramterers = ',trainerID);
    
    if(trainerID == null || trainerID == ""){
      var loggedInUser = accounts.getCurrentUser(request);
      trainerID = loggedInUser.id;
      logger.debug('current logged in user about = ',loggedInUser.id);
    }
    
    const trainersData = trainers.getTrainerById(trainerID);
    const viewData = {
      title: 'About Trainer',
      trainersData: trainersData,
    };
    
    if(n == -1){
    response.render('trainerabout_t', viewData);
    } else {
      response.render('group_trainerabout', viewData);
    }
  },
  
  
  
  aboutAllTrainers(request, response) {
    logger.debug('about all trainers');
    
    const viewData = {
      title: 'About current logged in Trainer',
      trainersData: trainers.getAllTrainers(),
    };
    response.render('trainerabout', viewData);
  },
  
  
  trainerDataUpdate(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    logger.debug('current logged data update user= ',loggedInUser);
    
    const trainr = request.body;
    if(trainr.firstName != null || trainr.firstName !=""){
      loggedInUser.firstName = trainr.firstName
    }
    if(trainr.lastName != null || trainr.lastName !=""){
      loggedInUser.lastName = trainr.lastName
    }
    if(trainr.gender != null || trainr.gender !=""){
      loggedInUser.gender = trainr.gender
    }
    if(trainr.age != null || trainr.age !=""){
      loggedInUser.age = trainr.age
    }
    if(trainr.speciality != null || trainr.speciality !=""){
      loggedInUser.speciality = trainr.speciality
    }
    if(trainr.bio != null || trainr.bio !=""){
      loggedInUser.bio = trainr.bio
    }
    trainers.updateTrainerDetails();
    const viewData = {
      title: 'Trainers Info Update',
      trainersData: loggedInUser,
    };
    response.render('trainerabout_t', viewData);
  },
  
  
  review(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    logger.debug('current logged data review ',loggedInUser.id);
    const viewData = {
      title: 'Trainers Info Review',
      trainersData: accounts.getCurrentUser(request),
    };
    
    response.render('trainerdata', viewData);
  
  },
  
  
  
  
deleteClient(request, response) {
    const trainerId = request.params.trainerid;
    const memberId = request.params.memberid;
    logger.debug(`Removing client member ${memberId} from trainer ${trainerId} client list`);
    members.removeTrainer(trainerId, memberId);
    trainers.removeClient(trainerId, memberId);
    response.redirect('/trainer_clients/' + trainerId);
},
  
  
};

module.exports = trainer;