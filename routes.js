'use strict';

const express = require('express');
const router = express.Router();

const accounts =  require('./controllers/accounts.js');
const dashboard = require('./controllers/dashboard.js');
const initial_screen = require('./controllers/initial_screen.js');
const member = require('./controllers/member.js')
const trainers = require('./controllers/trainers.js')


router.get('/', initial_screen.index);
router.get('/login', accounts.login);
router.get('/signup', accounts.signup);
router.post('/register', accounts.register);
router.post('/authenticate', accounts.authenticate);

router.get('/dashboard', member.indexM);
router.get('/dashboardT/:email', dashboard.indexT);
router.get('/dashboardTT/:email', dashboard.indexTT);

router.post('/member/:id/addAssessment', member.addAssessment);
router.get('/member/:id/deleteassessment/:assessmentid', member.deleteAssessment);
router.post('/member/:id/addcomment/:assessmentid', member.addComment);
router.post('/member/:id/addgoal', member.addGoal);
router.get('/member/:id/deletegoal/:goalid', member.deleteGoal);

router.get('/member/:id/assessment/:assessmentid', member.viewAssessment);



router.get('/about_member', member.aboutMember);
router.get('/update_member', member.review);
router.post('/memberDataUpdate', member.memberDataUpdate);
router.get('/trainer_member', trainers.aboutAllTrainers);


router.get('/trainer/:trainerid/selectTrainer', member.selectTrainer);
router.get('/member/:id', member.index);

router.get('/alltrainers', dashboard.indexTT);


router.get('/trainer_clients/:trainerid', trainers.index);
router.get('/trainer/group_clients/:trainerid', trainers.index);
router.get('/trainer_clients', trainers.index);


router.get('/trainer_clients_assess', trainers.index3);
router.get('/member/:id/listassessments', trainers.index4);


router.get('/trainer_about', trainers.about);
router.get('/trainer/about/:trainerid', trainers.about);
router.get('/trainer/group_about/:trainerid', trainers.about);

router.post('/trainerDataUpdate', trainers.trainerDataUpdate);
router.get('/trainer_update', trainers.review);

router.get('/trainer/:trainerid/deleteClient/:memberid', trainers.deleteClient);

router.get('/trainer', trainers.index);

// not sure if this needed
router.get('/initial_screen', initial_screen.index);
router.get('/logoff', accounts.logout);




module.exports = router;
