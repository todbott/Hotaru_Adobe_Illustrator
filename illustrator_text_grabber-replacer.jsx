#target illustrator



function dialog () {
    var box = new Window('dialog', "抽出か・入力か");   

    box.export_panel = box.add('panel', undefined);
    box.export_panel.add('statictext', undefined, '逆引ヘルパーを使う前に、');
    PDF_or_AI_export = box.export_panel.add('dropdownlist', undefined);
    PDF_or_AI_export.add('item', 'PDF ファイルの文章を全て抽出');
    PDF_or_AI_export.add('item', ' *.ai 又は *.eps ファイルの各テキストフレームの内容を全て抽出');
    box.export_panel.orientation = 'row';
    
    eccsport = box.export_panel.add('button', undefined, '抽出', {name: 'export'});
    
    box.import_panel = box.add('panel', undefined);
    box.import_panel.add('statictext', undefined, '翻訳が終わってから、');
    PDF_or_AI_import = box.import_panel.add('dropdownlist', undefined);
    PDF_or_AI_import.add('item', '訳文をPDFに差し替える');
    PDF_or_AI_import.add('item', '訳文を元の *.ai 又は *.eps ファイルに差し替える');
    box.import_panel.orientation = 'row';
    
    innport = box.import_panel.add('button', undefined, '入力', {name: 'import'});
    
    box.size = [750, 420];
    box.margins = 5;
    box.alignment = 'top';
    
    box.close_panel = box.add('panel', undefined);
    close = box.close_panel.add('button', undefined, 'キャンセル', {name: 'cancel'});




    eccsport.onClick = function () {
        box.close();
        if (String(PDF_or_AI_export.selection) == "PDF ファイルの文章を全て抽出") {
            exportPDF_function();
            }
        if (String(PDF_or_AI_export.selection) == "*.ai 又は *.eps ファイルの各テキストフレームの内容を全て抽出" ) {
            exportAI_function();
            }
        }
    
    innport.onClick = function () {
        box.close();
        if (String(PDF_or_AI_import.selection) == "新しい作られた訳文をPDFに差し替える" ) {
            importPDF_function();
            }
        if (String(PDF_or_AI_import.selection) == "訳文を元の *.ai 又は *.eps ファイルに差し替える" ) {
            importAI_function();
            }
        }
    
    close.onClick = function () {
        box.close(3);
        }
    
    var choice = box.show ();
    if (choice == 3 ) end();
}


dialog();







// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// script.name = AI_openMultiPagePDF_CS4_CS5_v1.02.jsx; 
// script.description = opens a multipage PDF;
// script.required = requires CS4 or later
// script.parent = CarlosCanto // 01/07/12;  v1.2-01/15/12
// script.elegant = false;

// Notes: I didn't try opening a ridiculous amount of pages, I "only" open 35 pages....in about a minute and a half.
// 		Use with caution, save everything before running, script is memory intensive...

// Lion fix by John Hawkinson 01/15/12
// 螢印刷のための調整が、2018/11/29 に行われました（担当者はトッド）

//----------------------- START UI CODE, create user interface
var win = new Window ("dialog", "複数ページのＰＤＦを開く");

var fileGroup = win.add("group"); // this is the group on the left, it holds the File button and the Font label note

var btnFile = fileGroup.add("button", undefined, "ファイル"); // button to select the PDF to open
var lblFonts = fileGroup.add("statictext",undefined,"一声かけて\n品質確保。", {multiline:true}); // 

var grpRight = win.add("group"); // group on the right, to hold everything else
var txtFile = grpRight.add("edittext",undefined); // to hold selected PDF file path

var grpPanel = grpRight.add("group"); 
var pagesPanel = grpPanel.add("panel", undefined, "ページ");
var lblFrom = pagesPanel.add("statictext",undefined,"スタートページ:");
var txtFrom = pagesPanel.add("edittext",undefined, 1); 
var lblTo = pagesPanel.add("statictext",undefined,"最後のページ:");
var txtTo = pagesPanel.add("edittext",undefined, 1); 

