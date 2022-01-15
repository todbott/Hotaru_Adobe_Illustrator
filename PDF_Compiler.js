function DialogShower () {

	var goon = 1;
	var choice = "1"

	var dialog = {

		commit:function (dialog) {
		var results = dialog.store();
			if (results["sub1"]) 
			{
				choice = 1;
			}	
			else if (results["sub2"])
			{
				choice = 2;
			}
		},

		cancel: function(dialog) { 
			console.println("Cancel!");
			goon = 0;
		},
 	
		description:
  		{
    		name: "PDF加工ツール",    // Dialog box title
    		elements:
    		[
      			{
        		type: "view",
        		elements:
        		[
				{ 	name: "InDesign", 
					type: "static_text", 
					multiline: "true",
					width: 300,
					height: 25,
				},
        			{
            				type: "radio",
            				item_id: "sub1",
            				group_id: "g1",
            				name: "A1",
            				width: 200,
            				height: 25
        			},
        			{
            				type: "radio",
            				item_id: "sub2",
            				group_id: "g1",
            				name: "A2",
            				width: 200,
            				height: 25
        			},


         			{
   	         			type: "ok_cancel",
       		     			ok_name: "ok",
       		     			cancel_name: "cancel"
       	   			},
       		 	]
      			},
    		]
  		}
	}

	app.execDialog(dialog);
	
	if (goon == 1)
	{
		
		// Set the trim box equal to the art box for all pages,
		// effectively making the trim set to zero
		for (var p = 0; p < this.numPages; p++) {
			this.setPageBoxes("Crop", p, p, this.getPageBox("Media", p));
		}
		
		if (choice == 1) {

			var AOneInDesign = 
				[[38.26771654, 1720.629587, 633.5454044, 878.739823],
				[633.5433071, 1720.629587, 1228.820995, 878.739823],
				[38.26771654, 878.739823, 633.5454044, 36.8503937],
				[633.5433071, 878.739823, 1228.820995, 36.8503937],
				[1228.818898, 1720.629587, 1824.096585, 878.739823],
				[1824.094488, 1720.629587, 2419.372176, 878.739823],
				[1228.818898, 878.739823, 1824.096585, 36.8503937],
				[1824.094488, 878.739823, 2419.372176, 36.8503937],
				[38.26771654, 1720.629587, 633.5454044, 878.739823],
				[633.5433071, 1720.629587, 1228.820995, 878.739823],
				[38.26771654, 878.739823, 633.5454044, 36.8503937],
				[633.5433071, 878.739823, 1228.820995, 36.8503937],
				[1228.818898, 1720.629587, 1824.096585, 878.739823],
				[1824.094488, 1720.629587, 2419.372176, 878.739823],
				[1228.818898, 878.739823, 1824.096585, 36.8503937],
				[1824.094488, 878.739823, 2419.372176, 36.8503937]]
				
				 
			var realPage = 0;

			for (var p = 1; p < 17; p++) {
				if (p > 8) { 
					realPage = 1;
				} 
				var that = this.extractPages(realPage, realPage);
				that.setPageBoxes("Crop", 0, 0, AOneInDesign[p-1]);
				var new_path = fixPath(that.path, p);
				that.saveAs(new_path + p + ".pdf")
				that.closeDoc(true)
			}
			
		

			for (var p = 16; p > 0; p--) {
				this.insertPages({
					cPath: new_path + p + ".pdf"
				});
				
			}

			this.deletePages(0, 0)
			this.deletePages(16, 16)
			
			this.saveAs(this.path.replace(".pdf", "_まとめ.pdf"))

		}
		
		if (choice == 2) {

			var ATwoInDesign = 
				[[36.8503937, 1720.629587, 632.1240157, 878.739823],
				[632.1259843, 1720.629587, 1227.399606, 878.739823],
				[36.8503937, 878.739823, 632.1240157, 36.8503937],
				[632.1259843, 878.739823, 1227.399606, 36.8503937],
				[36.8503937, 1720.629587, 632.1240157, 878.739823],
				[632.1259843, 1720.629587, 1227.399606, 878.739823],
				[36.8503937, 878.739823, 632.1240157, 36.8503937],
				[632.1259843, 878.739823, 1227.399606, 36.8503937]]

				
				 
			var realPage = 0;

			for (var p = 1; p < 9; p++) {
				if (p > 4) { 
					realPage = 1;
				} 
				var that = this.extractPages(realPage, realPage);
				that.setPageBoxes("Crop", 0, 0, ATwoInDesign[p-1]);
				var new_path = fixPath(that.path, p);
				that.saveAs(new_path + p + ".pdf")
				that.closeDoc(true)
			}

			for (var p = 8; p > 0; p--) {
				this.insertPages({
					cPath: new_path + p + ".pdf"
				});
			}

			this.deletePages(0, 0)
			this.deletePages(8, 8)
			
			this.saveAs(this.path.replace(".pdf", "_まとめ.pdf"))

		}
		
	}
}

function fixPath(path, p) {
	var new_path_no_colon = path.split("/").slice(1, path.split("/").length-1)
	new_path_no_colon[0] = new_path_no_colon[0] + ":"
	return new_path_no_colon.join("\\") + "\\"
}

DialogShower()

