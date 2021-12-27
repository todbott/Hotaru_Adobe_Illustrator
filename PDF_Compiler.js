// Get the path to save each PDF
var cRtn = app.response ({ 
	cQuestion:"各PDFを保存したいパースを入力してください\n(例　C:\\Users\\Fukuda\\Desktop\\", 
	cTitle:"セーブパース", 
	bPassword:false, 
	cDefault: "C:\\Users\\Fukuda\\Desktop\\", 
	cLabel:"path&name"}); 
if (cRtn && cRtn.length) { 
	var new_path = cRtn; 
} else {
	app.alert("停止になりました。");
} 


var AOneInDesign = 
	[[36.8503937, 1720.629587, 633.5454044, 878.739823],
	 [633.5433071, 1720.629587, 1228.820995, 878.739823],
	 [36.8503937,878.7401575,633.5454044,36.8503937],
	 [633.5433071,878.7401575,1228.820995,36.8503937],
	 [1230.23622,1720.629587,1824.096585,878.739823],
	 [1826.929134,1720.629587,2419.372176,878.739823],
	 [1230.23622,878.7401575,1824.096585,36.8503937],
	 [1826.929134,878.7401575,2419.372176,36.8503937],
	 [36.8503937, 1720.629587, 633.5454044, 878.739823],
	 [633.5433071, 1720.629587, 1228.820995, 878.739823],
	 [36.8503937,878.7401575,633.5454044,36.8503937],
	 [633.5433071,878.7401575,1228.820995,36.8503937],
	 [1230.23622,1720.629587,1824.096585,878.739823],
	 [1826.929134,1720.629587,2419.372176,878.739823],
	 [1230.23622,878.7401575,1824.096585,36.8503937],
	 [1826.929134,878.7401575,2419.372176,36.8503937]]
	
	 
var realPage = 0;

for (var p = 1; p < 17; p++) {
	if (p > 8) { 
		realPage = 1;
	} 
	var that = this.extractPages(realPage, realPage);
	console.println(AOneInDesign[p-1])
	that.setPageBoxes("Crop", 0, 0, AOneInDesign[p-1]);
	that.saveAs(new_path + p + ".pdf")
	that.closeDoc()
	
}

for (var p = 16; p > 0; p--) {
	this.insertPages({
		cPath: new_path + p + ".pdf"
	});
}

this.deletePages(0, 0)
this.deletePages(16, 16)