var btnGroup = grpPanel.add("group");
var btnOk = btnGroup.add("button", undefined, "オープン");
var btnCancel = btnGroup.add("button", undefined, "キャンセル");

var lblStatus = grpRight.add("statictext",undefined,"ほんの少しの気遣いで、なくなるミスと得る信頼!");

win.orientation = pagesPanel.orientation = "row"; // two items fileGroup and grpRight
win.alignChildren = "right";
fileGroup.orientation = "column";
fileGroup.alignment = "top";
txtFile.alignment = ["fill","top"];	
lblStatus.alignment = "left";

grpRight.orientation = "column";
btnGroup.orientation = "column";
btnOk.enabled = false; // disable this button until a valid file is supplied

txtFrom.characters = txtTo.characters = 3;
btnFile.active = true; // receive the first "Enter"

win.helpTip = "\u00A9 2012 Carlos Canto"; 
grpRight.helpTip = "最大に出来るページ数は１００";


//------------------------ get the PDF file
btnFile.onClick = function(){
	txtFile.text = ""; // clear previous File path if any
	btnOk.enabled = false; // disable the Ok button
	var fileRef = File.openDialog ("PDF を選んでください", "*.pdf"); // get the file
	fileRef = new File(fileRef.fsName.replace("file://","")); // Lion fix by John Hawkinson
	if(fileRef!= null && fileRef.exists) // check if it is valid file, it should be, unless after clicking a file, the name gets edited
		{
			txtFile.text = fileRef.fsName; // show the file Path here
			btnOk.enabled = true; // enable the Ok button
			txtTo.active = true; // move focus to change the last page to open
		}
 }

//------------------------ 
btnOk.onClick = function(){
	doSomething(); // call main function.
	win.close(); // close when done
}

btnCancel.onClick = function(){
    end();
    win.close();
}

//------------------------ on leaving this text, check again if file exist, in case file path is typed instead of clicking the File...button
txtFile.onDeactivate = function(){
	//alert("on deactivate")
	var file = File(txtFile.text); // create a file based on the text edit control
	if (file.exists){ // and chekc for existance, if it does
		btnOk.enabled = true; // enable the Ok button
	}
	else { // if it does not exist
		btnOk.enabled = false; // disable the Ok button
	}
}

//-------------------------END UI CODE 





// HERE WE check to see if the contents of the PDF have already been harvested.  If not, we show the dialog box window

function exportPDF_function () {
    sourceFolder = Folder.selectDialog('PDF の内容は「contents.txt」として保存します。保存したいフォルダを選んでください。')
    var C = new File(sourceFolder + '/contents.txt')
    if (sourceFolder) {

        win.center ();
        win.show();
        
        }
}







