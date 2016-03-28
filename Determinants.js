		var myDiv = $("#myDiv")[0];
		
		var m = Object.create(null);
		m.reset = function() {
				this.elems = [];
				this.size = 0;
				this.usefulRows = 0;
				this.col = -1;
				this.row = 0;
		}
		
		var mat = [];
		mat[0] = Object.create(m);
		
		//====== GetMatrixSize ========================
		function GetMatrixSize(form) {
			ClearBox("myDiv");
			var size = form.inputbox.value;
			HandleInputSize(size)
		}
		
		//====== HandleInputSize ======================
		function HandleInputSize(size) {
			if (size > 0 && size < 11) {
				Explain("Matrix size: " + size);
				Explain("Fill in the matrix. You can leave 0 cells empty.")
				mat[0].reset();
				AddInputTableAndHandleInputData(size);
			} else {
				Explain("We'll use the example matrix.", "h4")
				mat[0].reset();
				SetMatrix();
			}
		}
		
		//====== AddInputTableAndHandleInputData ======
		function AddInputTableAndHandleInputData(size) {
			var inputTable = document.createElement("table");
			inputTable.className += " table table-bordered";
			var tableBody = document.createElement("tbody");
			inputTable.appendChild(tableBody);
			
			// columns
			var tr = document.createElement("tr");
			tableBody.appendChild(tr);
			for (var col = 0; col < size; col ++) {
				var th = document.createElement("th");
				th.appendChild(document.createTextNode(col));
				tr.appendChild(th);
			}
			
			// rows
			var inputCell = [];
			for (var row = 0; row < size; row ++) {
				var tr = document.createElement("tr");
				inputCell[row] = [];
				for (var col = 0; col < size; col ++) {
					inputCell[row][col] = document.createElement("input");
					inputCell[row][col].type = "text";
					inputCell[row][col].className = "matrixInput";
					var td = document.createElement("td");
					td.appendChild(inputCell[row][col]);
					tr.appendChild(td);
				}
				tableBody.appendChild(tr);
			}
			
			myDiv.appendChild(inputTable);
			
			// submit button
			var submitButton = document.createElement("button");
			var buttonText = document.createTextNode("Submit");
			submitButton.appendChild(buttonText);
			myDiv.appendChild(submitButton);
			submitButton.addEventListener("click", PopulateMatrix);
			
			function PopulateMatrix() {
				for (var row = 0; row < size; row ++) {
					mat[0].elems[row] = [];
					for (var col = 0; col < size; col ++) {
						if (inputCell[row][col].value != "") {
							mat[0].elems[row][col] = inputCell[row][col].value;
						} else {
							mat[0].elems[row][col] = 0;
						}
					}
				}
				Explain("This is the matrix you entered:");
				SetMatrix(size);
			}
		}

		//====== SetMatrix ============================
		function SetMatrix(size) {
			if (size) {
				mat[0].usefulRows = size;
				mat[0].size = size;
				AddTable();
				ChooseAMethod();
			} else {
				mat[0].elems = [[2,4,-4,0,2,1],
									[0,4,-3,0,6,0],
									[0,2,5,13,-3.5,0],
									[0,-2,-1,4,-0.5,-9],
									[1,5,0,1,-5,1],
									[1,0,2,0,-2,-2]];
				mat[0].size = mat[0].elems.length;
				mat[0].usefulRows = mat[0].elems.length;
				AddTable();
				ChooseAMethod();
			}
		}
		
		//====== ChooseAMethod ========================
		function ChooseAMethod() {
			if ($('#methodGauss')[0].checked) {
				GaussMethod();
			} else if ($('#methodLaplace')[0].checked) {
				LaplaceMethod();
			}
		}
		
		//====== AddTable =============================
		function AddTable(currentRow1, currentRow2) {
			var table = document.createElement("table");
			table.className += " table table-bordered";
			var tableBody = document.createElement("tbody");
			
			table.appendChild(tableBody);
			
			// columns
			var tr = document.createElement("tr");
			tableBody.appendChild(tr);
			for (var col = 0; col < mat[0].size; col ++) {
				var th = document.createElement("th");
				th.appendChild(document.createTextNode(col));
				if (col == mat[0].col) {
					th.style.color = "FF0000";
				}
				tr.appendChild(th);
			}
			
			// rows
			for (var row = 0; row < mat[0].size; row ++) {
				var tr = document.createElement("tr");
				for (var col = 0; col < mat[0].size; col ++) {
					var td = document.createElement("td");
					if (col == row) {
						td.style.background = "#E1E1E1";
					}
					td.appendChild(document.createTextNode(mat[0].elems[row][col]));
					tr.appendChild(td)
					
					if (mat[0].col == col && (currentRow1 == row || currentRow2 == row)) {
						td.style.color = "FF0000";
						td.style.fontWeight = "bold";
					}
				}
				
				if (currentRow1 == row || currentRow2 == row) {
					tr.style.background = "#FFFFC2";
				}
				
				tableBody.appendChild(tr);
			}
			
			myDiv.appendChild(table);
		}

		
		//====== Gauss method =========================
		//====== GaussMethod ==========================
		function GaussMethod() {
			Explain("Gauss Elimination Method:", "h4");
			for (var col = 0; col < mat[0].size ; col ++) {
				mat[0].col ++;
				mat[0].row = mat[0].col;
				for (var row = col + 1; row < mat[0].usefulRows; row ++) {
					mat[0].row ++;
					HandleMatrixCell();
				}
				//Normalize();
			}
			Explain("The determinant is " + MultiplyDiagonal() + ".");
		}
		
		//====== HandleMatrixCell =====================
		function HandleMatrixCell() {
			if (mat[0].elems[mat[0].row][mat[0].col] !== 0) {
				addendRow = mat[0].col;
				PutZeroRowsAtTop();
				IfDiagonalCellIsZero();
				if (!IsRowZero() && mat[0].elems[mat[0].row][mat[0].col] !== 0) {
					//Normalize();
					AddRows(addendRow, mat[0].row, mat[0].elems[mat[0].row][mat[0].col] / mat[0].elems[addendRow][mat[0].col]);
				}
			}
		}
			
		//====== PutZeroRowsAtTop =====================
		function PutZeroRowsAtTop() {
			while (IsRowZero() && mat[0].usefulRows > 0) {
				mat[0].usefulRows --;
				SwitchRows(mat[0].col, mat[0].usefulRows);
			}
		}
		
		//====== IfDiagonalCellIsZero =================
		function IfDiagonalCellIsZero() {
			if (mat[0].elems[mat[0].col][mat[0].col] == 0) {
				SwitchRows(mat[0].row, mat[0].col);
			}
		}
	
		//====== IsRowZero ============================
		function IsRowZero() {
			var rowIsZero = true;
			for (var col = 0; col < mat[0].size; col ++) {
				if (mat[0].elems[mat[0].col][col] !== 0) {
					rowIsZero = false;
					break;
				}
			}
			return rowIsZero;
		}
		
		//====== Normalize ============================
		function Normalize() {
			var multiplier = mat[0].elems[mat[0].col][mat[0].col];
			if (multiplier != 0 && multiplier != 1) {
				for (var col = 0; col < mat[0].size; col ++) {
					mat[0].elems[mat[0].col][col] /= multiplier;
				}
				
				Explain("Normalizing row " + mat[0].col + ":");
				AddTable(mat[0].col);
			}
		}
		
		//====== AddRows ==============================
		function AddRows(addend, target, multiplier) {
			for (var col = 0; col < mat[0].size; col ++) {
				mat[0].elems[target][col] -= multiplier * mat[0].elems[addend][col];
			}
			
			Explain("(row " + target + ") += (row " + addend + ") * (" + -multiplier + "):");
			AddTable(addend, target);
		}
		
		//====== SwitchRows ===========================
		function SwitchRows(row1, row2) {
			var temp = 0;
			for (var col = 0; col < mat[0].size; col ++) {
				temp = mat[0].elems[row1][col];
				mat[0].elems[row1][col] = mat[0].elems[row2][col];
				mat[0].elems[row2][col] = temp;
			}
			
			Explain("Switching row " + row1 + " with row " + row2 + ":");
			AddTable(row1, row2);
		}
		
		//====== MultiplyDiagonal =====================
		function MultiplyDiagonal() {
			var product = 1;
			for (var i = 0; i < mat[0].size; i ++) {
				product *= mat[0].elems[i][i];
			}
			return product;
		}
		
		
		//====== Laplace method =======================
		//====== LaplaceMethod ========================
		function LaplaceMethod() {
			Explain("Laplace Method:", "h4");
			Explain("The determinant is " + FindDeterminant(mat[0].size), "h4");
		}
		
		//====== FindDeterminant ======================
		function FindDeterminant(size) {
			var determinant = 0;
			var lvl = mat[0].size - size;
			// lvl is the level of recursion. It increases as "size" decreases.
			
			if (size > 3) {
				for (var i = 0; i < size; i ++) {
					// Math.pow(-1, i) == Math.pow(-1, (0 + 1) + (i + 1))
					GetMinor(size, 0, i);
					determinant += mat[lvl].elems[0][i] * Math.pow(-1, i) * FindDeterminant(size - 1);
				}
			} else if (size == 3) {
				determinant += Find3x3Determinant();
				Explain("The determinant of this 3x3 matrix is " + determinant + ".");
			} else if (size == 2) {
				determinant += Find2x2Determinant();
				Explain("The determinant of this 2x2 matrix is " + determinant + ".");
			} else if (size == 1) {
				determinant += Find1x1Determinant();
				Explain("The determinant of this 1x1 matrix is " + determinant + ".");
			}
			
			return determinant;
		}
		
		//====== GetMinor =============================
		function GetMinor(size, i, j) {
			var lvl = mat[0].size - size + 1;
			mat[lvl] = Object.create(m);
			mat[lvl].reset();
			mat[lvl].size = size - 1;
			
			for (var row = 0; row < mat[lvl].size; row ++) {
				mat[lvl].elems[row] = [];
				for (var col = 0; col < mat[lvl].size; col ++) {
					if (col >= j) {
						if (row >= i) {
							mat[lvl].elems[row][col] = mat[lvl - 1].elems[row + 1][col + 1];
						} else {
							mat[lvl].elems[row][col] = mat[lvl - 1].elems[row + 1][col + 1];
						}
					} else {
						if (row >= i) {
							mat[lvl].elems[row][col] = mat[lvl - 1].elems[row + 1][col];
						} else {
							mat[lvl].elems[row][col] = mat[lvl - 1].elems[row][col];
						}
					}
				}
			}
			Explain("The minor with row " + i + " and column " + j + " removed:");
			AddTableLaplace(mat[lvl].size);
		}
		
		//====== Find3x3Determinant ===================
		function Find3x3Determinant() {
			var lvl = mat[0].size - 3;
			var determinant = mat[lvl].elems[0][0] * mat[lvl].elems[1][1] * mat[lvl].elems[2][2] +
												mat[lvl].elems[0][1] * mat[lvl].elems[1][2] * mat[lvl].elems[2][0] +
												mat[lvl].elems[0][2] * mat[lvl].elems[1][0] * mat[lvl].elems[2][1] -
												mat[lvl].elems[0][0] * mat[lvl].elems[1][2] * mat[lvl].elems[2][1] -
												mat[lvl].elems[0][1] * mat[lvl].elems[1][0] * mat[lvl].elems[2][2] -
												mat[lvl].elems[0][2] * mat[lvl].elems[1][1] * mat[lvl].elems[2][0];
			return determinant;
		}
		
		//====== Find2x2Determinant ===================
		function Find2x2Determinant() {
			var lvl = mat[0].size - 2;
			var determinant = mat[lvl].elems[0][0] * mat[lvl].elems[1][1] -
												mat[lvl].elems[0][1] * mat[lvl].elems[1][0];
			return determinant;
		}
		
		//====== Find1x1Determinant ===================
		function Find1x1Determinant() {
			var lvl = mat[0].size - 1;
			var determinant = mat[lvl].elems[0][0] * 1; // to make it a number
			return determinant;
		}
		
		//====== AddTableLaplace ======================
		function AddTableLaplace(size) {
			var lvl = mat[0].size - size;
			
			var table = document.createElement("table");
			table.className += "table table-bordered";
			var tableBody = document.createElement("tbody");
			table.appendChild(tableBody);
			
			// columns
			var tr = document.createElement("tr");
			tableBody.appendChild(tr);
			for (var col = 0; col < size; col ++) {
				var th = document.createElement("th");
				th.appendChild(document.createTextNode(col));
				tr.appendChild(th);
			}
			
			// rows
			for (var row = 0; row < size; row ++) {
				var tr = document.createElement("tr");
				for (var col = 0; col < size; col ++) {
					var td = document.createElement("td");
					if (col == row) {
						td.style.background = "#E1E1E1";
					}
					td.appendChild(document.createTextNode(mat[lvl].elems[row][col]));
					tr.appendChild(td)
				}
				
				tableBody.appendChild(tr);
			}
			
			myDiv.appendChild(table);
		}
		
		
		//====== Helper functions =====================
		//====== Explain ==============================
		function Explain(explanation, type) {
			if (!type) {
				var para = document.createElement("p");
			} else if (type == "h4") {
				var para = document.createElement("h4");
			}
			myDiv.appendChild(para);
			var text = document.createTextNode(explanation);
			para.appendChild(text);
		}
		
		//====== ClearBox =============================
		function ClearBox(elementID) {
			document.getElementById(elementID).innerHTML = "";
		}
