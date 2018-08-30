'use strict';

const logger = require('../utils/logger');
const prepdata = require('../utils/prepdata');
const members = require('../models/membersStore.js');
const trainers = require('../models/trainersStore.js');
const accounts = require('../controllers/accounts.js');

const dashboard = {
  
 // index(request, response) {
 //   logger.info('dashboard rendering');
  //  const viewData = {
  //    title: 'Members Dashboard',
  //    members: members.getAllMembers(),
  //  };
 //   logger.info('about to render dashboardMembers');
//    response.render('dashboardMembers', viewData);
//  },
  
  
  
  //indexM(request, response) {
  //  logger.info('dashboard rendering for logging in Member');
  //  const loggedInUser = accounts.getCurrentUser(request);
 //   const viewData = {
 //     title: 'Members Dashboard',
  //    membersData: members.getMemberById(loggedInUser.id),
  //    assessments: loggedInUser.assessments,
 //   };
//    logger.info('about to render member for member id',loggedInUser.id);
//    response.render('member', viewData);
//  },
  

  
  
//  indexT(request, response) {
//    logger.info('dashboard trainer rendering for logged in trainer');
 //   const allMembers = members.getAllMembers();
 //   const clientemail = request.params.email;
//    const viewData2 = {
//      title: 'Trainers Dashboard',
 //     trainersData: trainers.getTrainerByEmail(request.params.email),
 //     clientdetails: prepdata.getTrainerClients(trainers.getTrainerByEmail(request.params.email),allMembers),
 //   };
//     logger.info('about to render trainerclients', viewData2.clientdetails);
 //    response.render('trainerclients', viewData2);
//
//  },
  
  
  
  // as clients select trainers, this function loops through all trainers 
  // and adds any client that has selected that trainer as trainer, into the client [] 
  
 // indexTT(request, response) {
  //  const allmembers = members.getAllMembers();
//    const alltrainers = trainers.getAllTrainers();
  //  logger.info('all trainer updated for latest member trainer selection');
 //   if ((alltrainers === null || alltrainers === 'undefined')) {
         // do nothingclients
 //   } else {
//           for (let t = 0; t < alltrainers.length; t++) {
//                alltrainers[t].clients = prepdata.setTrainerClients(alltrainers[t].id,allmembers);
 //          }
  //  }
  //  const viewData3 = {
   //   title: 'Trainers Dashboard t',
   //   trainersData: alltrainers,
   // };
 //   logger.info('about to render dashboradTrainers', alltrainers);
// //    response.render('dashboardTrainers', viewData3);
//  },
  
  
  
};

module.exports = dashboard;