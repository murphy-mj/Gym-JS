'use strict';

const logger = require('../utils/logger');
const prepdata = require('../utils/prepdata');
const members = require('../models/membersStore.js');
const trainers = require('../models/trainersStore.js');
const accounts = require('../controllers/accounts.js');


//const playlistCollection = require('../models/playlist-store.js');

//const playlistStore = require('../models/playlist-store.js');

const dashboard = {
  
  index(request, response) {
    logger.info('dashboard rendering');
    const viewData = {
      title: 'Members Dashboard',
      members: members.getAllMembers(),
    };
    logger.info('about to render', members.getAllMembers());
    response.render('dashboardMembers', viewData);
  },
  
  indexM(request, response) {
    logger.info('dashboard rendering for logging in Member');
    const loggedInUser = accounts.getCurrentUser(request);

    const viewData = {
      title: 'Members Dashboard',
      membersData: members.getMemberById(loggedInUser.id),
      assessments: loggedInUser.assessments,
    };
    logger.info('about to render',loggedInUser.id);
    response.render('member', viewData);
  },
  

  
  
  indexT(request, response) {
    logger.info('dashboard trainer rendering');
    const allMembers = members.getAllMembers();
    const clientemail = request.params.email;
      logger.info('dashboard trainer rendering IndexTid',request.params.email);
    const viewData2 = {
      title: 'Trainers Dashboard t',
      trainersData: trainers.getTrainerByEmail(request.params.email),
     // trainersData: trainers.getTrainerById(request.params.id),
     // clientdetails: prepdata.getTrainerClients(trainers.getTrainerByEmail(clientid),allMembers),
     clientdetails: prepdata.getTrainerClients(trainers.getTrainerByEmail(request.params.email),allMembers),
    };
    
   // logger.info('about to render trainers', trainers.getAllTrainers());
     logger.info('about to render trainer data', viewData2.clientdetails);
    response.render('trainerclients', viewData2);
   //response.render('dashboardTrainers', viewData2);
  },
  
  
  
  // as clients select trainers, this function loops through all trainers 
  // and adds any client that has selected that trainer as trainer, into the client [] 
  
  indexTT(request, response) {
    const alltrainers = trainers.getAllTrainers();
    logger.info('all trainer updated for latest member trainer selection');
    if ((alltrainers === null || alltrainers === 'undefined')) {
     // do nothingclients
  }else {
    
   for (let t = 0; t < alltrainers.length; t++) {
  logger.info('within for lp', alltrainers[t].id);
      alltrainers[t].clients = prepdata.setTrainerClients(alltrainers[t].id);
   }
   }
    
    logger.info('dashboard all trainer rendering indexTT');
    const allmembers = members.getAllMembers();
    const viewData3 = {
      title: 'Trainers Dashboard t',
      trainersData: alltrainers,
    };
     logger.info('about to render trainers data', alltrainers);
     response.render('dashboardTrainers', viewData3);
  },
  
  
  
};

module.exports = dashboard;