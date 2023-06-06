//Execute a JavaScript immediately after a page has been loaded
window.onload = function() {

    //Data for terms and definitions. This can be stored in a separate .js file, in a JSON file or here in the main file
    let data = {
        terms: [{
            index: 0,
            text: "SalesWay"
        }, {
            index: 1,
            text: "Red Flags"
        }, {
            index: 2,
            text: "Coach"
        }, {
            index: 3,
            text: "Single Sales Objective"
        }, {
            index: 4,
            text: "Opportunity Plan"
        }, {
            index: 5,
            text: "Minimum Acceptable Action"
        },

        ],
        definitions: [{
            index: 0,
            text: "SalesWay MSI Go-to-Customer Methodology"
        }, {
            index: 1,
            text: "Indicate unknowns or uncertainties"
        }, {
            index: 2,
            text: "Acts as a guide"
        }, {
            index: 3,
            text: "Objective aligned to an opportunity"
        }, {
            index: 4,
            text: "Strategic in nature"
        }, {
            index: 5,
            text: "Your walk away point"
        },

        ],
        //this creates matches for indexes. This is a sort of an Answer Sheet
        pairs: {
            0: 0,
            1: 1,
            2: 2,
            3: 3,
            4: 4,
            5: 5,
        }
    };

    let selectedTerm = null, //to make sure none is selected onload
        selectedDef = null,
        termsContainer = document.querySelector("#terms"), //list of terms
        defsContainer = document.querySelector("#defs"); //list of definitions

    let numCorrect = 0

    //This function takes two arguments, that is one term and one def to compare if they match. It returns True or False after compairing values of the "pairs" object property.
    function isMatch(termIndex, defIndex) {
        return data.pairs[termIndex] === defIndex;
    }

    //This function adds HTML elements and content to the specified container (UL).
    function createListHTML(list, container) {
        container.innerHTML = ""; //first, clean up any existing LI elements
        for (let i = 0; i < 6; i++) {
            container.innerHTML = container.innerHTML + "<li data-index='" + list[i]["index"] + "'>" + "<span>" + list[i]["text"] + "</span>" + "</li>";
            //OR shorter version: container.innerHTML += "<li data-index='" + list[i]["index"] + "'>" + list[i]["text"] + "</li>";
        }
    }

    createListHTML(data.terms, termsContainer);
    createListHTML(data.definitions, defsContainer);

    //listen for a "click" event on a list of Terms and store the clicked object in the target object
    termsContainer.addEventListener("click", function(e) {
        let target = e.target.parentNode;
        if (target.className === "score")
            return;
        let termIndex = Number(target.getAttribute("data-index"));
        //warunek na to, że tylko jedno LI może być zaznaczone
        if (selectedTerm !== null && selectedTerm !== termIndex) {
            termsContainer.querySelector("li[data-index='" + selectedTerm + "']").removeAttribute("data-selected");
        }

        //kasowanie odznaczenia
        if (target.hasAttribute("data-selected")) {
            target.removeAttribute("data-selected");
            selectedTerm = null;
        }
        //zaznaczanie na klikniecie
        else {
            target.setAttribute("data-selected", true);
            selectedTerm = termIndex;
        }

        if (selectedTerm !== null && selectedDef !== null) {
            let term = document.querySelector("#terms [data-index='" + selectedTerm + "']");
            let def = document.querySelector("#defs [data-index='" + selectedDef + "']");
            if (isMatch(selectedTerm, selectedDef)) {
                term.className = "score";
                def.className = "score";
                numCorrect++
            }

            selectedTerm = null;
            selectedDef = null;
            term.removeAttribute("data-selected");
            def.removeAttribute("data-selected");

        }

        if(numCorrect == 6) {
            $("#sp_correct_ans_popup").show();
        }
    })

    defsContainer.addEventListener("click", function(e) {
        let target = e.target.parentNode;
        if (target.className === "score")
            return;
        let defIndex = Number(target.getAttribute("data-index"));

        if (selectedDef !== null && selectedDef !== defIndex) {
            defsContainer.querySelector("li[data-index='" + selectedDef + "']").removeAttribute("data-selected");
        }

        if (target.hasAttribute("data-selected"))
            target.removeAttribute("data-selected");
        else
            target.setAttribute("data-selected", true);
        selectedDef = Number(target.getAttribute("data-index"));
        if (selectedTerm !== null && selectedDef !== null) {
            //let term = document.querySelector("#terms [data-index='"+selectedTerm+"']");
            let term = termsContainer.querySelector("[data-index='" + selectedTerm + "']");
            //let def = document.querySelector("#defs [data-index='"+selectedDef+"']");
            let def = defsContainer.querySelector("[data-index='" + selectedDef + "']");
            if (isMatch(selectedTerm, selectedDef)) {
                term.className = "score";
                def.className = "score";
                numCorrect++
            }
            selectedTerm = null; //odznacz kliknięcie
            selectedDef = null; //odznacz kliknięcie
            term.removeAttribute("data-selected");
            def.removeAttribute("data-selected");
        }

        if(numCorrect == 6) {
            $("#sp_correct_ans_popup").show();
        }
    })

    function reset() {
        let resetTerms = termsContainer.querySelectorAll("li");
        let resetDefs = defsContainer.querySelectorAll("li");
        for (let i = 0; i < resetTerms.length; i++) {
            resetTerms[i].removeAttribute("class", "score");
            resetTerms[i].removeAttribute("data-selected");
        }
        for (i = 0; i < resetDefs.length; i++) {
            resetDefs[i].removeAttribute("class", "score");
            resetDefs[i].removeAttribute("data-selected");
        }

        selectedTerm = null;
        selectedDef = null;
    }

    function shuffle() {
        randomSort(data.terms)
        randomSort(data.definitions)
        createListHTML(data.terms, termsContainer)
        createListHTML(data.definitions, defsContainer)
    }

    function randomSort(array) {
        let currentIndex = array.length,
            temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (currentIndex !== 0) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element. SWAP
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }

    shuffle();
    document.querySelector("button").addEventListener("click", function() {
        reset();
        termsContainer.setAttribute("class", "fadeOut");
        defsContainer.setAttribute("class", "fadeOut");
        setTimeout(function() {
            shuffle();
            termsContainer.removeAttribute("class", "fadeOut");
            defsContainer.removeAttribute("class", "fadeOut");
        }, 450)
        //shuffle();

    });

}