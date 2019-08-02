window.addEventListener ("load", myMain, false);

function myMain (evt) {
    const theParagraphArray = document.body.innerText.split('\n').map(paragraph => paragraph.split('.'));
    const theTextArray = [].concat.apply([], theParagraphArray)
    // Map of data for each text snippet
    const textDictionary = {}

    const findReadingLevel = (snippet) => {
        const words = snippet.split(' ').length;
        const letters = snippet.split('').filter(letter => letter != ' ').length;
        const sentences = snippet.split('.').length

        function gradify(letters, words, sentences) {
            if ( words < 6 || 0 === sentences) return 0;
            var r = Math.round(4.71 * (letters / words) + 0.5 * (words / sentences) - 21.43);
            return r <= 0 ? 0 : r;
        }

        function levelify(words, readingLevel){ 
            return words < 14
            ? 'Normal'
            : readingLevel >= 10 && words < 14
                ? 'Hard'
                : readingLevel >= 14 ? 'Very Hard'
                : 'Normal';
        }

        const grade = gradify(letters, words, sentences)
        const level = levelify(words, grade)
        return {grade, level};
    }



    const subsetText = theTextArray.filter(snippet => {
        const complexity = findReadingLevel(snippet);
        const threshold = (complexity.grade > 8 || complexity.level !== 'Normal')
        console.log(`complexity: ${complexity.grade} & ${complexity.level}, threshold: ${threshold}`)
        threshold ? textDictionary[snippet] = complexity : null;
        return threshold;
    })

    // Filter for affected items
    // const textItems = [...document.querySelectorAll('*')].filter(n => subsetText.some(text => n.innerText == text))
    // .forEach(a => console.log(a))

    chrome.runtime.onMessage.addListener(
        function(message, sender, sendResponse) {
            switch(message.type) {
                case "getTextItems":
                    sendResponse(textDictionary);
                    break;
                default:
                    console.error("Unrecognised message: ", message);
            }
        }
    );
}