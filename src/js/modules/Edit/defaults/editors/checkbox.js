//checkbox
export default function(cell, onRendered, success, cancel, editorParams){
	var value = cell.getValue(),
	input = document.createElement("input"),
	tristate = editorParams.tristate,
	defaultValue = typeof editorParams.defaultValue === "undefined" ? null : editorParams.defaultValue,
	defaultState = false,
	trueValueSet = Object.keys(editorParams).includes("trueValue"),
	falseValueSet = Object.keys(editorParams).includes("falseValue");

	input.setAttribute("type", "checkbox");
	input.style.marginTop = "5px";
	input.style.boxSizing = "border-box";

	if(editorParams.elementAttributes && typeof editorParams.elementAttributes == "object"){
		for (let key in editorParams.elementAttributes){
			if(key.charAt(0) == "+"){
				key = key.slice(1);
				input.setAttribute(key, input.getAttribute(key) + editorParams.elementAttributes["+" + key]);
			}else{
				input.setAttribute(key, editorParams.elementAttributes[key]);
			}
		}
	}

	input.value = value;

	if(tristate && (typeof value === "undefined" || value === defaultValue || value === "")){
		defaultState = true;
		input.indeterminate = true;
	}

	if(this.table.browser != "firefox" && this.table.browser != "safari"){ //prevent blur issue on mac firefox
		onRendered(function(){
			if(cell.getType() === "cell"){
				input.focus({preventScroll: true});
			}
		});
	}

	input.checked = trueValueSet ? value === editorParams.trueValue : (value === true || value === "true" || value === "True" || value === 1);

	function setValue(blur){
		var checkedValue = input.checked;

		if(trueValueSet && checkedValue){
			checkedValue = editorParams.trueValue;
		}else if(falseValueSet && !checkedValue){
			checkedValue = editorParams.falseValue;
		}

		if(tristate){
			if(!blur){
				if(input.checked && !defaultState){
					input.checked = false;
					input.indeterminate = true;
					defaultState = true;
					return defaultValue;
				}else{
					defaultState = false;
					return checkedValue;
				}
			}else{
				if(defaultState){
					return defaultValue;
				}else{
					return checkedValue;
				}
			}
		}else{
			return checkedValue;
		}
	}

	//submit new value on blur
	input.addEventListener("change", function(e){
		success(setValue());
	});

	input.addEventListener("blur", function(e){
		success(setValue(true));
	});

	//submit new value on enter
	input.addEventListener("keydown", function(e){
		if(e.code == 13){
			success(setValue());
		}
		if(e.code == 27){
			cancel();
		}
	});

	return input;
}
