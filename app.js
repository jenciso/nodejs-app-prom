const express = require('express');
const promMid = require('express-prometheus-middleware');
const app = express();
const PORT = 3000;

app.use(promMid({
 metricsPath: '/metrics',
 collectDefaultMetrics: true,
 requestDurationBuckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1.0, 2.5, 5.0, 10.0, 30.0, 60.0],
}));

app.get('/', (req, res) => {
 console.log('GET /');
 res.send("");
});
app.get('/fakeDelay', function(req,res){
    let ms = req.query.t;
    ms = (ms>5000 || isNaN(ms)) ? 1000 : parseInt(ms);
    setTimeout((()=> res.status(200).send({delay:ms})), ms);
});
app.get('/hello', (req, res) => {
 const { name = 'you' } = req.query;
 res.json({ message: `Hello, ${name}!` });
 console.log('GET /hello');
});
app.get('/hi', (req, res) => {
 const { name = 'you' } = req.query;
 res.json({ message: `Hi, ${name}!` });
 console.log('GET /hi');
});
app.get('/upload', function(req,res){
    let ms = req.query.ms;
    let code = req.query.code;
    if(isNaN(ms)){
        ms = 0
    }
    if(isNaN(code)){
        code = 200
    }
    ms = (ms<10 || ms>60000) ? 0 : parseInt(ms);
    code = (code<200 || code>599) ? 200 : parseInt(code);
    setTimeout((()=> res.status(code).send({delay:ms})), ms);
});

app.listen(PORT, () => {
 console.log(`App listening at http://0.0.0.0:${PORT}`);
});

process.on('SIGINT', function() {
  console.log( "\nGracefully shutting down from SIGINT (Ctrl-C)" );
  // some other closing procedures go here
  process.exit(0);
});
