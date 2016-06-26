#!/usr/bin/env node

var app = require('../app');
app.start(() => {
    console.log('app started');
});