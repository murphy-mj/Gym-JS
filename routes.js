'use strict';

const express = require('express');
const router = express.Router();

const accounts =  require('./controllers/accounts.js');
const initial_screen = require('./controllers/initial_screen.js');
const member = require('./controllers/member.js')
const trainers = require('./controllers/trainers.js')


router.get('/', initial_screen.index);
router.get('/login', accounts.login);
router.get('/signup', accounts.signup);
router.post('/register', accounts.register);
router.post('/authenticate', accounts.authenticate);
router.get('/logoff', accounts.logout);

//dashborad views
router.get('/dashboard', member.indexM);
router.get('/dashboardTT/:email', trainers.indexTT);
router.get('/alltrainers', trainers.indexTT);


router.post('/member/:id/addAssessment', member.addAssessment);
router.get('/member/:id/deleteassessment/:assessmentid', member.deleteAssessment);

router.post('/member/:id/addcomment/:assessmentid', member.addComment);

router.post('/member/:id/addgoal/', member.addGoal);
router.get('/member/:id/deletegoal/:goalid', member.deleteGoal);



router.get('/member/:id/assessment/:assessmentid', member.viewAssessment);



router.get('/about_member', member.aboutMember);
router.get('/update_member', member.review);
router.post('/memberDataUpdate', member.memberDataUpdate);
router.get('/trainer_member', trainers.aboutAllTrainers);


router.get('/trainer/:trainerid/selectTrainer', member.selectTrainer);
router.get('/member/:id', member.indexM);


// calling a listing of clients that has been assigned to a trainer
router.get('/trainer_clients/:trainerid', trainers.index);
router.get('/trainer/group_clients/:trainerid', trainers.index);
router.get('/trainer_clients', trainers.index);
router.get('/trainer', trainers.index);


router.get('/trainer/:trainerid/addgoal/:id', trainers.addTrainerGoal);
router.post('/trainer/:trainerid/postgoal/:id', member.addGoal);


router.get('/member/:id/listassessments', trainers.listMemberAssessments);


router.get('/trainer_about', trainers.about);
router.get('/trainer/about/:trainerid', trainers.about);
router.get('/trainer/group_about/:trainerid', trainers.about);



router.post('/trainerDataUpdate', trainers.trainerDataUpdate);
router.get('/trainer_update', trainers.review);
// delete client is to remove the client from the listof clients that the trainer has
router.get('/trainer/:trainerid/deleteClient/:memberid', trainers.deleteClient);
// fire client is to removed from DB
router.get('/trainer/:trainerid/fireClient/:memberid', trainers.fireClient);



module.exports = router;
