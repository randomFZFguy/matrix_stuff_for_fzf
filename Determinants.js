		var myDiv = $("#myDiv")[0];
		
		var m = {
			reset: function rand() {
				m.elems = [];
				m.size = 0;
				m.usefulRows = 0;
				m.col = -1;
				m.row = 0;
			},
			elems: [],
			size: 0,
			usefulRows: 0,
			col: -1,
			row: 0
		};
		
		//====== GetMatrixSize ========================
		function GetMatrixSize(form) {
			ClearBox("myDiv");
			var size = form.inputbox.value;
			HandleInputSize(size)
		}
		
		//====== HandleInputSize ======================
		function HandleInputSize(size) {
			if (size > 0 && size < 16) {
				Explain("Matrix size: " + size);
				Explain("Fill in the matrix. You can leave 0 cells empty.")
				m.reset();
				AddInputTableAndHandleInputData(size);
			} else {
				Explain("You entered an invalid matrix size. We'll use the example matrix.")
				m.reset();
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
					m.elems[row] = [];
					for (var col = 0; col < size; col ++) {
						if (inputCell[row][col].value != "") {
							m.elems[row][col] = inputCell[row][col].value;
						} else {
							m.elems[row][col] = 0;
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
				m.usefulRows = size;
				m.size = size;
				AddTable();
				ChooseAMethod();
			} else {
				m.elems = [[2,4,-4,0,2,1],
									[0,4,-3,0,6,0],
									[0,2,5,13,-3.5,0],
									[0,-2,-1,4,-0.5,-9],
									[1,5,0,1,-5,1],
									[1,0,2,0,-2,-2]];
				m.size = m.elems.length;
				m.usefulRows = m.elems.length;
				AddTable();
				ChooseAMethod();
			}
		}
		
		//====== ChooseAMethod ========================
		function ChooseAMethod() {
			if (document.getElementById('methodGauss').checked) {
				GaussMethod();
			} else if (document.getElementById('methodLaplace').checked) {
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
			for (var col = 0; col < m.size; col ++) {
				var th = document.createElement("th");
				th.appendChild(document.createTextNode(col));
				if (col == m.col) {
					th.style.color = "FF0000";
				}
				tr.appendChild(th);
			}
			
			// rows
			for (var row = 0; row < m.size; row ++) {
				var tr = document.createElement("tr");
				for (var col = 0; col < m.size; col ++) {
					var td = document.createElement("td");
					if (col == row) {
						td.style.background = "#E1E1E1";
					}
					td.appendChild(document.createTextNode(m.elems[row][col]));
					tr.appendChild(td)
					
					if (m.col == col && (currentRow1 == row || currentRow2 == row)) {
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

		//====== GaussMethod ==========================
		function GaussMethod() {
			Explain("Gauss Elimination Method:");
			for (var col = 0; col < m.size ; col ++) {
				m.col ++;
				m.row = m.col;
				for (var row = col + 1; row < m.usefulRows; row ++) {
					m.row ++;
					HandleMatrixCell();
				}
				//Normalize();
			}
			Explain("The determinant is " + MultiplyDiagonal() + ".");
		}
		
		//====== HandleMatrixCell =====================
		function HandleMatrixCell() {
			if (m.elems[m.row][m.col] !== 0) {
				addendRow = m.col;
				PutZeroRowsAtTop();
				IfDiagonalCellIsZero();
				if (!IsRowZero() && m.elems[m.row][m.col] !== 0) {
					//Normalize();
					AddRows(addendRow, m.row, m.elems[m.row][m.col] / m.elems[addendRow][m.col]);
				}
			}
		}
			
		//====== PutZeroRowsAtTop =====================
		function PutZeroRowsAtTop() {
			while (IsRowZero() && m.usefulRows > 0) {
				m.usefulRows --;
				SwitchRows(m.col, m.usefulRows);
			}
		}
		
		//====== IfDiagonalCellIsZero =================
		function IfDiagonalCellIsZero() {
			if (m.elems[m.col][m.col] == 0) {
				SwitchRows(m.row, m.col);
			}
		}
	
		//====== IsRowZero ============================
		function IsRowZero() {
			var rowIsZero = true;
			for (var col = 0; col < m.size; col ++) {
				if (m.elems[m.col][col] !== 0) {
					rowIsZero = false;
					break;
				}
			}
			return rowIsZero;
		}
		
		//====== Normalize ============================
		function Normalize() {
			var multiplier = m.elems[m.col][m.col];
			if (multiplier != 0 && multiplier != 1) {
				for (var col = 0; col < m.size; col ++) {
					m.elems[m.col][col] /= multiplier;
				}
				
				Explain("Normalizing row " + m.col + ":");
				AddTable(m.col);
			}
		}
		
		//====== AddRows ==============================
		function AddRows(addend, target, multiplier) {
			for (var col = 0; col < m.size; col ++) {
				m.elems[target][col] -= multiplier * m.elems[addend][col];
			}
			
			Explain("(row " + target + ") += (row " + addend + ") * (" + -multiplier + "):");
			AddTable(addend, target);
		}
		
		//====== SwitchRows ===========================
		function SwitchRows(row1, row2) {
			var temp = 0;
			for (var col = 0; col < m.size; col ++) {
				temp = m.elems[row1][col];
				m.elems[row1][col] = m.elems[row2][col];
				m.elems[row2][col] = temp;
			}
			
			Explain("Switching row " + row1 + " with row " + row2 + ":");
			AddTable(row1, row2);
		}
		
		//====== MultiplyDiagonal =====================
		function MultiplyDiagonal() {
			var product = 1;
			for (var i = 0; i < m.size; i ++) {
				product *= m.elems[i][i];
			}
			return product;
		}
		
		
		//====== LaplaceNethod ========================
		function LaplaceMethod() {
			Explain("Laplace Method:");
			Explain("The determinant is " + FindDeterminant());
		}
		
		//====== FindDeterminant ======================
		function FindDeterminant(matrix, size) {
			if (!matrix) {
				matrix = m.elems;
				size = m.size;
			} else {
				matrix = JSON.parse(matrix);
			}
			
			var determinant = 0;
			
			if (size > 3) {
				for (var i = 0; i < size; i ++) {
					// Math.pow(-1, i) = Math.pow(-1, (0 + 1) + (i + 1))
					determinant += matrix[0][i] * Math.pow(-1, i) * FindDeterminant(GetMinor(JSON.stringify(matrix), size, 0, i), size - 1);
				}
			} else if (size == 3) {
				determinant += Find3x3Determinant(JSON.stringify(matrix));
				Explain("The determinant of this 3x3 matrix is " + determinant);
			} else if (size == 2) {
				determinant += Find2x2Determinant(JSON.stringify(matrix));
				Explain("The determinant of this 2x2 matrix is " + determinant);
			} else if (size == 1) {
				determinant += Find1x1Determinant(JSON.stringify(matrix));
				Explain("The determinant of this 1x1 matrix is " + determinant);
			}
			
			return determinant;
		}
		
		//====== GetMinor =============================
		function GetMinor(matrix, size, i, j) {
			var matrix = JSON.parse(matrix);
			var minor = [];
			for (var row = 0; row < size - 1; row ++) {
				minor[row] = [];
				for (var col = 0; col < size - 1; col ++) {
					if (col >= j) {
						if (row >= i) {
							minor[row][col] = matrix[row + 1][col + 1];
						} else {
							minor[row][col] = matrix[row + 1][col + 1];
						}
					} else {
						if (row >= i) {
							minor[row][col] = matrix[row + 1][col];
						} else {
							minor[row][col] = matrix[row][col];
						}
					}
				}
			}
			Explain("We removed row " + i + " and column " + j + ":");
			AddTableLaplace(JSON.stringify(minor), size - 1);
			return JSON.stringify(minor);
		}
		
		//====== Find3x3Determinant ===================
		function Find3x3Determinant(matrix) {
			var matrix = JSON.parse(matrix);
			var determinant = matrix[0][0] * matrix[1][1] * matrix[2][2] +
												matrix[0][1] * matrix[1][2] * matrix[2][0] +
												matrix[0][2] * matrix[1][0] * matrix[2][1] -
												matrix[0][0] * matrix[1][2] * matrix[2][1] -
												matrix[0][1] * matrix[1][0] * matrix[2][2] -
												matrix[0][2] * matrix[1][1] * matrix[2][0];
			return determinant;
		}
		
		//====== Find2x2Determinant ===================
		function Find2x2Determinant(matrix) {
			var matrix = JSON.parse(matrix);
			var determinant = matrix[0][0] * matrix[1][1] -
												matrix[0][1] * matrix[1][0];
			return determinant;
		}
		
		//====== Find1x1Determinant ===================
		function Find1x1Determinant(matrix) {
			var matrix = JSON.parse(matrix);
			var determinant = matrix[0][0] * 1; // to make it a number
			return determinant;
		}
		
		//====== AddTableLaplace ======================
		function AddTableLaplace(matrix, size) {
			var table = document.createElement("table");
			table.className += " table table-bordered";
			var tableBody = document.createElement("tbody");
			table.appendChild(tableBody);
			
			var matrix = JSON.parse(matrix);
			
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
					td.appendChild(document.createTextNode(matrix[row][col]));
					tr.appendChild(td)
				}
				
				tableBody.appendChild(tr);
			}
			
			myDiv.appendChild(table);
		}
		
		
		//====== Explain ==============================
		function Explain(explanation) {
			var para = document.createElement("p");
			myDiv.appendChild(para);
			var text = document.createTextNode(explanation);
			para.appendChild(text);
		}
		
		//====== ClearBox =============================
		function ClearBox(elementID) {
			document.getElementById(elementID).innerHTML = "";
		}
