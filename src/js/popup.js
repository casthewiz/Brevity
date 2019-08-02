const auditButton = document.getElementById("auditButton");
const placeholder = document.getElementById("placeholder");
const results = document.getElementById('resultsContainer')
const resultsBody = document.getElementById('resultsBody')


const hideContent = () => {
    placeholder.classList.add('hidden')
    results.classList.add('hidden')
}

const gradeToCopy = (grade) => {
    if (grade < 13){
        return grade + 'th'
    }
    
    if (grade > 12 && grade < 15){
        return 'College Level'
    }

    if (grade > 14){
        return 'Post Graduate Level'
    }
}

const appendList = (title, items) => {
    let node = document.createElement("P");
    let h4 = document.createElement("H4");
    h4.innerText = title;
    node.appendChild(h4)

    items.forEach(item => {
            let div = document.createElement("DIV");
            div.innerText = item
            div.className = 'mbSpacer'
            node.appendChild(div)
    })

    resultsBody.appendChild(node)

};

auditButton.addEventListener("click", () => {
    hideContent();
    console.log("clicked")
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {type: "getTextItems"}, function(items = false) {
            console.log(items)
            if (!items) {
                placeholder.classList.remove('hidden')
            } else {
                const gradeSets = {};
                Object.keys(items).forEach(key => {
                    if (key.split(' ').length > 6){    
                        let gradeKey = gradeToCopy(items[key].grade)
                        if (!Array.isArray(gradeSets[gradeKey])) gradeSets[gradeKey] = [];
                        gradeSets[gradeKey].push(key)
                    }
                })
                console.log(gradeSets)
                const sortedListGrades = Object.keys(gradeSets).sort().reverse()
                sortedListGrades.forEach(grade => {
                    appendList(grade, gradeSets[grade])
                })
                results.classList.remove('hidden')
            }
        });
    });
}, false)