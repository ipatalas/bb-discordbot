/// <reference path="../typings/index.d.ts" />

import { BarType, ClassA } from "./package";
import * as express from "express";

var t: BarType;
var test: ClassA = new ClassA("test");

var app = express();

console.log(`Test message - ${test.name}`);