// This file is created by egg-ts-helper@1.34.7
// Do not modify this file!!!!!!!!!
/* eslint-disable */

import 'egg';
import ExportDebox = require('../../../app/controller/debox');
import ExportHome = require('../../../app/controller/home');

declare module 'egg' {
  interface IController {
    debox: ExportDebox;
    home: ExportHome;
  }
}
