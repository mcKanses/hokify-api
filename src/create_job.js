const Swagger = require('swagger-client');
const spec = require('../swagger.json');

(async () => {
  const client = await new Swagger({
    spec,
    usePromise: true
  });

  client.clientAuthorizations.add(
    'JOB_API_BASIC',
    new Swagger.PasswordAuthorization('<MANDATOR_ID>', '<MANDATOR_TOKEN>')
  );

  const loginResponse = await client.authentication.Token();
  console.log('loginResponse', loginResponse.obj);

  client.clientAuthorizations.add(
    'JOB_API_BEARER',
    new Swagger.ApiKeyAuthorization(
      'Authorization',
      'Bearer ' + loginResponse.obj.access_token,
      'header'
    )
  );

  const job = {
    name: 'Senior Software Engineer',
    wage: 'Gehalt',
    isPublished: false,
    type: '55d74e5d365315e629446d54', //Vollzeit
    fields: [
      '56e05efd14fcd6fe094b443a' //Software development
    ],
    address: 'Lagergasse 2, 1030 Wien',
    contactEmail: 'api@hokify.com',
    company: 'Hokify',
    requiredFields: [
      'document:recommendation',
      'education',
      {
        type: 'OPEN_QUESTION',
        question: 'What is your favorite color?',
        questiontype: 'color',
        answerMinLength: 10,
        answerMaxLength: 150
      },
      {
        type: 'ADDRESS'
      },
      {
        type: 'DATE',
        question: 'When can you get started?',
        questiontype: 'start date',
        monthYearOnly: false,
        daterange: 'future'
      },
      {
        type: 'DISTANCEHOME',
        maxdistance: 30
      },
      {
        type: 'EDUCATIONLEVEL',
        level: '582c3c27ff4c0b3709894115' // Matura
      },
      {
        type: 'JOBLEVEL',
        mainfield: '56e05f0114fcd6fe094b443b', // Web Entwicklung
        yearsexperience: 5
      },
      {
        type: 'MULTIPLE_CHOICE',
        question: 'With which tools/frameworks have you worked so far?',
        shortquestion: 'tools',
        selectablevalues: 'Swagger;Webstorm;Webpack;Vue.js'
      },
      {
        type: 'RANGE',
        question: 'How many hours per week can you work?',
        shortquestion: 'hours per week',
        unit: 'hours/week',
        defaultValue: 40,
        minValue: 15,
        maxValue: 60,
        steps: 5
      },
      {
        type: 'SINGLE_CHOICE',
        question: 'What is the BEST programming language?',
        shortquestion: 'programming language',
        selectablevalues: 'VBA;PHP;ABAP;Fortran'
      },
      {
        type: 'YES_NO',
        question: 'Are you comfortable with having fun during work time?',
        shortquestion: 'fun'
      }
    ],
    descriptionHTML:
      '<p>JavaScript ist deine Muttersprache? </p>' +
      '<p>Worauf wartest du?!</p>' +
      '<h1>Bewirb dich jetzt und erweitere unsere Schnittstelle für unsere besten Kunden</h1>',
    region: 'at'
  };

  let jobResponse = await client.job.CreateOrUpdateJob({
    body: {
      sourceId: '420',
      params: job,
      lang: 'de'
    }
  });

  console.log('jobResponse', jobResponse.obj);

  const { _id: jobId, webPreviewUrl } = jobResponse.obj.job;

  console.log('previewUrl', webPreviewUrl);
  console.log('id', jobId);

  const publishJobResponse = await client.job.CreateOrUpdateJob({
    body: {
      sourceId: '420',
      params: {
        ...job,
        jobId,
        isPublished: true
      },
      lang: 'de'
    }
  });

  console.log('publishJobResponse', publishJobResponse.obj);
})().catch(err => console.log('something went wrong', err));
