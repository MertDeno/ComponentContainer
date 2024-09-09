/*global QUnit*/

sap.ui.define([
	"parentapp/parentapp/controller/ParentView.controller"
], function (Controller) {
	"use strict";

	QUnit.module("ParentView Controller");

	QUnit.test("I should test the ParentView controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