function doSomething() // Open each page in the range, group all art, move to a new document, then
	{							// with all pages on top of each other, create artboards and move each page
									// to its final own layer, own artboard.
        // get first page and last page to open
    
		var from = txtFrom.text;
		var to = txtTo.text;

        // create destination document, pdf open options, etc
		app.userInteractionLevel = UserInteractionLevel.DONTDISPLAYALERTS;
		var fileRef = File(txtFile.text); // get file from text edit

		var idoc = app.documents.add(); // add a document;
		var pdfOptions = app.preferences.PDFFileOptions;
		pdfOptions.pDFCropToBox = PDFBoxType.PDFBOUNDINGBOX;

		var spacing = 10; // space between artboards
		var arrPagesInfo = []; // to hold each PDF page name, doc size and art position
		
		for (j=from; j<=to; j++) // open all pages in range, group art, and move the dest document
			{
				pdfOptions.pageToOpen = j; 
                  // Open a file using these preferences

				var pdfDoc = open(fileRef, DocumentColorSpace.CMYK);
				lblStatus.text = "ページ " + j + "を開いています";
				win.update();
				var pdfLayer = pdfDoc.activeLayer;

                　// add a group and group all items
				var items = pdfLayer.pageItems; // get all items in layer, there's only one layer, right?
				var tempGrp = pdfDoc.groupItems.add(); // to group everything in page
				tempGrp.name = "ページ " + j; // name the group, "Page 1", "Page 2", etc
				
				for (i=items.length-1; i>0; i--) // group all items
					{
						items[i].move(tempGrp,ElementPlacement.PLACEATBEGINNING);
					}
				
                   // get document bounds
				
				var pdfw = pdfDoc.width;
				var pdfh = pdfDoc.height;
				var activeAB = pdfDoc.artboards[0];

				pdfLeft = activeAB.artboardRect[0];
				pdfTop = activeAB.artboardRect[1];						

				if (j==from)
					{
						firstabRect = activeAB.artboardRect;
						abRect = firstabRect;
						//$.writeln(abRect);
					}
				else
					{

						if ((abRect[2]+spacing+pdfw)>=8494) // if rightmost artboard position surpases the canvas size,
							{
								var ableft = firstabRect[0]; // position next artboard below the first one
								var abtop = firstabRect[3]-spacing;
								var abright = ableft + pdfw;
								var abbottom = abtop - pdfh;		
								firstabRect = [ableft, abtop, abright, abbottom]; 
							}
						else // if we don't get to the canvas edge, position next artboard, to the right of the last one
							{
								var ableft = pageSpecs[3][2]+spacing; // pageSpecs[3] = abRect // abRect[2] = right position
								var abtop = pageSpecs[3][1]; // abRect[1] = top position
								var abright = ableft + pdfw;
								var abbottom = abtop - pdfh;
							}
						abRect = [ableft, abtop, abright, abbottom];
					}

                  // get this group position relative to top/left
				var deltaX = tempGrp.left-pdfLeft;
				var deltaY = pdfTop-tempGrp.top;

                  // make an array to hold each page Name, width, height, deltaX, deltaY
				pageSpecs = [tempGrp.name, deltaX, deltaY,abRect]; // pageSpecs holds last page info, it gets overwritten as we add pages				
				arrPagesInfo.unshift(pageSpecs); // unshift to make first page, the last in the array

                  // duplicate grouped page 1 onto dest document
				newItem = tempGrp.duplicate( idoc,ElementPlacement.PLACEATBEGINNING);

                  // close current PDF page						
				pdfDoc.close (SaveOptions.DONOTSAVECHANGES);		

			} // end for all pages to open

            // Stage 2, create layers and artboards for each PDF page (group) and reposition 
            // loop thru the groups, add artboards for each and reposition
			var ilayer = idoc.layers[idoc.layers.length-1]; // the one layer so far
			for(k=arrPagesInfo.length-1; k>=0; k--) // last item in the array holds the first PDF page info
				{
                      // add new layer and new AB
					var newAB = idoc.artboards.add(arrPagesInfo[k][3]);						
					var newLayer = idoc.layers.add();
					newLayer.name = arrPagesInfo[k][0]
					
                      // reposition group relative to top/left
					var igroup = ilayer.groupItems[k];

					igroup.left = newAB.artboardRect[0]+arrPagesInfo[k][1];
					igroup.top = newAB.artboardRect[1]-arrPagesInfo[k][2];
					igroup.move(newLayer,ElementPlacement.PLACEATEND);
                      // add new artboard to the left of existing one
					lblStatus.text = "ページ " + k + " の位置を調整しています";
					win.update();
				}	
			idoc.artboards[0].remove();
			ilayer.remove();
		
		app.userInteractionLevel = UserInteractionLevel.DISPLAYALERTS;	
		lblStatus.text = "HOTARU LIGHTS THE WAY TO THE FUTURE";
        
        importPDF_function();
        
	}// end doSomething Function

function end() {
    }

