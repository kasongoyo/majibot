require('dotenv-extended').load();

require('./connectorSetup')();
require('./utils.js')();


require('./dialogs/selectLocale')();
require('./dialogs/submitProblem')();
require('./dialogs/submitPhone')();


/*
require('./dialogs/checkProblems.js')();
require('./dialogs/checkMyBill.js')();
*/


// Global actions
bot.endConversationAction('goodbye', 'Goodbye :)', { matches: /^cancel/i });
bot.beginDialogAction('help', '/help', { matches: /^help/i });
bot.beginDialogAction('language', '/selectLocale', { matches: /^language/i });
bot.beginDialogAction('phone', '/submitPhone', { matches: /^phone/i });
bot.beginDialogAction('submitProblem', '/submitProblem');

// Entry point of the bot
bot.dialog('/', [
  (session) => {
    session.replaceDialog('/promptButtons');
  }
]);

bot.dialog('/promptButtons', [
  (session, args, next) => {
    let choices = session.localizer.gettext(session.preferredLocale(), 'InitialPromptOptions');
    builder.Prompts.choice(session, 'InitialPrompt', choices, { 'listStyle': 3 });
  },
  (session, results, next) => {
    if (results.response) {
      // This works but it's hard when we have dynamic choices since it won't be easy to track index
      // index of every choices
      let selection = results.response.index;

      // route to corresponding dialogs

      switch (selection) {
        case 0:
          session.replaceDialog('/submitProblem');
          break;
        case 1:
          session.reset('/submitPhone');
          break;
        case 2:
          session.reset('/selectLocale');
          break;
        default:
          session.reset('/');
          break;
      }
    }
  }
]);

// bot.dialog('/promptButtons', [
//   (session, args, next) => {
//     let options =
//       session.localizer.gettext(session.preferredLocale(), 'InitialPromptOptions').split(/\|/);
//     let choices = [];
//     options.forEach((current, index) => {
//       // This style allow dynamic choices but it has limitation on the message shown 
//       // to user when they select option, it shows value instead of title, try it with emulator
//       choices.push({ value: `${index}`, action: { title: current } })
//     });
//     //Samples choices as the result of the forEach loop above
//     // const choices = [
//     //   { value: '0', action: { title: 'Submit problem' } },
//     //   { value: '1', action: { title: 'Change phone number' } }
//     // ]
//     builder.Prompts.choice(session, 'InitialPrompt', choices, { 'listStyle': 3 });
//   },
//   (session, results, next) => {
//     if (results.response) {
//       let selection = results.response.entity;

//       // route to corresponding dialogs

//       switch (selection) {
//         case '0':
//           session.replaceDialog('/submitProblem');
//           break;
//         case '1':
//           session.reset('/submitPhone');
//           break;
//         case '2':
//           session.reset('/selectLocale');
//           break;
//         default:
//           session.reset('/');
//           break;
//       }
//     }
//   }
// ]);

bot.dialog('/help', [
  function (session) {
    session.endDialog('HelpMessage');
  }
]);