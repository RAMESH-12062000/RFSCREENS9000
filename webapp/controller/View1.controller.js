sap.ui.define([
    "sap/ui/Device",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/export/library",
    "sap/ui/export/Spreadsheet",
    "sap/ui/core/Fragment",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/m/Popover",
    "sap/m/Text",
    "sap/m/Label",
    "sap/ui/core/UIComponent"

],
    function (Device, Controller, JSONModel, MessageToast, MessageBox, Filter, FilterOperator, exportLibrary, Spreadsheet, Fragment, ODataMode, Popover, Text, Label, UIComponent) {
        "use strict";

        return Controller.extend("com.app.rfscreens.controller.View1", {
            onInit: function () {
                var oModel = new JSONModel(sap.ui.require.toUrl("com/app/rfscreens/model/data.json"));
                this.getView().setModel(oModel);
                this._setToggleButtonTooltip(!Device.system.desktop);

                //stored colours applying...
                this.applyStoredColors();
            },

            onItemSelect: function (oEvent) {
                var oItem = oEvent.getParameter("item");
                this.byId("pageContainer").to(this.getView().createId(oItem.getKey()));
            },

            handleUserNamePress: function (event) {
                var oPopover = new Popover({
                    showHeader: false,
                    placement: PlacementType.Bottom,
                    content: [
                        new Button({
                            text: 'Feedback',
                            type: ButtonType.Transparent
                        }),
                        new Button({
                            text: 'Help',
                            type: ButtonType.Transparent
                        }),
                        new Button({
                            text: 'Logout',
                            type: ButtonType.Transparent
                        })
                    ]
                }).addStyleClass('sapMOTAPopover sapTntToolHeaderPopover');

                oPopover.openBy(event.getSource());
            },

            onSideNavButtonPress: function () {
                var oToolPage = this.byId("toolPage");
                var bSideExpanded = oToolPage.getSideExpanded();

                this._setToggleButtonTooltip(bSideExpanded);

                oToolPage.setSideExpanded(!oToolPage.getSideExpanded());
            },

            _setToggleButtonTooltip: function (bLarge) {
                var oToggleButton = this.byId('sideNavigationToggleButton');
                if (bLarge) {
                    oToggleButton.setTooltip('Large Size Navigation');
                } else {
                    oToggleButton.setTooltip('Small Size Navigation');
                }
            },
            onApprovePress: function () {
                const oUserView = this.getView();

                // Get the form inputs
                var sEmployeeID = this.byId("idEmppInput").getValue();
                var sResourceName = this.byId("idNameInput").getValue();
                var oAreaSelect = this.byId("_IDAreaSelect");
                var sPhone = this.byId("idPhoneInput").getValue();
                var oEmail = this.byId("idEmailInput").getValue();
                var oGroupComboBox = this.byId("_IDGenComboBoxGroup");
                var oQueueComboBox = this.byId("_IDGenComboBox10");

                var bValid = true;
                var bAllFieldsFilled = true;

                // Validate Employee ID
                if (!sEmployeeID) {
                    this.byId("idEmppInput").setValueState("Error");
                    this.byId("idEmppInput").setValueStateText("Employee ID is mandatory");
                    bValid = false;
                    bAllFieldsFilled = false;
                } else if (!/^\d{6}$/.test(sEmployeeID)) {
                    this.byId("idEmppInput").setValueState("Error");
                    this.byId("idEmppInput").setValueStateText("Employee ID must be a 6-digit numeric value");
                    bValid = false;
                } else {
                    this.byId("idEmppInput").setValueState("None");
                    this.byId("idEmppInput").setValueStateText(""); // Clear the value state text
                }

                // Validate Resource Name
                if (!sResourceName) {
                    this.byId("idNameInput").setValueState("Error");
                    this.byId("idNameInput").setValueStateText("Name is mandatory");
                    bValid = false;
                    bAllFieldsFilled = false;
                } else if (sResourceName.length < 4) {
                    this.byId("idNameInput").setValueState("Error");
                    this.byId("idNameInput").setValueStateText("Name must be at least 4 characters long");
                    bValid = false;
                } else {
                    this.byId("idNameInput").setValueState("None");
                    this.byId("idNameInput").setValueStateText(""); // Clear the value state text
                }

                // Validate Area Selection
                if (!oAreaSelect.getSelectedKey()) {
                    oAreaSelect.setValueState("Error");
                    oAreaSelect.setValueStateText("Process Area is mandatory");
                    bValid = false;
                    bAllFieldsFilled = false;
                } else {
                    oAreaSelect.setValueState("None");
                    oAreaSelect.setValueStateText(""); // Clear the value state text
                }

                // Validate Phone Number
                if (!sPhone) {
                    this.byId("idPhoneInput").setValueState("Error");
                    this.byId("idPhoneInput").setValueStateText("Phone number is mandatory");
                    bValid = false;
                    bAllFieldsFilled = false;
                } else if (sPhone.length !== 10 || !/^\d+$/.test(sPhone)) {
                    this.byId("idPhoneInput").setValueState("Error");
                    this.byId("idPhoneInput").setValueStateText("Phone number must be exactly 10 digits");
                    bValid = false;
                } else {
                    this.byId("idPhoneInput").setValueState("None");
                    this.byId("idPhoneInput").setValueStateText(""); // Clear the value state text
                }

                // Validate Email
                if (oEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(oEmail)) {
                    this.byId("idEmailInput").setValueState("Error");
                    this.byId("idEmailInput").setValueStateText("Please enter a valid email address");
                    bValid = false;
                } else {
                    this.byId("idEmailInput").setValueState("None");
                    this.byId("idEmailInput").setValueStateText(""); // Clear the value state text
                }

                // Validate Group ComboBox
                if (!oGroupComboBox.getSelectedKey()) {
                    oGroupComboBox.setValueState("Error");
                    oGroupComboBox.setValueStateText("Process Group is mandatory");
                    bValid = false;
                    bAllFieldsFilled = false;
                } else {
                    oGroupComboBox.setValueState("None");
                    oGroupComboBox.setValueStateText(""); // Clear the value state text
                }

                // Validate Queue ComboBox
                if (!oQueueComboBox.getSelectedKey()) {
                    oQueueComboBox.setValueState("Error");
                    oQueueComboBox.setValueStateText("Queue is mandatory");
                    bValid = false;
                    bAllFieldsFilled = false;
                } else {
                    oQueueComboBox.setValueState("None");
                    oQueueComboBox.setValueStateText(""); // Clear the value state text
                }

                // Show a message if any required field is empty
                if (!bAllFieldsFilled) {
                    sap.m.MessageToast.show("Please fill all mandatory details.");
                    return; // Exit the function if any field is empty
                }

                // Show a message if there are validation errors
                if (!bValid) {
                    sap.m.MessageToast.show("Please fill in the correct data.");
                    return; // Exit the function if validation fails
                }

                // Show success message if everything is valid
                sap.m.MessageToast.show("Validation successful!");

                // Optionally clear the form
                oUserView.byId("idEmppInput").setValue("");
                oUserView.byId("idNameInput").setValue("");
                oUserView.byId("idPhoneInput").setValue("");
                oUserView.byId("idEmailInput").setValue("");
                oUserView.byId("_IDAreaSelect").setSelectedKey("");
                oUserView.byId("_IDGenComboBoxGroup").setSelectedKey("");
                oUserView.byId("_IDGenComboBox10").setSelectedKey("");
            },
            onApproveUserRequest: function () {
                const oView = this.getView();
                const oTable = oView.byId("idRequestedData");
                const oSelectedItem = oTable.getSelectedItem();

                // Check if a row is selected
                if (!oSelectedItem) {
                    sap.m.MessageBox.error("Please select a record from the table.");
                    return;
                }

                // Retrieve data from the selected item
                const oSelectedContext = oSelectedItem.getBindingContext();
                const oSelectedData = oSelectedContext.getObject();

                // Proceed with the approval process
                // For example, you might want to pass `oSelectedData` to an API or further processing
                // For demonstration, just show a success message
                sap.m.MessageToast.show("Record approved successfully!");

                // Optionally, you can perform additional actions, such as updating the backend, refreshing the table, etc.
            },

            onAddNewProcessArea: function () {
                this.getView().byId("idAddNewArea").setVisible(false);
                this.getView().byId("idDialogBox").setVisible(false);
                this.getView().byId("_IDGenHBox11").setVisible(false);
                this.getView().byId("_IDField1").setVisible(false);
                this.getView().byId("_IDField4").setVisible(false);
                this.getView().byId("_IDField3").setVisible(false);
                this.getView().byId("_IDField36").setVisible(false);
                this.getView().byId("_IDField2").setVisible(false);
                this.getView().byId("_IDAreaSelect").setVisible(false);
                this.getView().byId("_IDAreaSelect").setVisible(false);
                this.getView().byId("_IDField33").setVisible(false);
                this.getView().byId("_IDField34").setVisible(false);
                this.getView().byId("_IDGenComboBox10").setVisible(false);

                this.getView().byId("_IDGenComboBox11").setVisible(false);
                this.getView().byId("_IDField6").setVisible(false);
                this.getView().byId("idEmptyRow").setVisible(false);
                this.getView().byId("idAddingNewProcessAreaTable").setVisible(true);

            },

            onNewProcessBackBtnPress: function () {
                this.getView().byId("idAddNewArea").setVisible(true);
                this.getView().byId("idDialogBox").setVisible(true);
                this.getView().byId("_IDGenHBox11").setVisible(true);
                this.getView().byId("_IDField1").setVisible(true);
                this.getView().byId("_IDField4").setVisible(true)
                this.getView().byId("_IDField3").setVisible(true);
                this.getView().byId("_IDField36").setVisible(true);
                this.getView().byId("_IDField2").setVisible(true);
                this.getView().byId("_IDAreaSelect").setVisible(true);
                this.getView().byId("_IDAreaSelect").setVisible(true);
                this.getView().byId("_IDField33").setVisible(true);
                this.getView().byId("_IDField34").setVisible(true);
                this.getView().byId("_IDGenComboBox10").setVisible(true);

                this.getView().byId("_IDGenComboBox11").setVisible(true);
                this.getView().byId("_IDField6").setVisible(true);
                this.getView().byId("idEmptyRow").setVisible(true);
                this.getView().byId("idAddingNewProcessAreaTable").setVisible(false);
            },
            OnPressHUQuery: function () {
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("HUQuerypage");
            },





            applyStoredColors: function () {
                // Apply stored theme color
                var sStoredThemeColor = localStorage.getItem("themeColor");
                if (sStoredThemeColor) {
                    this.applyThemeColor(sStoredThemeColor);
                }

                // Apply stored tile colors
                var storedColors = localStorage.getItem("tileColors");
                if (storedColors) {
                    var tileColors = JSON.parse(storedColors);
                    for (var sTileId in tileColors) {
                        if (tileColors.hasOwnProperty(sTileId)) {
                            this.applyColorToTile(sTileId, tileColors[sTileId]);
                        }
                    }
                }
            },
            onOpenThemeDialog: function () {
                this.byId("themeTileDialog").open();
            },

            onPaletteIconBtnTilePress: function (oEvent) {
                this._currentTileId = oEvent.getSource().getParent().getParent().getId();
                this.byId("themeTileDialog").open();
            },

            // onColorOptionSelect: function (oEvent) {
            //     var oCheckBox = oEvent.getSource();
            //     var oColorOptions = this.byId("colorOptions").getItems();
            //     var selectedCount = 0;

            //     oColorOptions.forEach(function (oItem) {
            //         if (oItem instanceof sap.m.CheckBox && oItem.getSelected()) {
            //             selectedCount++;
            //         }
            //     });

            //     if (selectedCount > 1) {
            //         sap.m.MessageToast.show("You can only select one color.");
            //         oCheckBox.setSelected(false);
            //     } else {
            //         // Disable the color picker if a checkbox is selected
            //         this.byId("colorPicker").setEnabled(false);
            //     }
            // },

            // onApplyColor: function () {
            //     var oView = this.getView();
            //     var oColorPicker = oView.byId("colorPicker");
            //     var sColor = oColorPicker.getColorString();
            //     var aSelectedColors = [];
            //     var oColorOptions = this.byId("colorOptions").getItems();

            //     oColorOptions.forEach(function (oItem) {
            //         if (oItem instanceof sap.m.CheckBox && oItem.getSelected()) {
            //             var sColorValue = oItem.data("value");
            //             aSelectedColors.push(sColorValue);
            //         }
            //     });

            //     if (aSelectedColors.length > 0) {
            //         // Apply the selected colors from checkboxes
            //         aSelectedColors.forEach(function (sSelectedColor) {
            //             if (this._currentTileId) {
            //                 this.applyColorToTile(this._currentTileId, sSelectedColor);
            //             } else {
            //                 this.applyThemeColor(sSelectedColor);
            //             }
            //         }, this);
            //     } else if (this._isValidColor(sColor)) {
            //         // Apply the color from the color picker
            //         if (this._currentTileId) {
            //             this.applyColorToTile(this._currentTileId, sColor);
            //         } else {
            //             this.applyThemeColor(sColor);
            //         }
            //     } else {
            //         sap.m.MessageToast.show("Invalid color format. Please use a valid color code.");
            //     }

            //     this.byId("themeTileDialog").close();
            // },
            // onApplyColor: function () {
            //     var oView = this.getView();
            //     var oColorPicker = oView.byId("colorPicker");
            //     var sColorPickerValue = oColorPicker.getColorString();
            //     var aSelectedColors = [];
            //     var oColorOptions = this.byId("colorOptions").getItems();

            //     // Collect selected colors from checkboxes
            //     oColorOptions.forEach(function (oItem) {
            //         if (oItem instanceof sap.m.CheckBox && oItem.getSelected()) {
            //             var sColorValue = oItem.data("value");
            //             aSelectedColors.push(sColorValue);
            //         }
            //     });

            //     // Handle cases where a checkbox is selected
            //     if (aSelectedColors.length > 0) {
            //         if (oColorPicker.getVisible()) {
            //             // If the color picker is visible while a checkbox is selected, raise an error
            //             sap.m.MessageToast.show("Please deselect the checkbox before using the custom color picker.");
            //             return; // Exit the function without applying the color
            //         }

            //         var sSelectedColor = aSelectedColors[0]; // Only one color is allowed
            //         if (this._currentTileId) {
            //             this.applyColorToTile(this._currentTileId, sSelectedColor);
            //             this._currentTileId = null; // Clear the current tile ID
            //         } else {
            //             this.applyThemeColor(sSelectedColor);
            //         }
            //     } else if (this._isValidColor(sColorPickerValue)) {
            //         // If no checkbox is selected, apply the color from the color picker
            //         if (this._currentTileId) {
            //             this.applyColorToTile(this._currentTileId, sColorPickerValue);
            //             this._currentTileId = null; // Clear the current tile ID
            //         } else {
            //             this.applyThemeColor(sColorPickerValue);
            //         }
            //     } else {
            //         sap.m.MessageToast.show("Invalid color format. Please use a valid color code.");
            //     }

            //     // Close the dialog
            //     this.byId("themeTileDialog").close();
            // },
            onApplyColor: function () {
                var oView = this.getView();
                var oColorPicker = oView.byId("colorPicker");
                var sColorPickerValue = oColorPicker.getColorString();
                var aSelectedColors = [];
                var oColorOptions = this.byId("colorOptions").getItems();

                // Collect selected colors from checkboxes
                oColorOptions.forEach(function (oItem) {
                    if (oItem instanceof sap.m.CheckBox && oItem.getSelected()) {
                        var sColorValue = oItem.getCustomData()[0].getValue(); // Get the color from custom data
                        aSelectedColors.push(sColorValue);
                    }
                });

                // Handle cases where checkboxes are selected
                if (aSelectedColors.length > 0) {
                    if (aSelectedColors.length > 1) {
                        // If more than one checkbox is selected, raise an error
                        sap.m.MessageToast.show("You can only select one color.");
                        return; // Exit the function without applying the color
                    }

                    if (oColorPicker.getVisible()) {
                        // If the color picker is visible while a checkbox is selected, raise an error
                        sap.m.MessageToast.show("Please deselect the checkbox before using the custom color picker.");
                        return; // Exit the function without applying the color
                    }

                    var sSelectedColor = aSelectedColors[0]; // Only one color is allowed from checkboxes
                    if (this._currentTileId) {
                        this.applyColorToTile(this._currentTileId, sSelectedColor);
                        sap.m.MessageToast.show("Tile color applied successfully!");
                        this._currentTileId = null; // Clear the current tile ID
                    } else {
                        this.applyThemeColor(sSelectedColor);
                        sap.m.MessageToast.show("Theme color applied successfully!");
                    }
                } else if (this._isValidColor(sColorPickerValue)) {
                    // If no checkbox is selected, apply the color from the color picker
                    if (this._currentTileId) {
                        this.applyColorToTile(this._currentTileId, sColorPickerValue);
                        sap.m.MessageToast.show("Tile color applied successfully!");
                        this._currentTileId = null; // Clear the current tile ID
                    } else {
                        this.applyThemeColor(sColorPickerValue);
                        sap.m.MessageToast.show("Theme color applied successfully!");
                    }
                } else {
                    sap.m.MessageToast.show("Invalid color format. Please use a valid color code.");
                }
                //reset dailog and closed...
                this.resetDialogBox();
                this.byId("themeTileDialog").close();

            },
            //Options for selecting colours from top in dailog...(chnage="onColorOptionSelect")
            onColorOptionSelect: function (oEvent) {
                var oSelectedCheckBox = oEvent.getSource();
                var oColorOptions = this.byId("colorOptions").getItems();

                // Deselect all other checkboxes except the currently selected one
                oColorOptions.forEach(function (oItem) {
                    if (oItem instanceof sap.m.CheckBox && oItem !== oSelectedCheckBox) {
                        oItem.setSelected(false);
                    }
                });

                // Show or hide the color picker based on the checkbox selection
                this.byId("colorPicker").setVisible(!oSelectedCheckBox.getSelected());
            },
            applyThemeColor: function (sColor) {
                var aElements = [
                    this.byId("toolPage"),
                    this.byId("idSideNavigation"),
                    this.byId("idtntToolHeader"),
                    this.byId("pageContainer")
                ];

                // Remove any existing style element for the theme
                var sStyleId = "customThemeStyle";
                var oOldStyle = document.getElementById(sStyleId);
                if (oOldStyle) {
                    oOldStyle.remove();
                }

                // Create a new style element and apply the color
                var oStyle = document.createElement("style");
                oStyle.id = sStyleId;
                oStyle.textContent = ".customTheme { background-color: " + sColor + " !important; }";
                document.head.appendChild(oStyle);

                // Add the custom theme class to the elements
                aElements.forEach(function (oElement) {
                    if (oElement) {
                        oElement.addStyleClass("customTheme");
                    }
                });

                // Store the selected theme color in local storage
                localStorage.setItem("themeColor", sColor);
            },
            applyColorToTile: function (sTileId, sColor) {
                var oTile = this.byId(sTileId);

                if (oTile) {
                    var sTileColorClass = "tileColor_" + sTileId;

                    // Remove the old color class if it exists
                    oTile.removeStyleClass(sTileColorClass);

                    // Create or update the style element
                    var oStyleElement = document.getElementById(sTileColorClass);
                    if (!oStyleElement) {
                        oStyleElement = document.createElement("style");
                        oStyleElement.id = sTileColorClass;
                        document.head.appendChild(oStyleElement);
                    }
                    oStyleElement.textContent = "#" + sTileId + " { background-color: " + sColor + " !important; }";

                    // Apply the new color class to the tile
                    oTile.addStyleClass(sTileColorClass);

                    // Retrieve and update the color storage
                    var tileColors = {};
                    try {
                        var storedColors = localStorage.getItem("tileColors");
                        if (storedColors) {
                            tileColors = JSON.parse(storedColors);
                        }
                    } catch (e) {
                        console.error("Failed to parse tile colors from localStorage:", e);
                    }

                    // Update the tile color in localStorage
                    tileColors[sTileId] = sColor;
                    localStorage.setItem("tileColors", JSON.stringify(tileColors));

                    // Clear the tile ID after applying the color
                    this._currentTileId = null;
                }
            },
            _isValidColor: function (sColor) {
                var hexRegex = /^#([0-9A-Fa-f]{3}){1,2}$/;
                var rgbRegex = /^rgb\(\d{1,3},\d{1,3},\d{1,3}\)$/;
                return hexRegex.test(sColor) || rgbRegex.test(sColor);
            },
            onCancelColorDialog: function () {
                this.byId("themeTileDialog").close();
                this.resetDialogBox();
            },
            //Reset DialogBox and clearing all Checkboxs it opens freshly...
            resetDialogBox: function () {
                var oView = this.getView();
                var oColorPicker = oView.byId("colorPicker");
                var oColorOptions = this.byId("colorOptions").getItems();

                // Deselect all checkboxes
                oColorOptions.forEach(function (oItem) {
                    if (oItem instanceof sap.m.CheckBox) {
                        oItem.setSelected(false);
                    }
                });
                // Reset the color picker to its default value
                oColorPicker.setColorString("#FFFFFF"); // Set to white or any default color
                oColorPicker.setVisible(true);
            }





        });
    });