//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// This is the start of the actual program which gets the text and replaces it with translated text ------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function importPDF_function () {
    
    var open = true;

    try {
        var doc = app.activeDocument  }
    catch (err) {
        alert('対象ファイルをオープンしてください。');
        open = false;
        }
    if (open == true) {
        var items = doc.pageItems
        var text_counters = new Array()

        var C = new File(sourceFolder + '/contents.txt')
        C.open('e');
        C.encoding = "UTF-8";

        for (var i = 0; i < items.length; i++) {
            if (items[i].contents != undefined) {
                text_counters.push(i)
                C.writeln(items[i].contents);
                }
            }
        C.close();


        var replacement_contents = new File(sourceFolder.getFiles("contents.txt_GT.txt"));
        if (replacement_contents.exists == false) {
            alert('この PDF の内容の全てが「contents.txt」というテキストファイルに保存されている状態になりました。\n\n「入力」機能を使う前に、「逆引ヘルパー」を起動してください。\n\n「逆引ヘルパー」の作業が終わったら、このスクリプトの「入力」機能を使ってください。')
            } 
        else {
            replacement_contents.open('r')
            var all_contents = replacement_contents.read()
            var split_contents = all_contents.split("\n")
            for (var p = 0; p < text_counters.length; p++) {
                items[text_counters[p]].contents = split_contents[p]
                }

            replacement_contents.close();
            replacement_contents.remove();
            C.remove();

            alert('このPDFの言語が変更されました。\n\nレイアウトがおかしくなったところがある可能性が高いですので、\n自分の目で確認してください。\n\nその上、テキストがラスタライズされた場合、\n翻訳が出来ないですので、ラスタライズされた原文が\n残っている怖れがあります。');
            }
        }
    }





function exportAI_function () {
    sourceFolder = Folder.selectDialog('インデザインとリンクしている *.ai ファイルのフォルダを選択してください。')
    if (sourceFolder) {
        var files = sourceFolder.getFiles(/\.(eps|ai)$/i);
        for (var f = 0; f < files.length; f++) {
            app.open(files[f]);
            var C = new File(sourceFolder + '/' + files[f].name + '.txt');
            var D = new File(sourceFolder + '/' + files[f].name + '_counter.txt');
            C.open('e');
            C.encoding = "UTF-8";
            D.open('e');
            D.encoding = "UTF-8";
            var doc = app.activeDocument
            var items = doc.pageItems
            for (var i = 0; i < items.length; i++) {
                if (items[i].contents != undefined) {
                    D.writeln(i);
                    C.writeln(items[i].contents);
                    $.writeln(items[i].contents);
                    }
                }
            C.close();
            doc.close();
            }
            alert('フォルダの中の*.ai ファイルの内容が抽出されました。\n\nこれから、「逆引ヘルパー」を起動して、\n抽出された内容を翻訳してください。');
        }
    }

function importAI_function () {
    sourceFolder = Folder.selectDialog('インデザインとリンクしている *.ai ファイルのフォルダを選択してください。')
    if (sourceFolder) {
        var ai_files = sourceFolder.getFiles(/\.(eps|ai)$/i);
        var text_files = sourceFolder.getFiles(/\.txt$/i);
        for (var f = 0; f < ai_files.length; f++) {
            for (var t = 0; t < text_files.length-1; t++) {
                if (ai_files[f].name === text_files[t].name.replace(".txt_GT.txt", "")) {  // if the text file and the ai file name are the same...
                    var replacement_file = text_files[t]                                                 // assign the text file as replacement file
                    var replacement_counter = text_files[t+1]                                     // assign the counter file as the counter file
                    
                    replacement_file.open('r')
                    replacement_counter.open('r')
                    
                    var all_contents = replacement_file.read()
                    var all_counters = replacement_counter.read()
                    
                    var split_contents = all_contents.split("\n")
                    var split_counters = all_counters.split("\n")
                    
                    app.open(ai_files[f])
                    
                    var doc = app.activeDocument
                    var items = doc.pageItems
            
                    for (var p = 0; p < split_counters.length; p++) {
                        items[split_counters[p]].contents = split_contents[p]
                        }                    
                    
                    replacement_file.close();
                    replacement_counter.close();
                    
                    doc.saveAs(doc.fullName);
                    doc.close();
                    }
                }
            }
        for (var t = 0; t < text_files.length; t++) {
            text_files[t].remove();
            }
            alert('フォルダの中の*.ai ファイルの言語が変更されました。\n\nレイアウトがおかしくなったところがある可能性が高いですので、\n自分の目で確認してください。\n\nその上、テキストがラスタライズされた場合、\n翻訳が出来ないですので、ラスタライズされた原文が\n残っている怖れがあります。');
        }
    }


    
            
            