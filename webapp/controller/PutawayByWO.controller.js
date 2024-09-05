sap.ui.define(
  [
    "sap/ui/core/mvc/Controller"
  ],
  function (BaseController) {
    "use strict";

    return BaseController.extend("com.app.rfscreens.controller.PutawayByWO", {
      onInit: function () {
      },
      onBackPress: function () {
        // Hide the ScrollContainer
        this.byId("idPage2").setVisible(false);

        // Show the warehouse order input section again
        this.byId("idWarehouseOderNoformBox").setVisible(true);
      },
      onBackPressPage2: function () {
        // Hide the ScrollContainer
        this.byId("idPage2").setVisible(false);

        // Show the warehouse order input section again
        this.byId("idWarehouseOderNoformBox").setVisible(true);
      },
      onAfterRendering: function () {
        // Initially hide the scroll container
        this.byId("idPage2").setVisible(false);
      },
      onSubmitPress: function () {
        // Get the form VBox and scroll container by their IDs
        var oVBoxForm = this.byId("idWarehouseOderNoformBox");
        var oScrollContainer = this.byId("idPage2");

        // Hide the form VBox
        oVBoxForm.setVisible(false);

        // Show the scroll container
        oScrollContainer.setVisible(true);
      },
      onPressHUList: function(){
        var oVBoxForm = this.byId("idWarehouseOderNoformBox");
        var oScrollContainer = this.byId("idPage2");
        var oScrollContainer1 = this.byId("idPage3HUList");

        // Hide the form VBox
        oVBoxForm.setVisible(false);
        oScrollContainer.setVisible(false);

        // Show the scroll container
        oScrollContainer1.setVisible(true);
      }

    });
  }
);
