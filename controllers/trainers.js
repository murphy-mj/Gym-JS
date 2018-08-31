'use strict';

const logger = require('../utils/logger');
const trainers = require('../models/trainersStore.js');
const members = require('../models/membersStore.js');
const prepdata = require('../utils/prepdata');
const accounts = require('./accounts');

const trainer = {
  
   // index is used to show the selected trainer's client list
  // the request may come from the logged in trainer, or from the group trainer view
  // as trainer only holds the id of each member that has selected him/her, a method is called, getTrainerClients 
  // which returnds an object of the needed member details
  
  index(request, response) {
    const contnt = request.path;
    logger.debug('The requested path, group or individual', contnt);
    let n = contnt.indexOf("group");
    logger.debug('index of group ',n);
    let trainerID = request.params.trainerid;
    logger.debug('Trainer id for index is = ',trainerID);
    
    if(trainerID === null || trainerID === "" || trainerID === undefined){
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
    // trainerclients is called within the individal logged in trainer
    // group_trainerclients is called within the group trainer menu
    if(n === -1){
    response.render('trainerclients', viewData);
    } else {
      response.render('group_trainerclients', viewData);
    }
  
  },
 
  
  
  
   // as clients select trainers, this function loops through all trainers 
  // and updates ach trainers client array with any client that has selected that trainer as trainer.
  
  indexTT(request, response) {
    const allmembers = members.getAllMembers();
    const alltrainers = trainers.getAllTrainers();
    logger.info('all trainer updated for latest member trainer selection');
    if ((alltrainers === null || alltrainers === 'undefined')) {
         // do nothingclients
    } else {
           for (let t = 0; t < alltrainers.length; t++) {
                alltrainers[t].clients = prepdata.setTrainerClients(alltrainers[t].id,allmembers);
           }
    }
    const viewData3 = {
      title: 'Trainers Dashboard t',
      trainersData: alltrainers,
    };
    logger.info('about to render dashboradTrainers', alltrainers);
     response.render('dashboardTrainers', viewData3);
  },
  
  
  
  

  
  
  // this is method is only called by a trainer 
  // member id is got from request parameter, the trainer object gleamed from logged in trainer
  // from this parameter, an member object is retrived, as assessments from is an array within this object. this is retrived as a separate object
  
  
  
   listMemberAssessments(request, response) {
     const memberID = request.params.id;
     const membr = members.getMemberById(memberID);
     const assessments = membr.assessments;
     let loggedInUser = accounts.getCurrentUser(request);
    const viewData = {
      title: 'Trainer Info',
      trainersData:loggedInUser,
      membersData: membr,
      assessments: assessments,
    };
    logger.debug('List Member Assessments');
    response.render('memberassessments', viewData);
  },
  

  // this trainer bio, can be requested from the individual trainer menu or the group menu
  // source of request is used to determine which view is selected
  
  about(request, response) {
    //looking at source of request
    const contnt = request.path;
    logger.debug('whats content', contnt);
    let n = contnt.indexOf("group");
    logger.debug('is this group ',n);
    
    let trainerID = request.params.trainerid;
    logger.debug('Trainer id from Paramterers = ',trainerID);
    
    // if no trainer supplied as a parameter, depending on the source of the request
    if(trainerID === null || trainerID === undefined || trainerID === '' ){
      let loggedInUser = accounts.getCurrentUser(request);
      trainerID = loggedInUser.id;
      logger.debug('current logged in user about = ',loggedInUser.id);
    }
    
    const trainersData = trainers.getTrainerById(trainerID);
    
    const viewData = {
      title: 'About Trainer',
      trainersData: trainersData,
    };
    // either the selected trainer's data or the current loggin trainer data is sent to be displayed
    // selected will be group_t
    
    if(n === -1){
    response.render('trainerabout_t', viewData);
    } else {
      response.render('group_trainerabout', viewData);
    }
  },
  
  
  
  // used by member to select a trainer from a list of trainers
  
  aboutAllTrainers(request, response) {
    logger.debug('about all trainers');
    const loggedInUser = accounts.getCurrentUser(request);
    const viewData = {
      title: 'About current logged in Trainer',
      trainersData: trainers.getAllTrainers(),
      membersData: loggedInUser,
    };
    response.render('trainerabout', viewData);
  },
  
  
  
  
  
  
  trainerDataUpdate(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    logger.debug('current logged data update user= ',loggedInUser);
    
    const trainr = request.body;
   // if(trainr.firstname !== null || trainr.firstname !== "" || trainr.firstname !== undefined){
     if(trainr.firstname !== ''){ 
      loggedInUser.firstName = trainr.firstname;
    }
    if(trainr.lastname !== ''){
      loggedInUser.lastName = trainr.lastname;
    }
    if(trainr.gender !== ''){
      loggedInUser.gender = trainr.gender;
    }
    if(trainr.age !== ''){
      loggedInUser.age = trainr.age;
    }
    if(trainr.speciality !== ''){
      loggedInUser.speciality = trainr.speciality;
    }
    if(trainr.bio !== ''){
      loggedInUser.bio = trainr.bio;
    }
    if(trainr.photo !== ''){
      loggedInUser.photo = trainr.photo;
    }
    
    trainers.updateTrainerDetails();
    const viewData = {
      title: 'Trainers Info Update',
      trainersData: loggedInUser,
    };
    response.render('trainerabout_t', viewData);
  },
  
  
  
  
  
  
  // review existing data prior to change
  review(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    logger.debug('current logged data review ',loggedInUser.id);
    const viewData = {
      title: 'Trainers Info Review',
      trainersData: accounts.getCurrentUser(request),
    };
    
    response.render('trainerdata', viewData);
  
  },
  
  
  
  
  // this just removes the client from trainer list, so updates trainer [] and members trainerid
  
deleteClient(request, response) {
    const trainerId = request.params.trainerid;
    const memberId = request.params.memberid;
    logger.debug(`Removing client member ${memberId} from trainer ${trainerId} client list`);
    members.removeTrainer(trainerId, memberId);
    trainers.removeClient(trainerId, memberId);
    response.redirect('/trainer_clients/' + trainerId);
},

  // to remove member from the database
  
  fireClient(request, response) {
    const trainerId = request.params.trainerid;
    const memberId = request.params.memberid;
    trainers.fireClient(trainerId, memberId);
    logger.debug(`Removing member from DB ${memberId}`);
    members.fireClient(memberId);
    response.redirect('/trainer_clients/' + trainerId);
},
  
  
  
  
  
  
  
  
// review existing data prior to change
  addTrainerGoal(request, response) {
    const trainerId = request.params.trainerid;
    const memberId = request.params.id;
    const trainr = trainers.getTrainerById(trainerId);
    const membr = members.getMemberById(memberId);
    const viewData = {
      title: 'Trainer Adding Goal for member',
      trainersData: trainr,
      membersData: membr,
    };
    
    response.render('trainerGoal', viewData);
  
  },
  
  
};

module.exports = trainer;