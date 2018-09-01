'use strict';

const logger = require('../utils/logger');
const analy = require('../utils/analytics');
const members = require('../models/membersStore.js');
const trainers = require('../models/trainersStore.js');
const accounts = require('../controllers/accounts.js');
const uuid = require('uuid');

const member = {
  
  // for member dashborad view
  
  indexM(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    let currentBMI = 0;
       
        if(loggedInUser.assessments.length === 0) {
          currentBMI =  analy.getInitialBMI(loggedInUser);
          logger.debug('indexM loggedinuser no assessments');
    }  else {
          currentBMI = analy.getBMI(members.getMemberById(loggedInUser.id).assessments,parseFloat(loggedInUser.height));
          logger.debug('indexM loggedinuser has assessments');
    };
    const viewData = {
      title: 'Members Dashboard, index M',
      membersData: members.getMemberById(loggedInUser.id),
      assessments: loggedInUser.assessments,
      bmi: currentBMI,
      bmicategory: analy.getBMICategory(parseFloat(currentBMI)),
      idealbodyweight: analy.isIdealBodyWeight(members.getMemberById(loggedInUser.id)),
    };
    logger.info('about to render member for logged in member',loggedInUser.id);
    response.render('member', viewData);
  },
  
  
  ////  change required
  
  deleteAssessment(request, response) {
    const memberId = request.params.id;
    const assessmentId = request.params.assessmentid;
    logger.debug('Deleting Assessment',assessmentId );
    members.removeAssessment(memberId, assessmentId);
    const loggedInUser = accounts.getCurrentUser(request);
    if(loggedInUser.id === memberId){
    response.redirect('/member/' + memberId);
    } else {
    response.redirect('/member/' + memberId + '/listassessments');
    }
  },
  
  
  
  // takes the basic information (key value pairs) from the Assessment form and add additional pairs
  // such as id, date, comment, trend
  // this assessment is then send to MembersStore to be added to the menbers assessment array
  // plus additonal tests
  
  addAssessment(request, response) {
    const memberId = request.params.id;
    const newAssessment = request.body;
    newAssessment.id = uuid();
    newAssessment.date = new Date().toLocaleString('en-gbp');  // format date
    newAssessment.comment = "";
    newAssessment.trend = false;
    logger.debug('Added additional info to Assessment, send to member for adding');
    members.addAssessment(memberId,newAssessment);
    response.redirect('/member/' + memberId);
  },
  
  
  
  
  // this generates data for memberassessment view, which shows the selected assessment and a comment input box for trainers comment
  
  viewAssessment(request, response) {
    const memberId = request.params.id;
    const assessmentId = request.params.assessmentid;
    const assessment = members.selectAssessment2(memberId,assessmentId); 
    const viewData = {
      title: 'Members Info',
      membersData: members.getMemberById(memberId),
      assessment: assessment,
     };
    logger.debug('View select Assessment and add comment', assessment);
    response.render('memberassessment', viewData);
  },
  
  
  
  
  
  // only the trainer can add a comment to a members assessment
  // mmber id, assessment id and comment from  the form are collated here
  // the assessment is located from within the members assessment array and comment updated
  
  addComment(request, response) {
    const memberId = request.params.id;
    const assessmentId = request.params.assessmentid;
    const comment = request.body.comment;
    // select Assessment2 uses javascript update 
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
  

  
  
  
  
  // this provides the current logging in member data, so that it can be reviewed and updated
  
  review(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    const viewData = {
      title: 'Members Info Review for update',
      membersData: accounts.getCurrentUser(request),
    };
    logger.debug('current loggedIn data for review ',loggedInUser.id);
    response.render('memberData', viewData);
  },
  
  
  
  
  
  
  // provides data for a short summary about current logging in member
  // each member hold the selected trainer id
  
  aboutMember(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    const trainerId = loggedInUser.trainerid; 
    const viewData = {
      title: 'Members Info Review',
      membersData: accounts.getCurrentUser(request),
      currentWeight: members.getCurrentWeight(loggedInUser),
      trainersData: trainers.getTrainerById(trainerId),
    };
    logger.debug('about member, member id ',loggedInUser.id);
    response.render('memberabout', viewData);
  
  },
  
  
  
  
  
  
  // this method is to facilitate the update of members personal details
  // only current logged in member can update its deatils
  
  memberDataUpdate(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    const membr = request.body;
    // any key value pairs that have date will be updated
    if(membr.firstname !== ''){
    loggedInUser.firstName = membr.firstname
    }
    if(membr.lastname !== ''){
    loggedInUser.lastName = membr.lastname
    }
    if(membr.gender !== ''){
    loggedInUser.gender = membr.gender
    }
    if(membr.height !== ''){
    loggedInUser.height = membr.height
    }
    if(membr.startweight !== ''){
    loggedInUser.startWeight = membr.startweight
    }
    if(membr.age !== ''){
    loggedInUser.age = membr.age
    }
    if(membr.photo !== ''){
    loggedInUser.photo = membr.photo
    }
    members.updateMemberDetails();
    const viewData = {
      title: 'Members Info Update',
      membersData: loggedInUser,
      currentWeight: members.getCurrentWeight(loggedInUser),
    };
    response.render('memberabout', viewData);
  },
  
  
  
  
  
  
  // only the member can select and change a trainer.
  // whe you log in as a trainer, the members are analysed for their selected trainers
  // each trainers array of members is updated then
  // this method called from AboutTrainers partial, which gives a list of trainers and their speciality
  // only the logged in member can select its trainer
  // once selected the members details are updated
  
  selectTrainer(request, response) {
    const loggedInUser = accounts.getCurrentUser(request); 
    let trainerId = request.params.trainerid;  
    loggedInUser.trainerid = trainerId;
    members.updateMemberDetails();
    const viewData = {
      title: 'Members Info Review',
      membersData: accounts.getCurrentUser(request),
      currentWeight: members.getCurrentWeight(loggedInUser),
      trainersData: trainers.getTrainerById(trainerId),
    };
    logger.debug('update member with new trainer selected ',loggedInUser.trainerid);
    // memberabout gives a small summary of the member, and the trainer that the member uses
    response.render('memberabout', viewData);
  
  },
  
  
  
  
  // A goal can be set by member, and the trainer selected by that member
  // the model has a separate partial for the trainer and member to set goals,each will have its own request path
  // by analysing the request path, i can determine who has set the goal
  
  addGoal(request, response) {
    let memberId = request.params.id;
    let trainerId = request.params.trainerid;
    let trainr = null;
    let goalSetter = "";
    // see where request comes from, trainer or member
    const req_path = request.path;
    // if trainer not found, it will return -1
    let n = req_path.indexOf("trainer");
    if (n < 0) {
       logger.debug('Adding Goal set by Member', memberId);
    } else {
      logger.debug('Adding Goal for Member by Trainer',request.params.trainerid);
      trainr = trainers.getTrainerById(request.params.trainerid);
    }
    
    if(n < 0) {
      goalSetter = "member";
    } else {
      goalSetter  = trainr.lastName;
    };
    // newGoal object created with key value pairs from Goal form
    // additional key value pairs added
    // Gdate (target date) from form, is a html date and does not provide a time stamp, so it cannot be converted easily to a number (valueOf())
    // by wrapping the html date in a date object, get around this. basic idea came from stack overflow after a lot of searching and trial and error
    // toLocate gives a neater date format
    const newGoal = request.body;
    newGoal.Gdate = new Date(request.body.Gdate).toLocaleString('en-gbp');
    newGoal.id = uuid();
    newGoal.date = new Date().toLocaleString('en-gbp');
    newGoal.status = "open";
    newGoal.origin = goalSetter;
    // goal object and member id is sent to MembersStore model to be added to the Members data object 
    members.addGoal(memberId,newGoal);
    
    // depending on where the original call came from, we need to return to that area eg Trainer or member
     if(n < 0) {
    response.redirect('/member/' + memberId);
     } else {
       response.redirect('/trainer_clients/' + trainerId);
     }
    
  },
  
  
  
  
  // goal can only be deleted by the member
  
  deleteGoal(request, response) {
    let memberId = request.params.id;
    const goalId = request.params.goalid;
    logger.debug('Deleting Goal',goalId );
    members.removeGoal2(memberId, goalId);
    response.redirect('/member/' + memberId);
  },
  
  
  
checkPassword(password) {
 return this.password.equals(password);
 },
  
  
  
  
  
  
  
};

module.exports = member;